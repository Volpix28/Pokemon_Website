import pokHelp from '../helper/pokemon.js'
import windowEvents from '../helper/windowEvents.js'
import { Loader, Dataset } from '../helper/dataHelper.js'
import { updateStats } from './pokeStats.js'
import { updateDetails } from './bubblesDetails.js'



const minBubbleSize = 10
const maxBubbleSize = 40
const svgInnerPadding = 200

let data = await Loader.get(Dataset.bubbles, 5)

// Color schema and UI
const typesWithColor = pokHelp.getAllTypesWithColorCode();
const color = (g) => typesWithColor[pokHelp.getTypeNameFromDeName(g)];
const currName = (name) => {
    d3.select("#title-content").text(name);
}


function renderPokemonBubbles(parentSelector, data, onBubbleClick) {
    const getSvgJsElement = () => parentSelector().select('svg.poke-bubbles');
    let width = getSvgJsElement().node().clientWidth;
    let height = 800;

    // Node prep
    const pack = (data) => d3.pack()
        .size([width, height])
        .radius(d => d.value)
        .padding(1)(
            d3.hierarchy(data).sum(d => d.value)
        )

    // Forces for simulation
    const forceCollide = () => {
        const alpha = 0.4; // fixed for greater rigidity!
        const padding1 = 2 * 3; // separation between same-color nodes
        const padding2 = 5 * 3; // separation between different-color nodes
        let nodes;
        let maxRadius;

        function force() {
            const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
            for (const d of nodes) {
                const r = d.r + maxRadius;
                const nx1 = d.x - r,
                    ny1 = d.y - r;
                const nx2 = d.x + r,
                    ny2 = d.y + r;
                quadtree.visit((q, x1, y1, x2, y2) => {
                    if (!q.length)
                        do {
                            if (q.data !== d) {
                                const r = d.r + q.data.r + (d.data.group === q.data.data.group ? padding1 : padding2);
                                let x = d.x - q.data.x,
                                    y = d.y - q.data.y,
                                    l = Math.hypot(x, y);
                                if (l < r) {
                                    l = (l - r) / l * alpha;
                                    d.x -= x *= l, d.y -= y *= l;
                                    q.data.x += x, q.data.y += y;
                                }
                            }
                        } while (q = q.next);
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            }
        }
        force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.r) + Math.max(padding1, padding2);
        return force;
    }
    const forceBorder = (strength) => {
        let nodes;
        let force = function(a) {
            for (const d of nodes) {
                if ((d.x - d.r) >= width) d.x = width + d.r;
                if ((d.x + d.r) <= 0) d.x = -d.r;
                if ((d.y - d.r) >= height) d.y = height + d.r;
                if ((d.y + d.r) <= 0) d.y = -d.r;

                if ((d.x + d.r * 2) >= width) d.vx -= strength;
                if ((d.x - d.r * 2) <= 0) d.vx += strength;
                if ((d.y + d.r * 2) >= height) d.vy -= strength;
                if ((d.y - d.r * 2) <= 0) d.vy += strength;
            }
        }
        force.initialize = _ => nodes = _;
        return force;
    }
    const forceMiddle = (strength) => {
        let nodes;
        let force = function(a) {
            let mx = width / 2, my = height / 2
            let rx = height / width, ry = width / height
            for (const d of nodes) {
                d.vx += (mx - d.x) * rx * strength * a;
                d.vy += (my - d.y) * ry * strength * a;
            }
        }
        force.initialize = _ => nodes = _;
        return force;
    }
    const drag = simulation => {
        let eventStartPos = { x: null, y: null };
        let dragging = false;

        function dragstarted(event, d) {
            d.fx = d.x;
            d.fy = d.y;
            eventStartPos.x = d.x;
            eventStartPos.y = d.y;
        }

        function dragged(event, d) {
            // Create a drag deadzone so that the user has du drag min 10px before the dragging event is triggered
            const dist = Math.abs(eventStartPos.x - event.x) + Math.abs(eventStartPos.y - event.y);
            if (dist > 10 || dragging) {
                dragging = true;
                if (!simulation.running) {
                    // console.log("restart")
                    simulation.alphaTarget(3).restart()
                    simulation.running = true
                }
                d.fx = event.x;
                d.fy = event.y;
            }
        }

        function dragended(event, d) {
            if (simulation.running) {
                simulation.alphaTarget(0);
                simulation.running = true;
            }
            d.fx = null;
            d.fy = null;
            dragging = false;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }


    //Create hierarchy from data
    const rScale = d3.scaleLinear().domain(d3.extent(data.map(it => parseFloat(it.base_total)))).range([minBubbleSize, maxBubbleSize])
    const hierarchyData = {
        children: Array.from(
            d3.group(data.map(it => {
                it.base_total = parseFloat(it.base_total)
                it.value = rScale(it.base_total)
                return it;
            }), d => d.type1),
            ([, children]) => ({children})
        )
    }

    const svg = getSvgJsElement();
    const nodes = pack(hierarchyData)
        .leaves()
        .map((it) => {
            it.x = (Math.random() * (width - svgInnerPadding * 2)) + svgInnerPadding;
            it.y = (Math.random() * (height - svgInnerPadding * 2)) + svgInnerPadding;
            return it;
        });

    const simulation = d3.forceSimulation(nodes)
        .alphaDecay(0.05)
        .force("border", forceBorder(2))
        .force("collide", forceCollide())
        .force("middle", forceMiddle(0.001))
    // .force("debug_alpha", (a) => {
    //     console.log(a)
    // });
    simulation.running = true; // Used to not restart the simulation when clicked only when dragged

    // Create groups
    svg
        .selectAll('g')
        .data(['circles', 'text'])
        .join('g')

    const node = svg.select('g:nth-child(1)')
        .selectAll('circle')
        .data(nodes)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .call(function (d) {
            d.lastX = d.x;
            d.lastY = d.y;
        })
        .attr("fill", d => color(d.data.type1))
        //.attr("class", d => "fill-" + pokHelp.getTypeNameFromDeName(d.data.type1))
        .call(drag(simulation))
        .on('mouseover', (e, node) => {
            e.target.setAttribute('stroke', 'black')
            e.target.setAttribute('stroke-width', '3')
            currName(node.data.ger_name)
        }).on('mouseout', (e) => {
            e.target.setAttribute('stroke', null)
            e.target.setAttribute('stroke-width', null)
        })
        .on('click', (e, d) => onBubbleClick(d.data))
    onBubbleClick(data[0])

    node.transition()
        .delay((d, i) => Math.random() * 1000)
        .duration(300)
        .attrTween("r", d => {
            const i = d3.interpolate(0, d.r);
            return t => d.r = i(t);
        });

    // Create text
    const texts = svg.select('g:nth-child(2)')
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("class", d => "text-fill-" + pokHelp.getTypeNameFromDeName(d.data.type1))
        .text((d) => d.data.ger_name)
        .call(function (d) {
            d.lastX = d.x;
            d.lastY = d.y;
        })
        .attr("opacity", "0")
        .attr('style', 'pointer-events: none;')

    texts.transition()
        .delay((d, i) => Math.random() * 1000)
        .duration(3000)
        .attrTween("opacity", d => {
            const i = d3.interpolate(0, 1);
            return t => i(t);
        })

    const grain = 100
    simulation.on("tick", (a) => {
        node
            .attr("cx", d => {
                let tx = Math.round(d.x * grain) / grain
                if ((d.lastX) !== tx) {
                    d.lastX = tx
                    return tx;
                }
                return (d.lastX);
            })
            .attr("cy", d => {
                let ty = Math.round(d.y * grain) / grain
                if ((d.lastY) !== ty) {
                    d.lastY = ty
                }
                return (d.lastY);
            })
        texts.attr("transform", function (d, i, els) {
            let box = els[i].getBoundingClientRect()
            let tx = Math.round((d.x - box.width / 2) * grain) / grain
            let ty = Math.round((d.y + box.height / 5) * grain) / grain
            if ((d.lastX) !== tx || (d.lastY) !== ty) {
                d.lastX = tx; d.lastY = ty;
            }
            return `translate(${d.lastX}, ${d.lastY})`;
        });
    });
    simulation.on("end", () => {
        simulation.stop()
        simulation.running = false
        // console.log("end")
    })

    // Auto resize svg when windows is resizing
    windowEvents.registerOnWindowResize(() => {
        const svgEl = getSvgJsElement().node();
        width = svgEl.clientWidth;
        height = svgEl.clientHeight;

        if (!simulation.running) {
            // console.log("restart")
            simulation.alpha(3).restart();
            simulation.running = true
        }
    });
}
function renderSlider(selector, ticks, onChange) {
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(ticks))
        .max(d3.max(ticks))
        .width(300)
        .step(1)
        .ticks(4)
        .tickFormat(d3.format('1'))
        .tickValues(ticks)
        .default(1)
        .on('onchange', onChange);

    d3
        .select(selector)
        .append('svg')
        .attr('width', 500)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)')
        .call(sliderTime);

    onChange(sliderTime.value())
}

function renderBubbleGroup(parentSelector, gen) {
    const onBubbleClick = d => {
        updateDetails(parentSelector,d, gen);
        updateStats(() => parentSelector().select(".poke-stats-wrapper .poke-stats"), d, gen);
    }
    renderPokemonBubbles(parentSelector, data.filter(it => (+it.generation) === gen), onBubbleClick);
}


// Generate bubbles
d3.range(1, 6).forEach(i => {
    renderBubbleGroup(() => d3.select(`#bubbles-${i}`), i)
})

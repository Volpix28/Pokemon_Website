import {Dataset, Loader} from '../helper/dataHelper.js';


//Data
function getStatsFromPokemon(poke, gen) {
    if (gen !== 1) {
        return [
            { label: "KP", value: parseFloat(poke.stat_kp)},
            { label: "Angriff", value: parseFloat(poke.stat_a)},
            { label: "Vert.", value: parseFloat(poke.stat_d)},
            { label: "Initiative", value: parseFloat(poke.stat_init_or_none)},
            { label: "Sp.-Vert.", value: parseFloat(poke.stat_sd_or_stat_init)},
            { label: "Sp.-Ang.", value: parseFloat(poke.stat_sa_or_stat_special)},
        ];
    } else {
        return [
            { label: "KP", value: parseFloat(poke.stat_kp)},
            { label: "Angriff", value: parseFloat(poke.stat_a)},
            { label: "Vert.", value: parseFloat(poke.stat_d)},
            { label: "Special", value: parseFloat(poke.stat_sa_or_stat_special)},
            { label: "Initiative", value: parseFloat(poke.stat_sd_or_stat_init)},
        ];
    }
}

function renderSpiderChart(selector, data, size) {
    const getSvg = () => selector();

    const svg = getSvg();
    svg
        .attr("width", size)
        .selectAll('g')
        .data(['background', 'axes', 'annotations'])
        .join('g')

    const centerPoint = { x: size / 2, y: size / 2 };
    const radius = size / 3;
    const textRadius = size * (5/12);
    const textLineHeight = "1.2em";
    const axis = d3.scaleLinear()
        .domain([0, 255])
        .range([0, radius])

    const pieDeg = 360 / data.length;
    const calcPoint = (centerPoint, deg, r) => {
        const rad = deg * Math.PI / 180;
        return [ centerPoint.x + Math.sin(rad) * r, centerPoint.y + Math.cos(rad) * r ]
    }
    const intArr = Array.from({length: data.length}, (_, i) => i);
    const points = intArr.map(i => calcPoint(centerPoint, pieDeg * i, radius));
    const dataPoints = intArr.map(i => calcPoint(centerPoint, pieDeg * i, axis(data[i].value)));

    const filledPolygon = d => d3.line()
        .curve(d3.curveLinearClosed)
        (d3.polygonHull(d));
    const filledPolygonTransition = d3
        .transition()
        .ease(d3.easeSin)
        .duration(500)

    // Background polygon
    const backGroup = svg.select('g:nth-child(1)')
    backGroup
        .selectAll('path.spider-chart-background')
        .data([points])
        .join('path')
        .attr('class', 'spider-chart-background')
        .attr("fill", "#cfd1ce")
        .transition(filledPolygonTransition)
        .attr("d", filledPolygon);
    backGroup
        .selectAll('path.spider-chart-axis')
        .data(points)
        .join(
            enter => enter.append("path")
                .attr("opacity", "0")
                .transition(filledPolygonTransition.duration(600))
                .attr("opacity", "1"),
            update => update,
            exit => exit.attr("opacity", "0")
        )
        .attr("opacity", "1")
        .attr('class', 'spider-chart-axis')
        .attr("stroke", "#ffffff")
        .attr("stroke-width", "3")
        .attr("d", p => d3.line()([[centerPoint.x, centerPoint.y], p]))

    // Render inner polygon
    svg.select('g:nth-child(2)')
        .selectAll('path')
        .data([dataPoints])
        .join('path')
        .attr("fill", "rgba(154,154,251,0.9)")
        .transition(filledPolygonTransition)
        .attr("d", filledPolygon)
        .attr("stroke-dashoffset", 0)

    // Render Annotation
    const annotation = svg.select('g:nth-child(3)')
        .selectAll('text')
        .data(intArr.map(i => {
            return {
                point: calcPoint(centerPoint, pieDeg * i, textRadius),
                label: data[i].label,
                score: data[i].value,
            }
        }))
        .join('text')
        .style('text-anchor', "middle")
        .style('dominant-baseline', "middle")
        .attr('x', d => d.point[0])
        .attr('y', d => d.point[1])

    annotation
        .selectAll('tspan')
        .data(d => [
            { text: d.label, x: d.point[0] },
            { text: d.score, x: d.point[0] }
        ])
        .join('tspan')
        .attr('x', d => d.x)
        .attr('dy', (d, i) => i === 0 ? 0 : textLineHeight)
        .text(d => d.text)

}


const size = 350;
const updateStats = function (parentSelector, pokemonData, gen) {
    renderSpiderChart(parentSelector, getStatsFromPokemon(pokemonData, gen), size)
}
export { updateStats }
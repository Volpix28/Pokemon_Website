// Anzahl der Typen - Gen 3


// define dimension
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// define graphic
var svg = d3.select("#typen_3")
    .append("svg")
        .attr("width", width + margin.left + margin.right + 'px')
        .attr("height", height + margin.top + margin.bottom + 'px')
            .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Add tooltips
var tooltip = d3.select("#typen_3")
  .append("div")
  .style("position", "absolute")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px");
// mouseover
var mouseover = function(event, d) {
  tooltip
    .html("Generation: " + d.data[0] + "<br>" + "Amount: " + d.data[1])
    .transition()
      .duration(200)
      .style("opacity", 0.9)
}
mousemove
var mousemove = function(event, d) {
  tooltip
    .style("left", (event.pageX + 10) +"px")
    .style("top", (event.pageY + 10) +"px")
    .style("transform","translateY(-55%)")
}
// mouseleave
var mouseleave = function(event, d) {
  tooltip
    .transition()
      .duration(350)
      .style("opacity", 0)
}



// data 
d3.csv("../res/js/data/types_3.csv").then(function(data) {

    // filter (as tables)
    const allgroup = ["Normal",
                    "Feuer",
                    "Wasser",
                    "Pflanze",
                    "Elektro",
                    "Eis",
                    "Kampf",
                    "Gift",
                    "Boden",
                    "Flug",
                    "Psycho",
                    "Käfer",
                    "Gestein",
                    "Geist",
                    "Unlicht",
                    "Drache",
                    "Stahl",
                    "Fee"]

    d3.select("#selectButton_3")
        .selectAll("myOptions")
            .data(allgroup)
        .join('option')
        .text(d => d)      // text in the menue
        .attr("value", d => d) // corresponding value 


    // x-axis 
    const x = d3.scaleBand()
        .domain(data.map(function (d) {
            return d.gen}))
        .range([0, width])
        .padding(0.2);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))

    // y-axis
    const y = d3.scaleLinear()
        .domain( [0, 80])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // initialize line with type - normal
    const line = svg
        .append('g')
        .append('path')
            .datum(data)
            .attr("d", d3.line()
                .x(function (d) {
                    if (d.gen == "Gen 1") {
                      return 70;
                    } else if (d.gen == "Gen 2") {
                      return 185;
                    } else if (d.gen == "Gen 3") {
                        return 300;
                    }
                })
                .y(d => y(+d.Normal))
            )
            .attr("stroke", "#FED00D")
            .style("stroke-width", 3)
            .style("fill", "none");

    // initialize dots with type - normal
    const dot = svg
        .selectAll("circle")
        .data(data)
        .join("circle")
            .attr("cx", function (d) {
                if (d.gen == "Gen 1") {
                  return 70;
                } else if (d.gen == "Gen 2") {
                  return 185;
                } else if (d.gen == "Gen 3") {
                    return 300
                }
            })
            .attr("cy", d => y(+d.Normal))
            .attr("r", 7)
            .style("opacity", 1)
            .attr("fill", function (d) {
              if (d.gen == "Gen 1") {
                return "#E32925";
              } else if (d.gen == "Gen 2") {
                    return "#F89E33";
              } else if (d.gen == "Gen 3") {
                    return "#34B567";
            }
              })
        .on("mouseover", function(event, d) {
            tooltip
              .html("Generation: " + d["gen"] + "<br>" + "Amount: " + d.value)
              .transition()
                .duration(200)
                .style("opacity", 0.9)
          })
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    // Updating
    function update(selectedTyp) {

        // new data with selection
        const datafilter = data
            .map(function (d) {
                return {gen: d.gen, value:d[selectedTyp]}
        })

        // new data to line
        line 
            .datum(datafilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function (d) {
                    if (d.gen == "Gen 1") {
                    return 70;
                    } else if (d.gen == "Gen 2") {
                    return 185;
                    } else if (d.gen == "Gen 3") {
                        return 300;
                    }
                })
                .y(d => y(+d.value))
            )
        
        dot 
            .data(datafilter)
            .transition()
            .duration(1000)
                .attr("cx", function (d) {
                    if (d.gen == "Gen 1") {
                    return 70;
                    } else if (d.gen == "Gen 2") {
                    return 185;
                    } else if (d.gen == "Gen 3") {
                        return 300;
                    }
                })
                .attr("cy", d => y(+d.value))
    }
    
    // Press the button -> update function
    d3.select("#selectButton_3")
        .on("change", function (event, d)  {
            let selectedOption = d3.select(this).property("value")
            update(selectedOption)
        })

})
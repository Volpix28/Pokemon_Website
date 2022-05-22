// Sales - 1. Generation

// set the dimensions and margins of the graph
const width = 500,
    height = 450,
    margin = 40;


// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

const donutWidth = 65
const legendRectSize = 20
const legendSpacing = 5;

// append the svg object to the div called 'my_dataviz'
let svg = d3.select("#sales_1")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);


// Create dummy data
let data = {Gen1 : 45.69}


// The arc generator
let arc = d3.arc()
  .innerRadius(radius - donutWidth)         // This is the size of the donut hole
  .outerRadius(radius)
  .padAngle(0.4)
  .padRadius(10)
  .cornerRadius(4);

// Another arc that won't be drawn. Just for labels positioning
let outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)

// set the color scale
let color = d3.scaleOrdinal()
  .domain(["Gen1"])
  .range(["#E32925"])

// Compute the position of each group on the pie:
let pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(d => d[1])
let data_ready = pie(Object.entries(data))


// Add tooltips
const tooltip = d3.select("#sales_5")
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
const mouseover = function(event, d) {
  tooltip
    .html("Generation: " + d.data[0] + "<br>" + "Anzahl: " + d.data[1])
    .transition()
      .duration(200)
      .style("opacity", 0.9)
}
// mousemove
const mousemove = function(event, d) {
  tooltip
    .style("left", (event.pageX + 10) +"px")
    .style("top", (event.pageY + 10) +"px")
    .style("transform","translateY(-55%)")
}
// mouseleave
const mouseleave = function(event, d) {
  tooltip
    .transition()
      .duration(350)
      .style("opacity", 0)
}


// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('allSlices')
  .data(data_ready)
  .join('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data[1]))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)


// Add labels:
svg
  .selectAll('allLabels')
  .data(data_ready)
  .join('text')
    .text(d => d.data[0])
    .attr('fill', 'white')
    .each(function (d) {
      var centroid = arc.centroid (d);
        d3.select(this)
        .attr('x', centroid[0])
        .attr('y', centroid[1])
        .attr('dy', '0.2em')
        .attr('dx', '-1.1em')
    })


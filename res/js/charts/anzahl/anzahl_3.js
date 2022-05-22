// Anzahl der Pokemon - Gen 3


// set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


// append the svg object to the body of the page
let anzahl_3 = d3.select("#anzahl_3")
  .append("svg")
    .attr("width", width + margin.left + margin.right + 'px')
    .attr("height", height + margin.top + margin.bottom + 'px')
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);


//create amount of pokemon - data
// pokemon - data
let data1 = [
    {group: "Gen 1", value: 151},
    {group: "Gen 2", value: 251},
    {group: "Gen 3", value: 368}
];

//legi - data
let data2 = [
    {group: "Gen 1", value: 5},
    {group: "Gen 2", value: 6},
    {group: "Gen 3", value: 10}
];


// X axis
let x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2); // schauen ob brauchen
let xAxis = anzahl_3.append("g")
  .attr("transform", `translate(0, ${height})`);

// Add Y axis
let y = d3.scaleLinear()
  .range([ height, 0]);
let yAxis = anzahl_3.append("g")
    .attr("class", "myYaxis");


  // Add tooltips
var tooltip = d3.select("#anzahl_3")
  .append("div")
  .style("position", "absolute")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px");
// // mouseover
var mouseover = function(event, d) {
  tooltip
    .html("Generation: " + d.data[0] + "<br>" + "Amount: " + d.data[1])
    .transition()
      .duration(200)
      .style("opacity", 0.9)
}
// mousemove
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


// A function that create / update the plot for a given variable:
function update(data) {

    // Update the X axis
    x.domain(data.map(function(d) { return d.group; }))
    xAxis.call(d3.axisBottom(x))

    // Update the Y axis
    y.domain([0, d3.max(data, function(d) { return d.value }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    // Create the u variable
    const u = anzahl_3.selectAll("rect")
        .data(data)
        .on("mouseover", function(event, d) {
          tooltip
            .html("Generation: " + d.group + "<br>" + "Amount: " + d.value)
            .transition()
              .duration(200)
              .style("opacity", 0.9)
          })
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    u
        .enter()
        .append("rect") // Add a new rect for each new elements
        .merge(u) // get the already existing elements as well
        .transition() // and apply changes to all of them
        .duration(1000)
          .attr("x", function(d) { return x(d.group); })
          .attr("y", function(d) { return y(d.value); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.value); })
          .style("opacity", 0.7)
          .attr("fill", function (d) {
            if (d.group == "Gen 1") {
              return "#E32925";
            } else if (d.group == "Gen 2") {
              return "#F89E33";
            } else if (d.group == "Gen 3") {
              return "#34B567"
            }
            })


    // If less group in the new dataset, I delete the ones not in use anymore
    u
        .exit()
        .remove()

    
}
d3.select("#all_3")
  .on("click", function() {
    update(data1)
  })
d3.select("#legendary_3")
  .on("click", function() {
    update(data2)
  })


// Initialize the plot with the first dataset
update(data1)

// Animation
anzahl_3.selectAll("rect")
    .transition() // and apply changes to all of them
    .duration(1000)
      .attr("x", function(d) { return x(d.group); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .style("opacity", 0.7)
      .attr("fill", function (d) {
        if (d.group == "Gen 1") {
          return "#E32925";
        } else if (d.group == "Gen 2") {
          return "#F89E33";
        } else if (d.group == "Gen 3") {
          return "#34B567"
        }
        })

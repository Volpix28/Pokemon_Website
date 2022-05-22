
const color_types = {
  "Käfer": "#83C300",
  "Unlicht": "#5B5466",
  "Drache": "#006FC9",
  "Elektro": "#FBD100",
  "Fee": "#FB88EC",
  "Kampf": "#DF3069",
  "Feuer": "#FF9740",
  "Flug": "#8AAAE3",
  "Geist": "#4C6AB2",
  "Pflanze": "#38BE4B",
  "Boden": "#E87235",
  "Eis": "#4CD1C0",
  "Normal": "#919AA3",
  "Gift": "#B666CE",
  "Psycho": "#FF6375",
  "Gestein": "#C8B686",
  "Stahl": "#58909F",
  "Wasser": "#3692DD",
}


// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#treemap3")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// read json data
d3.json("../res/js/data/types3.json").then(function(data){

  
  let root = d3.hierarchy(data).sum(function(d){return d.value})

  const tooltip = d3.select("#treemap3")
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  
    const mouseover = function(event, d) {
        tooltip
          .html("Typ: " + d['data']['type'] + "<br>" + "Pokemon des Types: " + d['data']['value'])
          .transition()
            .duration(200)
            .style("opacity", 0.9)
          //.style("stroke", "black")
          //.style("opacity", 1)
      }
    const mousemove = function(event, d) {
        tooltip
          .style("left", (event.pageX + 70) +"px")
          .style("top", (event.pageY) +"px")
          .style("transform","translateY(-55%)")
      }
      const mouseleave = function(event, d) {
        tooltip
          .transition()
            .duration(350)
            .style("opacity", 0)
      }


  d3.treemap()
    .size([width, height])
    .padding(2)
    (root)

  
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0;})
      .attr('y', function (d) { return d.y0;})
      .attr('width', function (d) { return d.x1 - d.x0;})
      .attr('height', function (d) { return d.y1 - d.y0;})
      .attr('data-name', (tile) => {
          return tile['data']['type']
      })
      .attr('data-value', (tile) => {
            return tile['data']['value']
      })
      .style("stroke", "black")
      .style("fill", (tile) =>{                  // Color the tiles to original hex-codes from the games
          let type = tile['data']['type']
          return color_types[type]        
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on('click', (e, d) => {
          d3.select('#selectButton_3')
              .property('value', d.data.type)
              .dispatch('change')
      });
      

 svg
   .selectAll("text")
   .data(root.leaves())
   .enter()
   .append("text")
     .attr("x", function(d){return d.x0+10}) 
     .attr("y", function(d){return d.y0+20})   
     .text(function(d){return d['data']['type']})
     .attr("font-size", "15px")     
     .attr("fill", "white")
     .attr('text-anchor', (tile) =>{                 
        let width = tile.x1 - tile.x0
        let height = tile.y1 - tile.y0
        if(height > width){
            return 'end' // we give it the position where to rotate
        }else
            return "start"
        })
     // .attr('dominant-baseline', 'central')
     .attr('transform',(tile) =>{                 
        let value = tile['data']['value']
        // console.log(tile)
        let width = tile.x1 - tile.x0
        let height = tile.y1 - tile.y0
        if(height > width){
            return `rotate(270, ${tile.x0+2}, ${tile.y0 + 10})` // we give it the position where to rotate
        }else
            return ""
        }
       )
        
    
})
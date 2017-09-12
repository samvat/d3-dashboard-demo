var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");
var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x2 = d3.time.scale()
    .range([0, width]);

var y2 = d3.scale.linear()
    .range([height, 0]);

var z2 = d3.scale.category10();

var xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient("bottom")
    .ticks(5);

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient("left");

var stack = d3.layout.stack()
    .offset("zero")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; });

var nest = d3.nest()
    .key(function(d) { return d.key; });

var area = d3.svg.area()
    .interpolate("step-after")
    .x(function(d) { return x2(d.date); })
    .y0(function(d) { return y2(d.y0); })
    .y1(function(d) { return y2(d.y0 + d.y); });

var svg2 = d3.select("#graph2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/stocks1.csv", function(error, data2) {
  data2.forEach(function(d) {
    d.date = parseDate(d.date);
    d.value = +parseNum(d.value);
  });
  var dataNest2 = nest.entries(data2);
  var layers = stack(dataNest2);
  legendSpace = width/dataNest2.length; // spacing for the legend
  //console.log();
  x2.domain(d3.extent(data2, function(d) { return d.date; }));
  y2.domain([0, d3.max(data2, function(d) { return d.y0 + d.y; })]);

  svg2.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .attr("id", function(d) { return 'tag'+d.key })
      .style("fill", function(d, i) { return z2(i); })
      .style("opacity", "0.8");

    // dataNest1.forEach(function(d,i) {
    //   // Add the Legend
    //   svg.append("text2")
    //       .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
    //       .attr("y", height + (margin.bottom/2)+ 5)
    //       .attr("class", "legend")    // style the legend
    //       .style("fill", function() { // Add the colours dynamically
    //           return d.color = z(d.key); })
    //       .on("click", function(){
    //         // Determine if current line is visible
    //         var active   = d.active ? false : true,
    //         newOpacity = active ? 0 : 1;
    //         // Hide or show the elements based on the ID
    //         d3.select("#tag"+d.key.replace(/\s+/g, ''))
    //           .transition().duration(100)
    //           .style("opacity", newOpacity);
    //           // Update whether or not the elements are active
    //           d.active = active;
    //             })
    //       .text(d.key);
    // });
  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis2);

  svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis2);
});

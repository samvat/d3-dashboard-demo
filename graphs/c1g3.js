// Set the dimensions of the canvas / graph
var marginc1g3 = {top: 30, right: 20, bottom: 30, left: 50},
    widthc1g3 = length - marginc1g3.left - marginc1g3.right,
    heightc1g3 = breadth - marginc1g3.top - marginc1g3.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");

// Set the ranges
var xc1g3 = d3.time.scale().range([0, widthc1g3]);
var yc1g3 = d3.scale.linear().range([heightc1g3, 0]);

// Define the axes
var xAxisc1g3 = d3.svg.axis().scale(xc1g3)
    .orient("bottom").ticks(5);

var yAxisc1g3 = d3.svg.axis().scale(yc1g3)
    .orient("left").ticks(5);

// Define the line
var pricelinec1g3 = d3.svg.line()
    .x(function(d) { return xc1g3(d.date); })
    .y(function(d) { return yc1g3(d.price); });

// Adds the svg canvas
var svgc1g3 = d3.select("#c1g3")
    .append("svg")
        .attr("width", widthc1g3 + marginc1g3.left + marginc1g3.right)
        .attr("height", heightc1g3 + marginc1g3.top + marginc1g3.bottom)
    .append("g")
        .attr("transform",
              "translate(" + marginc1g3.left + "," + marginc1g3.top + ")");

// Get the data
d3.csv("data/stocksc1g3.csv", function(error, datac1g3) {
    datac1g3.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +d.price;
    });

    // Scale the range of the data
    xc1g3.domain(d3.extent(datac1g3, function(d) { return d.date; }));
    yc1g3.domain([0, d3.max(datac1g3, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNestc1g3 = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(datac1g3);

    // Loop through each symbol / key
    dataNestc1g3.forEach(function(d) {

        svgc1g3.append("path")
            .attr("class", "line")
            .attr("d", pricelinec1g3(d.values));

    });

    // Add the X Axis
    svgc1g3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightc1g3 + ")")
        .call(xAxisc1g3);

    // Add the Y Axis
    svgc1g3.append("g")
        .attr("class", "y axis")
        .call(yAxisc1g3);

});

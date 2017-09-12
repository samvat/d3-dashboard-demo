// Set the dimensions of the canvas / graph
var marginc1g2 = {top: 30, right: 20, bottom: 30, left: 50},
    widthc1g2 = length - marginc1g2.left - marginc1g2.right,
    heightc1g2 = breadth - marginc1g2.top - marginc1g2.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");

// Set the ranges
var xc1g2 = d3.time.scale().range([0, widthc1g2]);
var yc1g2 = d3.scale.linear().range([heightc1g2, 0]);

// Define the axes
var xAxisc1g2 = d3.svg.axis().scale(xc1g2)
    .orient("bottom").ticks(5);

var yAxisc1g2 = d3.svg.axis().scale(yc1g2)
    .orient("left").ticks(5);

// Define the line
var pricelinec1g2 = d3.svg.line()
    .x(function(d) { return xc1g2(d.date); })
    .y(function(d) { return yc1g2(d.price); });

// Adds the svg canvas
var svgc1g2 = d3.select("#c1g2")
    .append("svg")
        .attr("width", widthc1g2 + marginc1g2.left + marginc1g2.right)
        .attr("height", heightc1g2 + marginc1g2.top + marginc1g2.bottom)
    .append("g")
        .attr("transform",
              "translate(" + marginc1g2.left + "," + marginc1g2.top + ")");

// Get the data
d3.csv("data/stocksc1g2.csv", function(error, datac1g2) {
    datac1g2.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +d.price;
    });

    // Scale the range of the data
    xc1g2.domain(d3.extent(datac1g2, function(d) { return d.date; }));
    yc1g2.domain([0, d3.max(datac1g2, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNestc1g2 = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(datac1g2);

    // Loop through each symbol / key
    dataNestc1g2.forEach(function(d) {

        svgc1g2.append("path")
            .attr("class", "line")
            .attr("d", pricelinec1g2(d.values));

    });

    // Add the X Axis
    svgc1g2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightc1g2 + ")")
        .call(xAxisc1g2);

    // Add the Y Axis
    svgc1g2.append("g")
        .attr("class", "y axis")
        .call(yAxisc1g2);

});

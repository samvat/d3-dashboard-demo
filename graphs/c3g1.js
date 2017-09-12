// Set the dimensions of the canvas / graph
var marginc3g1 = {top: 30, right: 20, bottom: 30, left: 50},
    widthc3g1 = length - marginc3g1.left - marginc3g1.right,
    heightc3g1 = breadth - marginc3g1.top - marginc3g1.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");

// Set the ranges
var xc3g1 = d3.time.scale().range([0, widthc3g1]);
var yc3g1 = d3.scale.linear().range([heightc3g1, 0]);

// Define the axes
var xAxisc3g1 = d3.svg.axis().scale(xc3g1)
    .orient("bottom").ticks(5);

var yAxisc3g1 = d3.svg.axis().scale(yc3g1)
    .orient("left").ticks(5);

// Define the line
var pricelinec3g1 = d3.svg.line()
    .x(function(d) { return xc3g1(d.date); })
    .y(function(d) { return yc3g1(d.price); });

// Adds the svg canvas
var svgc3g1 = d3.select("#c3g1")
    .append("svg")
        .attr("width", widthc3g1 + marginc3g1.left + marginc3g1.right)
        .attr("height", heightc3g1 + marginc3g1.top + marginc3g1.bottom)
    .append("g")
        .attr("transform",
              "translate(" + marginc3g1.left + "," + marginc3g1.top + ")");

// Get the data
d3.csv("data/stocksc3g1.csv", function(error, datac3g1) {
    datac3g1.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +d.price;
    });

    // Scale the range of the data
    xc3g1.domain(d3.extent(datac3g1, function(d) { return d.date; }));
    yc3g1.domain([0, d3.max(datac3g1, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNestc3g1 = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(datac3g1);

    // Loop through each symbol / key
    dataNestc3g1.forEach(function(d) {

        svgc3g1.append("path")
            .attr("class", "line")
            .attr("d", pricelinec3g1(d.values));

    });

    // Add the X Axis
    svgc3g1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightc3g1 + ")")
        .call(xAxisc3g1);

    // Add the Y Axis
    svgc3g1.append("g")
        .attr("class", "y axis")
        .call(yAxisc3g1);

});

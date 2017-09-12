// Set the dimensions of the canvas / graph
var marginc2g1 = {top: 30, right: 20, bottom: 30, left: 50},
    widthc2g1 = length - marginc2g1.left - marginc2g1.right,
    heightc2g1 = breadth - marginc2g1.top - marginc2g1.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");

// Set the ranges
var xc2g1 = d3.time.scale().range([0, widthc2g1]);
var yc2g1 = d3.scale.linear().range([heightc2g1, 0]);

// Define the axes
var xAxisc2g1 = d3.svg.axis().scale(xc2g1)
    .orient("bottom").ticks(5);

var yAxisc2g1 = d3.svg.axis().scale(yc2g1)
    .orient("left").ticks(5);

// Define the line
var pricelinec2g1 = d3.svg.line()
    .x(function(d) { return xc2g1(d.date); })
    .y(function(d) { return yc2g1(d.price); });

// Adds the svg canvas
var svgc2g1 = d3.select("#c2g1")
    .append("svg")
        .attr("width", widthc2g1 + marginc2g1.left + marginc2g1.right)
        .attr("height", heightc2g1 + marginc2g1.top + marginc2g1.bottom)
    .append("g")
        .attr("transform",
              "translate(" + marginc2g1.left + "," + marginc2g1.top + ")");

// Get the data
d3.csv("data/stocksc2g1.csv", function(error, datac2g1) {
    datac2g1.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +d.price;
    });

    // Scale the range of the data
    xc2g1.domain(d3.extent(datac2g1, function(d) { return d.date; }));
    yc2g1.domain([0, d3.max(datac2g1, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNestc2g1 = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(datac2g1);

    // Loop through each symbol / key
    dataNestc2g1.forEach(function(d) {

        svgc2g1.append("path")
            .attr("class", "line")
            .attr("d", pricelinec2g1(d.values));

    });

    // Add the X Axis
    svgc2g1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightc2g1 + ")")
        .call(xAxisc2g1);

    // Add the Y Axis
    svgc2g1.append("g")
        .attr("class", "y axis")
        .call(yAxisc2g1);

});

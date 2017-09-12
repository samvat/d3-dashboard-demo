// Set the dimensions of the canvas / graph
var marginc1g1 = {top: 30, right: 20, bottom: 30, left: 50},
    widthc1g1 = length - marginc1g1.left - marginc1g1.right,
    heightc1g1 =  breadth - marginc1g1.top - marginc1g1.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");

// Set the ranges
var xc1g1 = d3.time.scale().range([0, widthc1g1]);
var yc1g1 = d3.scale.linear().range([heightc1g1, 0]);

// Define the axes
var xAxisc1g1 = d3.svg.axis().scale(xc1g1)
    .orient("bottom").ticks(5);

var yAxisc1g1 = d3.svg.axis().scale(yc1g1)
    .orient("left").ticks(5);

// Define the line
var pricelinec1g1 = d3.svg.line()
    .x(function(d) { return xc1g1(d.date); })
    .y(function(d) { return yc1g1(d.price); });

// Adds the svg canvas
var svgc1g1 = d3.select("#c1g1")
    .append("svg")
        .attr("width", widthc1g1 + marginc1g1.left + marginc1g1.right)
        .attr("height", heightc1g1 + marginc1g1.top + marginc1g1.bottom)
    .append("g")
        .attr("transform",
              "translate(" + marginc1g1.left + "," + marginc1g1.top + ")");

// Get the data
d3.csv("data/stocksc1g1.csv", function(error, datac1g1) {
    datac1g1.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +parseNum(d.price);
    });
    // Scale the range of the data
    xc1g1.domain(d3.extent(datac1g1, function(d) { return d.date; }));
    yc1g1.domain([0, d3.max(datac1g1, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNestc1g1 = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(datac1g1);

    // Loop through each symbol / key
    dataNestc1g1.forEach(function(d) {

        svgc1g1.append("path")
            .attr("class", "line")
            .attr("d", pricelinec1g1(d.values));

    });

    // Add the X Axis
    svgc1g1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightc1g1 + ")")
        .call(xAxisc1g1);

    // Add the Y Axis
    svgc1g1.append("g")
        .attr("class", "y axis")
        .call(yAxisc1g1);

});

// Set the dimensions of the canvas / graph
var marginc3g2 = {top: 30, right: 20, bottom: 30, left: 50},
    widthc3g2 = length - marginc3g2.left - marginc3g2.right,
    heightc3g2 = breadth - marginc3g2.top - marginc3g2.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");

// Set the ranges
var xc3g2 = d3.time.scale().range([0, widthc3g2]);
var yc3g2 = d3.scale.linear().range([heightc3g2, 0]);

// Define the axes
var xAxisc3g2 = d3.svg.axis().scale(xc3g2)
    .orient("bottom").ticks(5);

var yAxisc3g2 = d3.svg.axis().scale(yc3g2)
    .orient("left").ticks(5);

// Define the line
var pricelinec3g2 = d3.svg.line()
    .x(function(d) { return xc3g2(d.date); })
    .y(function(d) { return yc3g2(d.price); });

// Adds the svg canvas
var svgc3g2 = d3.select("#c3g2")
    .append("svg")
        .attr("width", widthc3g2 + marginc3g2.left + marginc3g2.right)
        .attr("height", heightc3g2 + marginc3g2.top + marginc3g2.bottom)
    .append("g")
        .attr("transform",
              "translate(" + marginc3g2.left + "," + marginc3g2.top + ")");

// Get the data
d3.csv("data/stocksc3g2.csv", function(error, datac3g2) {
    datac3g2.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +d.price;
    });

    // Scale the range of the data
    xc3g2.domain(d3.extent(datac3g2, function(d) { return d.date; }));
    yc3g2.domain([0, d3.max(datac3g2, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNestc3g2 = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(datac3g2);

    // Loop through each symbol / key
    dataNestc3g2.forEach(function(d) {

        svgc3g2.append("path")
            .attr("class", "line")
            .attr("d", pricelinec3g2(d.values));

    });

    // Add the X Axis
    svgc3g2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightc3g2 + ")")
        .call(xAxisc3g2);

    // Add the Y Axis
    svgc3g2.append("g")
        .attr("class", "y axis")
        .call(yAxisc3g2);

});

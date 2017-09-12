// Set the dimensions of the canvas / graph
var marginc2g2 = {top: 30, right: 20, bottom: 30, left: 50},
    widthc2g2 = length - marginc2g2.left - marginc2g2.right,
    heightc2g2 = breadth - marginc2g2.top - marginc2g2.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");

// Set the ranges
var xc2g2 = d3.time.scale().range([0, widthc2g2]);
var yc2g2 = d3.scale.linear().range([heightc2g2, 0]);

// Define the axes
var xAxisc2g2 = d3.svg.axis().scale(xc2g2)
    .orient("bottom").ticks(5);

var yAxisc2g2 = d3.svg.axis().scale(yc2g2)
    .orient("left").ticks(5);

// Define the line
var pricelinec2g2 = d3.svg.line()
    .x(function(d) { return xc2g2(d.date); })
    .y(function(d) { return yc2g2(d.price); });

// Adds the svg canvas
var svgc2g2 = d3.select("#c2g2")
    .append("svg")
        .attr("width", widthc2g2 + marginc2g2.left + marginc2g2.right)
        .attr("height", heightc2g2 + marginc2g2.top + marginc2g2.bottom)
    .append("g")
        .attr("transform",
              "translate(" + marginc2g2.left + "," + marginc2g2.top + ")");

// Get the data
d3.csv("data/stocksc2g2.csv", function(error, datac2g2) {
    datac2g2.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +d.price;
    });

    // Scale the range of the data
    xc2g2.domain(d3.extent(datac2g2, function(d) { return d.date; }));
    yc2g2.domain([0, d3.max(datac2g2, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNestc2g2 = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(datac2g2);

    // Loop through each symbol / key
    dataNestc2g2.forEach(function(d) {

        svgc2g2.append("path")
            .attr("class", "line")
            .attr("d", pricelinec2g2(d.values));

    });

    // Add the X Axis
    svgc2g2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightc2g2 + ")")
        .call(xAxisc2g2);

    // Add the Y Axis
    svgc2g2.append("g")
        .attr("class", "y axis")
        .call(yAxisc2g2);

});

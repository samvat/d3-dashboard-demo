// Set the dimensions of the canvas / graph
var marginc2g3 = {top: 30, right: 20, bottom: 30, left: 50},
    widthc2g3 = length - marginc2g3.left - marginc2g3.right,
    heightc2g3 = breadth - marginc2g3.top - marginc2g3.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");

// Set the ranges
var xc2g3 = d3.time.scale().range([0, widthc2g3]);
var yc2g3 = d3.scale.linear().range([heightc2g3, 0]);

// Define the axes
var xAxisc2g3 = d3.svg.axis().scale(xc2g3)
    .orient("bottom").ticks(5);

var yAxisc2g3 = d3.svg.axis().scale(yc2g3)
    .orient("left").ticks(5);

// Define the line
var pricelinec2g3 = d3.svg.line()
    .x(function(d) { return xc2g3(d.date); })
    .y(function(d) { return yc2g3(d.price); });

// Adds the svg canvas
var svgc2g3 = d3.select("#c2g3")
    .append("svg")
        .attr("width", widthc2g3 + marginc2g3.left + marginc2g3.right)
        .attr("height", heightc2g3 + marginc2g3.top + marginc2g3.bottom)
    .append("g")
        .attr("transform",
              "translate(" + marginc2g3.left + "," + marginc2g3.top + ")");

// Get the data
d3.csv("data/stocksc2g3.csv", function(error, datac2g3) {
    datac2g3.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +d.price;
    });

    // Scale the range of the data
    xc2g3.domain(d3.extent(datac2g3, function(d) { return d.date; }));
    yc2g3.domain([0, d3.max(datac2g3, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNestc2g3 = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(datac2g3);

    // Loop through each symbol / key
    dataNestc2g3.forEach(function(d) {

        svgc2g3.append("path")
            .attr("class", "line")
            .attr("d", pricelinec2g3(d.values));

    });

    // Add the X Axis
    svgc2g3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightc2g3 + ")")
        .call(xAxisc2g3);

    // Add the Y Axis
    svgc2g3.append("g")
        .attr("class", "y axis")
        .call(yAxisc2g3);

});

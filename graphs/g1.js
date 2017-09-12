// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%b %Y").parse
var parseNum = d3.format("");

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(20);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var priceline = d3.svg.line().interpolate("step-after")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

// Adds the svg canvas
var svg = d3.select("#graph1")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/stocks.csv", function(error, data) {
    data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.price = +parseNum(d.price);
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.price; })]);

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.symbol;})
        .entries(data);

    var color = d3.scale.category10();   // set the colour scale

    legendSpace = width/dataNest.length; // spacing for the legend

    // Loop through each symbol / key
    dataNest.forEach(function(d,i) {
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .attr("id", 'tag'+d.key)//.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline(d.values));

        // Add the Legend
        svg.append("text")
            .attr("x", (legendSpace/2)+i*legendSpace)  // space legend
            .attr("y", height + (margin.bottom/2)+ 5)
            .attr("class", "legend")    // style the legend
            .style("fill", function() { // Add the colours dynamically
                return d.color = color(d.key); })
            .on("click", function(){
                // Determine if current line is visible
                var active   = d.active ? false : true,
                newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.select("#tag"+d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;
                })
            .text(d.key);

    });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
        svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_axis()
                    .tickSize(-height, 0, 0)
                    .tickFormat("")
                )
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_axis()
                .tickSize(-width, 0, 0)
                .tickFormat("")
            )

        var mouseG = svg.append("g")
              .attr("class", "mouse-over-effects");

            mouseG.append("path") // this is the black vertical line to follow mouse
              .attr("class", "mouse-line")
              .style("stroke", "black")
              .style("stroke-width", "1px")
              .style("opacity", "0");

            var lines = document.getElementsByClassName('line');

            var mousePerLine = mouseG.selectAll('.mouse-per-line')
              .data(dataNest)
              .enter()
              .append("g")
              .attr("class", "mouse-per-line");

            mousePerLine.append("circle")
              .attr("r", 7)
              .style("stroke", function(d) {
                return color(d.name);
              })
              .style("fill", "none")
              .style("stroke-width", "1px")
              .style("opacity", "0");

            mousePerLine.append("text")
              .attr("transform", "translate(10,3)");

            mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
              .attr('width', width) // can't catch mouse events on a g element
              .attr('height', height)
              .attr('fill', 'none')
              .attr('pointer-events', 'all')
              .on('mouseout', function() { // on mouse out hide line, circles and text
                d3.select(".mouse-line")
                  .style("opacity", "0");
                d3.selectAll(".mouse-per-line circle")
                  .style("opacity", "0");
                d3.selectAll(".mouse-per-line text")
                  .style("opacity", "0");
              })
              .on('mouseover', function() { // on mouse in show line, circles and text
                d3.select(".mouse-line")
                  .style("opacity", "1");
                d3.selectAll(".mouse-per-line circle")
                  .style("opacity", "1");
                d3.selectAll(".mouse-per-line text")
                  .style("opacity", "1");
              })
              .on('mousemove', function() { // mouse moving over canvas
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                  .attr("d", function() {
                    var d = "M" + mouse[0] + "," + height;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                  });

                d3.selectAll(".mouse-per-line")
                  .attr("transform", function(d, i) {
                    var xDate = x.invert(mouse[0]),
                        bisect = d3.bisector(function(d) { return d.date; }).right;
                        idx = bisect(d.values, xDate);

                    var beginning = 0,
                        end = lines[i].getTotalLength(),
                        target = null;

                    while (true){
                      target = Math.floor((beginning + end) / 2);
                      pos = lines[i].getPointAtLength(target);
                      if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                          break;
                      }
                      if (pos.x > mouse[0])      end = target;
                      else if (pos.x < mouse[0]) beginning = target;
                      else break; //position found
                    }

                    d3.select(this).select('text')
                      .text(y.invert(pos.y).toFixed(2));

                    return "translate(" + mouse[0] + "," + pos.y +")";
                  });
});
});


function make_x_axis() {
    return d3.svg.axis()
        .scale(x)
         .orient("bottom")
         .ticks(20)
}

function make_y_axis() {
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5)
}

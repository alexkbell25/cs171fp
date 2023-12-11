// Real vis2

let data;

// Select the div where the chart will be placed


var vis2Container = d3.select("#vis2");

const svg = vis2Container.append('svg')
    .attr('width', 850)
    .attr('height', 350)
    .attr('class', 'chart-background'); // Assign a class

// Set the margins
const margin = {top: 80, right: 150, bottom: 60, left: 70},
    width = +svg.attr('width') - margin.left - margin.right,
    height = +svg.attr('height') - margin.top - margin.bottom;

// Set the scales
const x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

// Append a 'group' element to 'svg'
const g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top  + ')');

// Load the data from the csv file
d3.csv('data/betting_points.csv').then(function(loadedData) {
    data = loadedData; // Assign the loaded data to the global data variable

    // Define a color scale for the 'Team' values
    const teamColor = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(data.map(d => d["Team"]));

    // Initial calculation and chart rendering
    calculateAndRenderChart("Bet Pts_B365");

    // Dropdown change event listener
    d3.select("#sortSelector").on("change", function(event) {
        const selectedOption = this.value;
        calculateAndRenderChart(selectedOption);
    });
    function calculateAndRenderChart(selectedBetPts) {
        // Parse and compute the difference
        data.forEach(function(d) {
            d["Real Pts"] = +d["Real Pts"];
            d[selectedBetPts] = +d[selectedBetPts];
            d["Difference"] = d["Real Pts"] - d[selectedBetPts]; // Calculate the difference
        });

        // Update domains for the scales
        const maxDifference = d3.max(data, d => Math.abs(d["Difference"]));
        x.domain(data.map(d => d["Team"]));
        y.domain([-maxDifference, maxDifference]).nice();

        // Update the axes
        g.select('.axis--x').call(d3.axisBottom(x));
        g.select('.axis--y').call(d3.axisLeft(y));

        // Select all bars and bind them to the new data
        const bars = g.selectAll('.bar').data(data);

        // Remove old bars
        bars.exit().remove();

        // Append new bars
        bars.enter().append('rect')
            .merge(bars) // Merge with existing bars
            .attr('class', 'bar')
            .attr('x', d => x(d["Team"]))
            .attr('y', d => y(Math.max(0, d["Difference"])))
            .attr('width', x.bandwidth())
            .attr('height', d => Math.abs(y(d["Difference"]) - y(0)))
            .style('fill', d => teamColor(d["Team"]))
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(50)
                    .style("opacity", .9);
                tooltip.html("Team: " + d["Team"] + "<br/>" + selectedBetPts + ": " + d[selectedBetPts] + "<br/>Real Pts: " + d["Real Pts"] + "<br/>Difference: " + d["Difference"])
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            });
    }

    // Define a color scale for the 'Team' values

    // Use the extent of 'B365H' to interpolate within our custom color range
    const b365hExtent = d3.extent(data, d => d["B365H"]);
    const b365hScale = d3.scaleLinear()
        .domain(b365hExtent)
        .range([0, 1]);

    // Adjust domains for the scales
    // Find the maximum absolute value of the differences to set the domain symmetrically around 0
    const maxDifference = d3.max(data, function(d) { return Math.abs(d["Difference"]); });
    x.domain(data.map(function(d) { return d["Team"]; })); // Use "Team" for the x-axis
    y.domain([-maxDifference, maxDifference]).nice();

    // Append the x-axis
    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    // Rotate the x-axis labels
    g.select('.axis--x').selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)');

    // Append the y-axis
    g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y).tickFormat(function(d){
            return d;
        }))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Difference (H Pts - Hx PTS)');

    const yRange = [-50, 50];

    // Append the y-axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(`Real Points - Bet365 Points`);

// Append the chart title
    svg.append("text")
        .attr("class", "chart-title") // Assign a unique class for easy selection
        .attr("x", (width / 2) + 50)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Negative bars represent teams which underperformed expectation");

    // Create a tooltip
    const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("text-align", "center")
        .style("width", "120px")
        .style("height", "70px")
        .style("padding", "2px")
        .style("font", "12px sans-serif")
        .style("background", "lightsteelblue")
        .style("border", "0px")
        .style("border-radius", "8px")
        .style("opacity", 0);

    g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d["Team"])) // Use "Team" instead of "Home Team"
        .attr('y', d => y(Math.max(0, d["Difference"])))
        .attr('width', x.bandwidth())
        .attr('height', d => Math.abs(y(d["Difference"]) - y(0)))
        .style('fill', d => teamColor(d["Team"])) // Apply color based on 'Team'
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(0)
                .style("opacity", .9);
            tooltip.html("Team: " + d["Team"] + "<br/>Bet Pts_B365: " + d["Bet Pts_B365"] + "<br/>Real Pts: " + d["Real Pts"])
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });
    const selector = document.getElementById('colorSelector');

    // This function will update the highlighting of the team's row

    selector.addEventListener('change', function() {
        console.log("vis 2 selector testing")
        const teamName = this.value;
        highlightBar(teamName);
    });

    function highlightBar(selectedTeam) {
        // Reset any previous highlights and labels
        g.selectAll('.bar')
            .style('stroke', 'none');
        g.selectAll('.team-label').remove(); // Remove any previous labels

        // Highlight the selected bar with a thick yellow stroke
        g.selectAll('.bar')
            .filter(d => d["Team"] === selectedTeam)
            .style('stroke', '#ffcc00') // Yellow stroke color
            .style('stroke-width', 4); // Adjust the thickness as needed

        // Find the data for the selected team
        const selectedData = data.find(d => d["Team"] === selectedTeam);
        if (selectedData) {
            // Use the pre-calculated difference
            const difference = selectedData["Difference"]; // Assuming 'Difference' is the pre-calculated field

            // Determine the performance description based on the difference
            let performanceDescription;
            if (difference > 0) {
                performanceDescription = "performed better than expected";
            } else if (difference < 0) {
                performanceDescription = "performed worse than expected";
            } else {
                performanceDescription = "performed just as expected";
            }

            // Update the chart title
            svg.select(".chart-title")
                .text(`${selectedTeam} ${performanceDescription}`);

            // Calculate label position
            const yPos = y(Math.max(0, selectedData["Difference"]));
            const labelYPosition = yPos - (yPos > height / 2 ? 10 : -10);

            // Append the label with the selected team's name
            g.append("text")
                .attr('class', 'team-label')
                .attr("x", x(selectedTeam) + x.bandwidth() / 2)
                .attr("y", labelYPosition)
                .attr("text-anchor", "middle")
                .attr("fill", "#333") // Label text color
                .style("font-weight", "bold") // Label text bold
                .text(selectedTeam); // Use the selected team's name
        }
    }

});







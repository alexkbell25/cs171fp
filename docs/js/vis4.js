d3.csv("data/betting_points.csv").then(function(data) {
    // Initialize initial positions
    data.forEach(function(d, i) {
        d.initialPosition = i; // Assign initial position
        d.positionChange = 0;  // Initial position change is 0
    });

// Aggregate data by Team
    var aggregatedData = data.map(d => ({
        ...d, // Spread the original data to include all properties
        'Real Pts': +d['Real Pts'],
        'Bet Pts_B365': +d['Bet Pts_B365'],
        'Team': d['Team'],
        'Bet Pts_BW': +d['Bet Pts_BW'],
        'Bet Pts_IW': +d['Bet Pts_IW'],
        'Bet Pts_PS': +d['Bet Pts_PS'],
        'Bet Pts_VC': +d['Bet Pts_VC'],
        'Bet Pts_WH': +d['Bet Pts_WH'],
    }));

    // Define custom column titles and their order
    var columnTitles = {
        'Team': 'Team',
        'Position Change': 'Position Change',
        'Real Pts': 'Real Points',
        'Bet Pts_B365': 'Bet365 Points',
        'Bet Pts_BW': 'BetWay Points',
        'Bet Pts_IW': 'Interwetten Points',
        'Bet Pts_PS': 'Pinnacle Points',
        'Bet Pts_VC': 'BetVictor Points',
        'Bet Pts_WH': 'WilliamHill Points'
    };

    var tableContainer = d3.select("#vis4");

    // Append the table after the title
    var table = tableContainer.append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // Append the header row with custom titles and order
    thead.append("tr")
        .selectAll("th")
        .data(Object.keys(columnTitles))
        .enter()
        .append("th")
        .html(function(column) {
            // Check if the column is 'Team' or 'Position Change'
            if (column !== 'Team' && column !== 'Position Change') {
                return columnTitles[column] + '<span class="sort-indicator">⇅</span>';
            } else {
                return columnTitles[column];
            }
        })
        .on("click", function(event, column) {

            // Sorting logic for the columns
            var rows = tbody.selectAll("tr").sort(function(a, b) {
                if (typeof a[column] === 'number') {
                    return d3.descending(a[column], b[column]);
                }
                return a[column].localeCompare(b[column]);
            });

            // Update the position change after sorting
            rows.each(function(d, i) {
                d.positionChange = d.initialPosition - i;
            });


            // Rebind the updated data to the cells
            rows.selectAll("td")
                .data(function(row) {
                    return Object.keys(columnTitles).map(function(column) {
                        if (column === 'Position Change') {
                            return { column: column, value: row.positionChange };
                        } else {
                            return { column: column, value: row[column] };
                        }
                    });
                })
                .text(function(d) { return d.value; })
                .call(setColorBasedOnPositionChange); // Apply the color function
        });

    // Assign the 'table-header' class to all th elements
    thead.selectAll("th").classed("table-header", true);

    // Add an event listener to the colorSelector input element
    d3.select("#colorSelector")
        .on("change", function() {
            var selectedTeam = this.value; // Get the selected team value
            highlightTableRow(selectedTeam); // Highlight the corresponding row
        });

    // Create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(aggregatedData)
        .enter()
        .append("tr");

    // Create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return Object.keys(columnTitles).map(function(column) {
                return { column: column, value: row[column] };
            });
        })
        .enter()
        .append("td")
        .text(function(d) { return d.value; })
        .style("text-align", function(d) {
            // Align right for all columns except 'Team'
            return d.column === 'Team' ? 'left' : 'right';
        });

    // Define the row height (optional)
    // Function to highlight the table row with a specific team
    function highlightTableRow(teamName) {
        console.log("is this even called??")
        rows.classed("highlighted", function(d) {
            return d.Team === teamName; // Add or remove the "highlighted" class based on the condition
        });
    }

    const selector = document.getElementById('colorSelector');

    // This function will update the highlighting of the team's row

    selector.addEventListener('change', function() {
        console.log("vis 4 selector testing")
        const teamName = this.value;
        console.log(teamName);
        highlightTableRow(teamName);
    });

    // Define the row height (optional)
    var rowHeight = 30;
});

// Define the color scale for Position Change
var colorScale = d3.scaleQuantize()
    .domain([-7, 7]) // Specify the domain of Position Change values
    .range(['red', 'lightcoral', '', 'lightgreen', 'green']);


function setColorBasedOnPositionChange(selection) {
    selection.style("background-color", function(d) {
        if (d.column === 'Position Change') {
            return colorScale(d.value);
        }
        return null; // Keep the original color for other columns
    });
}

cells.call(setColorBasedOnPositionChange);

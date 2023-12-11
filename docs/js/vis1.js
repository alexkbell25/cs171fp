// Event listener for changes in the selector
const colorSelector = document.getElementById('colorSelector');
if (colorSelector) {
    colorSelector.addEventListener('change', updateTitle);
}

// Function to count clusters by type (ADD CALU)
function countCirclesByCluster(data, clusterType) {
    const count = { A: 0, D: 0, H: 0 };
    data.forEach(d => {
        if (d[clusterType] === 'A') count.A++;
        else if (d[clusterType] === 'D') count.D++;
        else if (d[clusterType] === 'H') count.H++;
    });
    return count;
}

// Function to toggle the display of info text
function toggleInfoText() {
    var infoText = document.getElementById('infoText');
    if (infoText) {
        if (infoText.style.display === 'none') {
            infoText.style.display = 'block';
        } else {
            infoText.style.display = 'none';
        }
    } else {
        console.error('Element with ID "infoText" not found.');
    }
}

// Assuming your info icon has an ID 'infoIcon'
document.addEventListener('DOMContentLoaded', function () {
    var infoIcon = document.getElementById('infoIcon');
    if (infoIcon) {
        infoIcon.addEventListener('click', toggleInfoText);
    } else {
        console.error('Element with ID "infoIcon" not found.');
    }
});

function someFunction() {

    const data = DataLoader.getExpectedResultsData();

    // Define variables to store counts
    let bothAA = 0;
    let bothDD = 0;
    let bothHH = 0;
    let differentExpResFTR = 0;

// Iterate through the data
    data.forEach(d => {
        if (d.ExpRes === 'A' && d.FTR === 'A') {
            bothAA++;
        } else if (d.ExpRes === 'D' && d.FTR === 'D') {
            bothDD++;
        } else if (d.ExpRes === 'H' && d.FTR === 'H') {
            bothHH++;
        } else {
            differentExpResFTR++;
        }
    });

// Display the counts in the console
    console.log('Both ExpRes and FTR are A:', bothAA);
    console.log('Both ExpRes and FTR are D:', bothDD);
    console.log('Both ExpRes and FTR are H:', bothHH);
    console.log('Different ExpRes and FTR:', differentExpResFTR);


    const svgWidth = 1000, svgHeight = 1600;
    const svg = d3.select('#circleContainer').append('svg')
        .attr('id', 'clusters-svg'); // Add the ID 'clusters-svg' to the SVG element

    svg.append("text")
        .attr("x", '3.3vw') // Adjust x position as needed
        .attr("y", '4vh') // Adjust y position to be above the top cluster
        .text("Expected Results")
        .style("font-size", "2vh") // Adjust font size as needed
        .style("fill", "black"); // Adjust color as needed

    svg.append("text")
        .attr("x", '27vw') // Adjust x position as needed
        .attr("y", '4vh') // Adjust y position to be above the top cluster
        .text("Actual Results")
        .style("font-size", "2vh") // Adjust font size as needed
        .style("fill", "black"); // Adjust color as needed


// Add titles for Away Wins, Tie, and Home Wins on the left, rotated vertically
    const labels = ["Away Wins", "Tie", "Home Wins"];
    const positionsVH = ['18vh', '30vh', '53vh']; // Corresponding to the positions of the clusters in viewport height units

// Convert vh to pixels
    const positionsPixels = positionsVH.map(vh => parseFloat(vh) / 100 * window.innerHeight);

    labels.forEach((label, index) => {
        svg.append("text")
            .attr("x", 20) // Adjust x position as needed
            .attr("y", positionsPixels[index])
            .attr("transform", function () {
                return "rotate(-90 " + 20 + "," + positionsPixels[index] + ")";
            })
            .text(label)
            .style("font-size", "2vh")
            .style("fill", "black");
    });


// Initialize bubbles at the bottom left corner
    const bubbles = svg.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', 0)
        .attr('cy', svgHeight)
        .attr('r', d => d.size / 4 * 25)
        .style('fill', function (d) {
            // Set the color based on ExpRes
            switch (d.ExpRes) {
                case 'A':
                    return '#D779C4'; // Color for ExpRes A
                case 'D':
                    return '#ED8214'; // Color for ExpRes D
                case 'H':
                    return '#5BBDCF'; // Color for ExpRes H
                default:
                    return 'gray'; // Default color if no ExpRes is found
            }
        });


    // Initialize clustering type
    let clusterType = 'ExpRes';

    // Define simulation with forces
    const simulation = d3.forceSimulation(data)
        .force("charge", d3.forceManyBody().strength(1))
        .force("collision", d3.forceCollide().radius(d => d.size / 4 * 25))
        .force("cluster", forceCluster(clusterType))
        .on("tick", ticked);

    function ticked() {
        bubbles.attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    // Custom force to cluster the bubbles
    // Custom force to cluster the bubbles
    function forceCluster(clusterType) {
        // Define centroids for both types
        const totalWidth = window.innerWidth / 2;
        const totalHeight = window.innerHeight;

        const centroidsExpRes = {
            "A": {x: 0.15 * totalWidth, y: 0.12 * totalHeight}, // Left Upper Position (1/10th of viewport width and 1/10th of viewport height)
            "D": {x: 0.15 * totalWidth, y: 0.28 * totalHeight}, // Left Middle Position (1/10th of viewport width and 4/10th of viewport height)
            "H": {x: 0.15 * totalWidth, y: 0.48 * totalHeight} // Left Lower Position (1/10th of viewport width and 9/10th of viewport height)
        };

        const centroidsFTR = {
            "A": {x: 0.6 * totalWidth, y: 0.1 * totalHeight}, // Right Upper Position (9/10th of viewport width and 1/10th of viewport height)
            "D": {x: 0.6 * totalWidth, y: 0.27 * totalHeight}, // Right Middle Position (9/10th of viewport width and 4/10th of viewport height)
            "H": {x: 0.6 * totalWidth, y: 0.48 * totalHeight} // Right Lower Position (9/10th of viewport width and 9/10th of viewport height)
        };

        const strength = 0.2;
        let nodes;

        function force(alpha) {
            let centroids;
            if (clusterType === 'FTR') {
                centroids = centroidsFTR;
            } else if (clusterType === 'ExpRes') {
                centroids = centroidsExpRes;
            }

            nodes.forEach(d => {
                const cluster = centroids[d[clusterType]];
                if (cluster) {
                    d.x += strength * alpha * (cluster.x - d.x);
                    d.y += strength * alpha * (cluster.y - d.y);
                }
            });
        }

        force.initialize = function (_) {
            nodes = _;
        };


        return force;
    }


    // Add click event listeners for buttons
    document.getElementById('btnExpRes').addEventListener('click', function () {
        updateClustering('ExpRes');
    });

    document.getElementById('btnFTR').addEventListener('click', function () {
        updateClustering('FTR');
    });

    // Function to update clustering
    function updateClustering(clusterType) {
        // Update the simulation with the new forceCluster
        simulation.force('cluster', forceCluster(clusterType))
            .alpha(1) // reheat the simulation
            .restart();

        // Show or hide the ExpRes info box based on cluster type
        if (clusterType === 'ExpRes') {
            document.getElementById('expResInfoBox').style.display = 'block';
        } else if (clusterType === 'FTR') {
            document.getElementById('expResInfoBox').style.display = 'none';
            displayFeedback(); // Call the function to display feedback
        }

        // Count the circles in each cluster (ADD CALU)
        const counts = countCirclesByCluster(data, clusterType);
        console.log(`Counts for ${clusterType}:`, counts);
    }


    // Add a global variable to store the user's guess
    var userGuess = 0;

    document.getElementById('submitGuess').addEventListener('click', function () {
        console.log('submited')
        userGuess = parseInt(document.getElementById('userGuess').value);
        console.log('User guess:', userGuess);
        // Add any further logic you need for when a guess is submitted
    });

    function displayFeedback() {
        console.log('working on feedback')
        var feedbackContainer = document.getElementById('feedbackContainer');
        var expResInfoBox = document.getElementById('expResInfoBox');

        // Hide the ExpResInfoBox and show the FeedbackContainer
        expResInfoBox.style.display = 'none';
        feedbackContainer.style.display = 'block';

        var feedbackMessage = '';
        var distance = Math.abs(userGuess - 214); // Calculate the absolute distance from the target

        if (distance === 0) {
            feedbackMessage = 'Amazing!';
        } else if (distance >= 1 && distance <= 20) {
            feedbackMessage = 'Good job.';
        } else if (distance >= 21 && distance <= 40) {
            feedbackMessage = 'Not bad.';
        } else if (distance > 40) {
            feedbackMessage = 'Not even close.';
        }


        // Add the additional phrase about expected results
        feedbackMessage += ' The expected results matched the real outcome in 214 games! This means, just 56% of the times.';

        feedbackContainer.innerText = feedbackMessage;
    }
}




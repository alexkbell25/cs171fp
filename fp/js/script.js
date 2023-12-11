// Declare selector globally
let selector;
let matrix;
let line;

function updateBetFor(){
    let result = document.getElementById('for').value

    line.betMoney(result)
}

function updateBetAgainst(){
    let result = document.getElementById('against').value

    line.betMoney(result)
}

function updateBetDraw(){
    let result = document.getElementById('draw').value

    line.betMoney(result)
}

document.getElementById('select-order-type').onchange = function () {
    console.log(this.value)
    matrix.updateVis(this.value);
}

// Constants for file paths
const BETTING_POINTS_FILE = 'data/betting_points.csv';
const JOINED_PREM_DATA_FILE = 'data/joinedPremData.csv';
const EXPECTED_RESULTS_FILE = 'data/expected_results.csv';

// Teams data
const teams = [
    'Man City', 'Arsenal', 'Man United', 'Newcastle', 'Liverpool',
    'Brighton', 'Aston Villa', 'Tottenham', 'Brentford', 'Fulham',
    'Crystal Palace', 'Chelsea', 'Wolves', 'West Ham', 'Bournemouth',
    'Nott\'m Forest', 'Everton', 'Leicester', 'Leeds', 'Southampton'
].sort();

// Data loader module
const DataLoader = (() => {
    let globalData;
    let bettingPointsData;
    let expectedResultsData;

    async function loadBettingPointsData() {
        try {
            const response = await d3.csv(BETTING_POINTS_FILE);
            bettingPointsData = response;
            // Additional operations on bettingPointsData can be done here
        } catch (error) {
            console.error("Failed to load betting points data:", error);
        }
    }

    async function loadExpectedResultsData() {
        try {
            const response = await d3.csv(EXPECTED_RESULTS_FILE);
            expectedResultsData = response;
            // Additional operations on expectedResultsData can be done here
            return expectedResultsData; // Return the loaded data
        } catch (error) {
            console.error("Failed to load expected results data:", error);
            throw error; // Re-throw the error to handle it in the calling code
        }
    }


    async function loadMainData() {
        try {
            const response = await d3.csv(JOINED_PREM_DATA_FILE);
            globalData = response;
            // Additional operations on globalData can be done here
        } catch (error) {
            console.error("Failed to load main data:", error);
        }
    }

    function getGlobalData() {
        return globalData;
    }

    function getBettingPointsData() {
        return bettingPointsData;
    }

    function getExpectedResultsData() {
        return expectedResultsData;
    }

    // Publicly exposed methods
    return {
        loadMainData,
        loadBettingPointsData,
        loadExpectedResultsData,
        getGlobalData,
        getBettingPointsData,
        getExpectedResultsData
    };
})();

// Function to populate the dropdown with team names
function populateDropdown() {
    // Initialize the selector here
    selector = document.getElementById('colorSelector');
    // Add the placeholder to the beginning of the array
    teams.unshift('CHOOSE YOUR FAVORITE TEAM');
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        selector.appendChild(option);
    });
}

// Function to setup event listeners
function setupEventListeners() {
    const selector = document.getElementById('colorSelector');
    selector.addEventListener('change', function() {
        d3.selectAll('#vis1 tbody tr.highlighted').classed('highlighted', false);
        d3.select(`#vis1 tbody tr[data-team="${this.value}"]`).classed('highlighted', true);
    });
}

// Combine the data loading and visualization initialization into one function
async function loadDataAndInitializeVisualizations() {
    try {
        await DataLoader.loadMainData();
        await DataLoader.loadBettingPointsData();
        await DataLoader.loadExpectedResultsData();
        // After data is loaded, populate the dropdown and set up event listeners
        populateDropdown(); // Populate the dropdown
        setupEventListeners(); // Set up the event listener

        // Get the loaded data
        const globalData = DataLoader.getGlobalData();
        const bettingPointsData = DataLoader.getBettingPointsData();
        const expectedResultsData = DataLoader.getExpectedResultsData();

        // Check if expectedResultsData is available
        if (!expectedResultsData) {
            console.error("Expected Results data is not available.");
            return; // Exit the function if data is not available
        }

        // Data is available, proceed with visualization initialization
        console.log('showing expected res data')
        console.log(expectedResultsData);
        matrix = new Matrix("vis3", globalData);
        line = new Line("vis5", globalData);
        someFunction()

        // Initialize visualizations with the loaded data
        // const matrix = new Matrix("vis3", globalData);
        // const line = new Line("vis5", globalData);

        createSortedTable(globalData); // Create the table with sorted data

        // createTableExample(bettingPointsData); // Further initialization code can be added here if necessary
    } catch (error) {
        console.error("Failed to load data or initialize visualizations:", error);
    }
}


// The single 'DOMContentLoaded' event listener
document.addEventListener('DOMContentLoaded', loadDataAndInitializeVisualizations);


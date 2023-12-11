// vis0.js

// Global variable declaration
var globalSelectedColor = 'CHOOSE YOUR FAVORITE TEAM';
console.log(globalSelectedColor)
var globalSelectedColorChangeEvent = new Event('globalSelectedColorChanges');

// Load and process the data from ftr_teams.csv
let FTRData;
d3.csv("data/ftr_teams.csv").then(data => {
    FTRData = data;
    console.log('FTRData loaded')
    console.log(FTRData)
});

function updateTitle() {
    var selector = document.getElementById('colorSelector');
    var selectedColor = selector.value;

    globalSelectedColor = selectedColor; // Update the global variable, if needed

//    var mainTitle = document.querySelector('.first-row h1');
  //  var newTitle = 'Was ' + selectedColor + ' a worthy competitor?';
   // mainTitle.textContent = newTitle;

    // Hide the infoText element
    var infoText = document.querySelector('.info-text');
    infoText.style.display = 'none';

    document.dispatchEvent(globalSelectedColorChangeEvent); // Dispatch event if necessary
}




// Event listener for changes in the selector
document.getElementById('colorSelector').addEventListener('change', updateTitle);


// vis0a
document.addEventListener('DOMContentLoaded', function() {
    const teams = {
        'Man City': { color: '#273344', imgUrl: 'data/team_images/Man City.png', info: 'Originally named Ardwick Association Football Club in 1887, the club became Manchester City in 1894.' },
        'Arsenal': { color: '#E91C15', imgUrl: 'data/team_images/Arsenal.png', info: 'Arsenal FC was the first club from the South of England to join The Football League, in 1893.' },
        'Man United': { color: '#d20222', imgUrl: 'data/team_images/Man United.png', info: 'Founded in 1878 as Newton Heath LYR Football Club, Manchester United is one of the most successful clubs in England.' },
        'Newcastle': { color: '#22b1fe', imgUrl: 'data/team_images/Newcastle.png', info: 'Established in 1892 by the merger of Newcastle East End and Newcastle West End, the club has a historic ground, St. James\' Park.' },
        'Liverpool': { color: '#d3171e', imgUrl: 'data/team_images/Liverpool.png', info: 'Liverpool Football Club was founded in 1892 and has won multiple European Cups.' },
        'Brighton': { color: '#0301fd', imgUrl: 'data/team_images/Brighton.png', info: 'Founded in 1901, Brighton & Hove Albion, known as the Seagulls, play at the Amex Stadium.' },
        'Aston Villa': { color: '#4a0024', imgUrl: 'data/team_images/Aston Villa.png', info: 'One of the oldest clubs in England, Aston Villa was founded in 1874 and has a rich history of success.' },
        'Tottenham': { color: '#10204b', imgUrl: 'data/team_images/Tottenham.png', info: 'Founded in 1882 as Hotspur F.C., Tottenham has been the first club to achieve the League and FA Cup Double.' },
        'Brentford': { color: '#fd0000', imgUrl: 'data/team_images/Brentford.png', info: 'Established in 1889, Brentford FC has recently gained promotion to the Premier League.' },
        'Fulham': { color: '#090808', imgUrl: 'data/team_images/Fulham.png', info: 'Fulham FC, founded in 1879, is London\'s oldest professional football club.' },
        'Crystal Palace': { color: '#0355a5', imgUrl: 'data/team_images/Crystal Palace.png', info: 'Crystal Palace Football Club, formed in 1905, is known for its vibrant atmosphere.' },
        'Chelsea': { color: '#0b4595', imgUrl: 'data/team_images/Chelsea.png', info: 'Chelsea Football Club was founded in 1905 and has become one of the most successful clubs in England.' },
        'Wolves': { color: '#Fc891c', imgUrl: 'data/team_images/Wolves.png', info: 'Commonly known as Wolves, they were founded in 1877 and have won the FA Cup four times.' },
        'West Ham': { color: '#8B0000', imgUrl: 'data/team_images/West Ham.png', info: 'Founded in 1895 as Thames Ironworks, West Ham United plays at the London Stadium.' },
        'Bournemouth': { color: '#540d1a', imgUrl: 'data/team_images/Bournemouth.png', info: 'Originally known as Boscombe FC, Bournemouth was established in 1890.' },
        'Nott\'m Forest': { color: '#dc0302', imgUrl: 'data/team_images/Nott\'m Forest.png', info: 'Founded in 1865, Nottingham Forest is known for winning the European Cup twice.' },
        'Everton': { color: '#003399', imgUrl: 'data/team_images/Everton.png', info: 'Established in 1878, Everton has competed in the top division for a record 117 seasons.' },
        'Leicester': { color: '#273e8a', imgUrl: 'data/team_images/Leicester.png', info: 'Founded in 1884 as Leicester Fosse, Leicester City is known for its miraculous Premier League win in 2016.' },
        'Leeds': { color: '#142f7b', imgUrl: 'data/team_images/Leeds.png', info: 'Leeds United was formed in 1919 and has a history of domestic success.' },
        'Southampton': { color: '#d71920', imgUrl: 'data/team_images/Southampton.png', info: 'Southampton FC was founded in 1885 and plays at St Mary\'s Stadium.' }
    };

    const selector = document.getElementById('colorSelector');
    const teamInfoBox = document.getElementById('vis0a');
    const tableHeaders = document.querySelectorAll('#vis0b th'); // Select all table headers

    // This function will update the highlighting of the team's row
    function updateHighlighting(selectedTeam) {
        // Remove highlighting from all rows
        d3.selectAll('#vis0b tbody tr').classed('highlighted-row', false);
        // Add highlighting to the selected team's row
        d3.select(`#vis0b tbody tr[data-team="${selectedTeam}"]`).classed('highlighted-row', true);
    }



    selector.addEventListener('change', function() {
        console.log(sliderValue)
        const teamName = this.value;
        const team = teams[teamName];

        // Check if team exists in the teams object
        if (team) {
            document.body.style.backgroundColor = team.color;
            teamInfoBox.innerHTML = `
        <img src="${team.imgUrl}" alt="Logo of ${teamName}" class="team-logo">
        <p class="black-text">${team.info}</p>
      `;
            teamInfoBox.style.color = (team.color === '#FFFFFF' || team.color === '#6CADDF') ? 'black' : 'white';
            // Update the highlighting for the selected team
            updateHighlighting(teamName);

            // Additional code to update the header color of the vis4 table
            d3.select("#vis4").select("thead").selectAll("th")
                .style("background-color", team.color);


            console.log(team.color)

            // Get all the table header elements within the table with ID "vis0b"
            var tableHeaders = document.querySelectorAll("#vis0b th");

            // Loop through the table header elements and set the background color
            tableHeaders.forEach(function(header) {
                header.style.backgroundColor = team.color;
            });

        }
    });
});


//vis0b
function createSortedTable(data) {
    // Remove duplicates and sort by 'A Pos'
    const uniqueData = Array.from(new Map(data.map(item => [item['Away Team'], item])).values());
    const sortedData = uniqueData.sort((a, b) => d3.ascending(+a['A Pos'], +b['A Pos']));
    console.log(sortedData);
    const table = d3.select('#vis0b').append('table').attr('class', 'table');
    const thead = table.append('thead');
    const tbody = table.append('tbody');

    // Append the header row
    thead.append('tr')
        .selectAll('th')
        .data(['Team', 'Position']).enter() // Changed 'Away Team' to 'Team' here
        .append('th')
        .text(column => column === 'Team' ? 'Team' : column); // Change header text conditionally


    // Create a row for each object in the data
    const rows = tbody.selectAll('tr')
        .data(sortedData)
        .enter()
        .append('tr')
        .attr('data-team', d => d['Away Team']); // Assign a data attribute for the team name

    // Create a cell in each row for each column
    const cells = rows.selectAll('td')
        .data(row => ['Away Team', 'A Pos'].map(column => row[column]))
        .enter()
        .append('td')
        .text(cellData => cellData);

    // Check if a team is already selected when the table is created
    const selectedTeam = selector.value;
    if (selectedTeam && selectedTeam !== 'CHOOSE YOUR FAVORITE TEAM') {
        updateHighlighting(selectedTeam);
    }
}

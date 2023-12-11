var slider; // Declare slider here
var sliderValue = 0; // Initialize as global variable

// Function to change the title based on the slider value
function changeTitle(sliderValue) {
    var mainTitle = document.querySelector('.first-row h1');

    // Define your titles based on slider values
    var titles = {
        0: 'Betting in the English Premier League',
        1: 'Information about your team',
        2: 'Betting Simulator',
        3: 'How did your team perform throughout the season?',
        4: 'How predictable is football?',
        5: 'Is your team a dissapointment to bettors?',
        6: 'How did bettors expect your team to perform?'

        // Add more titles as needed
    };

    // Update the title based on the slider value or use a default title
    var newTitle = titles[sliderValue] || 'Default Title';
    mainTitle.textContent = newTitle;
}

document.addEventListener("DOMContentLoaded", function () {
    slider = document.getElementById('slider');
    var slideIndicator = document.getElementById('slide-indicator').children;

    noUiSlider.create(slider, {
        start: 0,
        step: 1,
        orientation: 'vertical',
        range: {
            'min': 0,
            'max': 6
        }
    });


    function showSlide(value) {
        var slides = document.querySelectorAll('.slide');
        slides.forEach(function(slide, index) {
            if (index === value) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        for (var i = 0; i < slideIndicator.length; i++) {
            slideIndicator[i].classList.toggle('active', i === value);
        }
    }


    slider.noUiSlider.on('update', function (values, handle) {
        sliderValue = Math.round(values[handle]); // Update the global sliderValue
        changeTitle(sliderValue);
        showSlide(sliderValue);

        // Get the info icon element
        var infoIcon = document.querySelector('.info-icon');

        // Show the info icon only if the slider value is 1 or more
        if (sliderValue >= 1) {
            infoIcon.style.display = 'block'; // Show the icon
        } else {
            infoIcon.style.display = 'none'; // Hide the icon
        }

        // Hide the info text when the slide changes
        var infoText = document.querySelector('.info-text');
        infoText.style.display = 'none';
    });


    document.addEventListener('keydown', function(event) {
        var sliderValue = parseInt(slider.noUiSlider.get());
        if (event.key === 'ArrowDown') {
            slider.noUiSlider.set(sliderValue + 1);
        } else if (event.key === 'ArrowUp') {
            slider.noUiSlider.set(sliderValue - 1);
        }
    });

    let accumulatedDelta = 0;
    const scrollThreshold = 100; // Adjust this threshold value as needed

    document.addEventListener('wheel', function(event) {
        event.preventDefault();

        var sliderValue = parseInt(slider.noUiSlider.get());
        var delta = event.deltaY || event.detail || event.wheelDelta;

        accumulatedDelta += delta;

        if (Math.abs(accumulatedDelta) >= scrollThreshold) {
            if (accumulatedDelta < 0 && sliderValue > 0) {
                slider.noUiSlider.set(sliderValue - 1);
            } else if (accumulatedDelta > 0 && sliderValue < 6) {
                slider.noUiSlider.set(sliderValue + 1);
            }

            // Reset the accumulated delta after changing the slide
            accumulatedDelta = 0;
        }
    }, { passive: false });

});


document.addEventListener('globalSelectedColorChanges', function() {
    if (slider) { // Check if slider is initialized
        console.log('global sel changed');
        var sliderValue = parseInt(slider.noUiSlider.get());
        console.log("slider value: ")
        console.log(sliderValue)
        if (sliderValue === 0 && globalSelectedColor !== 'CHOOSE YOUR FAVORITE TEAM') {
            console.log(sliderValue)
            slider.noUiSlider.set(1);
            console.log('slide changed')
        }
    }
});


// Create the info icon image element
var infoIcon = document.createElement('img');
infoIcon.src = 'data/images/soccerball.png'; // Set the image source
infoIcon.alt = 'Info Icon';
infoIcon.classList.add('info-icon'); // Add class for styling

// Append the image to the dedicated info icon container
var infoIconContainer = document.getElementById('infoIconContainer');
infoIconContainer.appendChild(infoIcon);



// Event listener for the info icon click
infoIcon.addEventListener('click', function() {
    var commentGames;
    if (sliderValue === 0) {
        commentGames = 'Slide 0';
    } else if (sliderValue === 1) {
        commentGames = 'Understanding the English Premier League & Points System<br><br>' +
            '<strong>The Premier League:</strong> The Premier League is one of the world\'s most renowned football leagues, featuring 20 teams from England. Each team plays 38 matches in a season, facing every other team twice - once at their home stadium and once away.<br><br>' +
            '<strong>Points System:</strong> Teams earn points based on their match outcomes:<br>' +
            '- Win: 3 points<br>' +
            '- Draw: 1 point<br>' +
            '- Loss: 0 points<br><br>' +
            '<strong>Season Objective:</strong> The goal for each team is to accumulate as many points as possible over the season. The team with the highest points total at the end of the season is crowned the Premier League Champion.';
    } else if (sliderValue === 2) {
        commentGames = 'The Betting Simulator:<br><br>' +
            '<strong>Bet on your favorite team!</strong> The betting simulator lets you predict the results of your teams season.<br><br>' +
            '<strong>Keep Track of your earnings</strong> Your first bet will initiate a table and a graph to help you keep track of your winnings<br>';
    } else if (sliderValue === 3) {
        commentGames = 'The Overview of the season<br><br>' +
            '<strong>Track your team\'s performance</strong> through their home and away games<br><br>' +
            '<strong>Hover over individual games</strong> to review some key match facts<br><br>' +
            '<strong>Sort the matrix</strong> by metrics such as Goal Difference or Expected Goals, calculated by a statistical model<br><br>';
    } else if (sliderValue === 4) {
        commentGames = 'Understanding Expected Results and Full-Time Results<br><br>' +
            'This cluster graph analyses the games of the season by initially clustering them based on expected results and then showcasing their actual outcomes.<br><br>' +
            '<strong>Estimating Expected Results:</strong> The expected results are calculated using betting odds from the B365 gambling company. The odds for a home win (oddH), draw (oddD), and away win (oddA) are analyzed to determine the most likely outcome. The lowest odds generally indicate the most probable result as perceived by bookmakers.<br><br>' +
            'This analysis offers insights into the accuracy of betting odds in forecasting the results of football matches.';
    } else if (sliderValue === 5) {
        commentGames = 'The visualization shows the difference of real points and expected points if bettors predictions determined the outcomes of games. Change the menu to view how results vary by betting company!';
    } else if (sliderValue === 6) {
        commentGames = 'What if the table was determined by betting points? Click on a betting company to see how your team\'s position in the table would change.';
    } else {
        commentGames = 'Slide not defined';
    }

    var infoText = document.querySelector('.info-text');
    infoText.innerHTML = commentGames; // Change textContent to innerHTML

    if (infoText.style.display === 'none') {
        infoText.style.display = 'block';
    } else {
        infoText.style.display = 'none';
    }
});


var infoText = document.querySelector('.info-text');
infoText.addEventListener('click', function() {
    // Hide the info text when it is clicked
    infoText.style.display = 'none';
});

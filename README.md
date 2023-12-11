CS 171 Final Project — Jan Riecke, Carmen Edwards, Alexander Bell

Our file structure, as in our Github repository, is as follows:

/ docs 
	index.html
	/ css
		style.css
	/ data
		betting_points.csv
		european_league_teams.csv
		expected_results.csv
		ftr_teams.csv
		joinedPremData.csv
		/images
			- contains ball-e icon
		/team_images
			- contains logo for each team
	/ js
		script.js
		transitions.js
		vis0.js
		vis1.js
		vis2.js
		vis3.js
		vis4.js
		vis5.js
		/libraries
			/nouislider
				nouislider.js

Each of our six visualizations is contained within a vis_.js file, with the transitions.js and script.js files housing the nouislider scrollable webpage code and the mechanics for the Ball-E popup info that is customized for each slide on our webpage. 

The data folder contains five css files including our main “joinedPremData” source and other visualization specific datasets, such as betting_points.csv which was created using python analysis of “joinedPremData”.
		
Libraries used:

Nouislider: https://refreshless.com/nouislider/

We used Nouislider to implement a scrollable webpage layout and improve the navigation experience. 

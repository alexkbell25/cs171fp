// Constructor for betting simulation graph
//access data set
class Line {
    constructor(_parentElement, data) {
        this.parentElement = _parentElement;
        this.data = data;
        this.displayData = [];

        console.log(this.data)

        this.initVis();
    }

    initVis() {

//margins & padding
        let vis = this;

        vis.margin = {top: 80, right: 20, bottom: 50, left: 150};

        vis.size = 700;

        vis.width = vis.size - vis.margin.left - vis.margin.right
        vis.height = vis.size - vis.margin.top - vis.margin.bottom;
        vis.padding = 20

//append svg
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


//create scales and axes (time and revenue)

        // Scales
        vis.x = d3.scaleTime()
            .range([vis.padding, vis.width - vis.padding])

        vis.y = d3.scaleLinear()
            .range([vis.height, vis.padding]);

        // Make x-axis
        vis.xAxis = d3.axisBottom() //.tickFormat(function(d, i) { return i});
// Pass in the scale function
        vis.xAxis.scale(vis.x);

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (vis.height/2 + 10) + ")")

        // Make y-axis
        vis.yAxis = d3.axisLeft();
// Pass in the scale function
        vis.yAxis.scale(vis.y);

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(" + (vis.padding) + ",0)")


        // x-label
        vis.svg.append("text")
            .attr("class", "xlabel")
            .attr("text-anchor", "end")
            .attr("x", vis.width)
            .attr("y", vis.height/2 + 60)
            .text("Date");

        // y-label
        vis.svg.append("text")
            .attr("class", "ylabel")
            .attr("text-anchor", "end")
            .attr("x", -vis.height / 2)
            .attr("y", -10)
            .attr("transform", "rotate(-90)")
            .text("Winnings (USD)");

        // creates a <table> element and a <tbody> element
        vis.tbl = document.getElementById("t");
        vis.tblBody = document.getElementById("tab");

        vis.wrangleData();

    };

    wrangleData() {
        let vis = this;

        // create array of games for each away team
        let awayData = d3.rollup(vis.data, leaves=>leaves, d=>d["Away Team"])
        vis.awayData = Array.from(awayData, ([team, value]) => ({team, value}))
        console.log(vis.awayData)

        // create array of games for each home team
        let homeData = d3.rollup(vis.data, leaves=>leaves, d=>d["Home Team"])
        vis.homeData = Array.from(homeData, ([team, value]) => ({team, value}))
        console.log(vis.homeData)

        // join away and home data sets
        vis.joinData = vis.awayData.concat(vis.homeData)
        console.log(vis.joinData)

        vis.dateParser = d3.timeParse("%-m/%-d/%Y")

        vis.joinData.forEach(function(d) {
            d.value.forEach(function(f) {
                //console.log(f.Date)
                if (typeof(f.Date) === 'string') {
                    f.Date = vis.dateParser(f.Date)
                }
                //console.log(f.Date)
            })
        })

        vis.joinData.forEach(function(d, i) {
            vis.joinData.forEach(function(f, t) {
                if (i < 20 && t > 19 )
                if (d.team === f.team ) {
                    d.value = d.value.concat(f.value)
                }
            })
        })

         vis.joinData.forEach(function(d){
             d.value.sort(function(a, b) {
                     return a.Date - b.Date
             })
         })

        vis.joinData = vis.joinData.splice(0, 20)

        console.log(vis.joinData)

        d3.select("#colorSelector").on("change", function(event) {
             vis.selectedTeam = this.value;

             matrix.highlightTeam(vis.selectedTeam)

            console.log(vis.selectedTeam)


            vis.updateData()
        });

    }

    updateData() {
        let vis = this

        vis.othersData = [];

        vis.joinData.forEach(function(d, i) {
            console.log(d)
            if (d.team === vis.selectedTeam) {
                vis.teamData = d
                vis.index = i
            }
            else {
                vis.othersData.push(d)
            }
        })
        console.log(vis.othersData)

        console.log(vis.teamData)

        vis.counter = 0;
        vis.money = 0;
        vis.logo1 = document.getElementById('logoH');
        vis.logo2 = document.getElementById('logoA');


        vis.updateMoney();

    }



    betMoney(result) {
        let vis = this

        console.log(result)

        vis.bet = +document.getElementById('bet').value;
        console.log("hi", vis.bet)

        console.log(vis.displayData)


        vis.displayData.forEach(function(d, i) {
                if (i === vis.counter) {
                    console.log('BET', vis.bet)
                    console.log('TEAM', vis.selectedTeam)
                    console.log("d", d)

                    // d.money = vis.counter
                    if (d.result === result) {
                        if (result === 'H') {
                            d.money = (vis.bet * d.hOdds) + vis.money
                        }
                        if (result === 'A') {
                            d.money = (vis.bet * d.aOdds) + vis.money
                        }
                        if (result === 'D') {
                            d.money = (vis.bet * d.dOdds) + vis.money
                        }
                    }
                    else {
                        d.money = vis.money - vis.bet
                    }
                    vis.money = d.money
                    console.log('money', d.money)
                    console.log(vis.counter)
                    if (vis.counter < 37) {
                            vis.logo2.innerHTML = `
        <img src="data/team_images/${vis.displayData[i+1].aTeam}.png" alt="Logo of ${vis.displayData[i+1].aTeam}" style="max-width: 100%; height: auto; padding-top: 20px; padding-bottom: 50px;">
      `;
                            vis.logo1.innerHTML = `
        <img src="data/team_images/${vis.displayData[i+1].hTeam}.png" alt="Logo of ${vis.displayData[i+1].hTeam}" style="max-width: 100%; height: auto; padding-top: 20px; padding-bottom: 50px;">
      `;
                    }


                }
        })


        console.log(vis.displayData)

        vis.counter++

        // creating all cells
        vis.displayData.forEach(function(d, i) {
            // creates a table row
            const row = document.createElement("tr");

            for (let j = 0; j < 4; j++) {
                // Create a <td> element and a text node, make the text
                // node the contents of the <td>, and put the <td> at
                // the end of the table row
                let cellText;
                const cell = document.createElement("td");
                if (j === 0) {
                    cellText = document.createTextNode(`GW: ${d.game}`);
                }
                else if (j === 1) {
                    cellText = document.createTextNode(`${d.hTeam} vs ${d.aTeam}`)
                }
                else if (j === 2) {
                    if (i < vis.counter) {
                        if (d.result === "H") {
                            cellText = document.createTextNode(d.hTeam)
                        }
                        if (d.result === "A") {
                            cellText = document.createTextNode(d.aTeam)
                        }
                        if (d.result === "D") {
                            cellText = document.createTextNode('Draw')
                        }
                    }
                    else {
                        cellText = document.createTextNode('Result')
                    }
                }
                else {
                    cellText = document.createTextNode(`$ ${d.money.toFixed(2)}`);
                }
                cell.appendChild(cellText);
                row.appendChild(cell);
            }

            // add the row to the end of the table body
            vis.tblBody.appendChild(row);
        })

        vis.updateVis()
    }
//
    updateMoney() {
        let vis = this

        console.log(vis.teamData)
        console.log(vis.selectedTeam)

        vis.displayData = vis.teamData.value.map(function (d, i) {

                let data = {
                    date: d.Date,
                    game: i + 1,
                    money: 0,
                    hOdds: d.B365H,
                    aOdds: d.B365A,
                    dOdds: d.B365D,
                    result: d.FTR,
                    hTeam: d["Home Team"],
                    aTeam: d["Away Team"]
                };

                return data
        });

        vis.logo1.innerHTML = `
        <img src="data/team_images/${vis.displayData[0].hTeam}.png" alt="Logo of ${vis.displayData[0].hTeam}" style="max-width: 100%; height: auto; padding-top: 20px; padding-bottom: 50px;">
      `;
        vis.logo2.innerHTML = `
        <img src="data/team_images/${vis.displayData[0].aTeam}.png" alt="Logo of ${vis.displayData[0].aTeamv}" style="max-width: 100%; height: auto; padding-top: 20px; padding-bottom: 50px;">
      `;

        console.log(vis.othersData)

        console.log(vis.money)
        console.log(vis.displayData)

        vis.updateVis()
    }
    updateVis() {
        let vis = this;

        console.log(vis.displayData)

        // Scale
        vis.maxDate = d3.max(vis.displayData, function(d) {
            return d.date;
        });

        vis.minDate = d3.min(vis.displayData, function(d) {
            return d.date;
        });

        vis.x.domain([vis.minDate, vis.maxDate]).nice()

        let maxMon = d3.max(vis.displayData, function(d) {
            return d.money;
        })

        let minMon = d3.min(vis.displayData, function(d) {
            return d.money;
        })

        if (Math.abs(maxMon) > Math.abs(minMon)) {
            vis.extreme = Math.abs(maxMon)
        }
        else {
            vis.extreme = Math.abs(minMon)
        }

        vis.y.domain([-vis.extreme, vis.extreme]).nice()
        console.log(vis.y(vis.displayData[3].money))

        vis.linePos = d3.area()
            .x((d) => vis.x(d.date))
            .y0((d) => vis.height / 2 + 10)
            .y1((d) => vis.y(d.money))
            // .y1(function(d) {
            //     if (d.money > 0) {
            //         return vis.y(d.money)}
            //     else {return vis.y(0)}
            // })
            .curve(d3.curveLinear);

        // vis.lineNeg = d3.area()
        //     .x((d) => vis.x(d.date))
        //     .y0((d) => vis.height / 2 + 10)
        //     .y1(function(d) {
        //         if (d.money < 0) {
        //             return vis.y(d.money)}
        //         else {return vis.y(0)}
        //     })
        //     .curve(d3.curveLinear);

        vis.pathPos = vis.svg.select(".line-pos")

        vis.pathPos.remove()

        vis.pathPos = vis.svg.datum(vis.displayData)
            .append("path")
            .attr("class", "line-pos")
            .attr("stroke", "black")
            .attr("fill", "green")
            .attr("opacity", "0.5")
            .attr("d", vis.linePos)

        // vis.pathNeg = vis.svg.select(".line-neg")
        //
        // vis.pathNeg.remove()
        //
        // vis.pathNeg = vis.svg.datum(vis.displayData)
        //     .append("path")
        //     .attr("class", "line-neg")
        //     .attr("stroke", "black")
        //     .attr("fill", "red")
        //     .attr("d", vis.lineNeg)

        // vis.lines = d3.area()
        //     .x((d) => (vis.x(d.game)))
        //     .y0((d) => vis.height / 2)
        //     .y1((d) => vis.y(d.money))
        //     .curve(d3.curveLinear);
        //
        // vis.paths = vis.svg.select(".lines")
        //
        // vis.paths.remove()
        //
        // vis.otherDisplay.forEach(function(d) {
        //     vis.paths = svg.datum(d)
        //         .append("path")
        //         .attr("class", "lines")
        //         .attr("fill", "grey")
        //         .attr("d", vis.lines)
        // })


        vis.xAxisGroup.transition().duration(800)
            .call(vis.xAxis);

        vis.yAxisGroup.transition().duration(800)
            .call(vis.yAxis);

    }
}

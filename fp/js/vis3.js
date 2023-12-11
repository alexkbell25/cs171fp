class Matrix {
    constructor(_parentElement, data) {
        this.parentElement = _parentElement;
        this.data = data;
        this.displayData = [];

        this.colors = ["green", "red", "orange",]
        this.colorNames = ["Home Win", "Away Win", "Draw"]

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 80, right: 20, bottom: 20, left: 150};

        vis.size = 550;

        vis.width = vis.size - vis.margin.left - vis.margin.right,
            vis.height = vis.size - vis.margin.top - vis.margin.bottom;

        vis.cellPadding = vis.width / 20 / 3;
        vis.cellHeight = vis.cellPadding * 2;
        vis.cellWidth = vis.cellHeight;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // legend
        vis.legend = vis.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width / 2 - 150}, ${vis.height - 45})`);

        vis.legend.selectAll("circle").data(vis.colors)
            .enter()
            .append("circle")
            .attr("r", vis.cellWidth / 2)
            //.attr("height", vis.cellHeight)
            .attr("cx", function (d, i) {
                return i * (120) + 10
            })
            .attr('cy', vis.cellHeight - 10)
            .attr("fill", d => d)

        vis.legend.selectAll("text").data(vis.colorNames)
            .enter()
            .append("text")
            .attr("text-anchor", "start")
            .attr("y", vis.cellHeight / 1.25)
            .attr("x", function (d, i) {
                return i * (120) + vis.cellWidth + 5
            })
            .text(d => d)

        // create tooltip group
        vis.tooltip = d3.select("body").append('div')
            .attr("id", "tool")
            .style("position", "absolute")
            .style("text-align", "center")
            .style('background', 'white')

        // x-label
        vis.svg.append("text")
            .attr("class", "xlabel")
            .attr("text-anchor", "end")
            .attr("x", vis.width / 2 + 80)
            .attr("y", -50)
            .style("font-size", 20)
            .text("Away Teams");

        // y-label
        vis.svg.append("text")
            .attr("class", "ylabel")
            .attr("text-anchor", "end")
            .attr("x", -vis.height / 4)
            .attr("y", - 80)
            .attr("transform", "rotate(-90)")
            .style("font-size", 20)
            .text("Home Teams");

        vis.logo1 = document.getElementById('logo1');
        vis.logo2 = document.getElementById('logo2');

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    };

    wrangleData() {
        var vis = this;

        // group data by team
        console.log("here", vis.data)
        let cleanData = d3.rollup(vis.data, leaves => leaves, d => d["Home Team"])

        console.log(cleanData)

        // create array of games for each team
        vis.cleanData = Array.from(cleanData, ([team, value]) => ({team, value}))
        console.log(vis.cleanData)

        // sort games alphabetically by opponent for each team
        vis.cleanData.forEach(function (d) {
            //console.log(d.value[0]["Home Team"])
            d.value.sort(function (a, b) {
                if (a["Away Team"] < b["Away Team"]) {
                    return -1;
                }
                if (a["Away Team"] > b["Away Team"]) {
                    return 1;
                }
                return 0;
            })

            //console.log(d.value[0]["Home Team"])

        })

        // sort teams
        vis.cleanData.sort(function (a, b) {
            if (a.team < b.team) {
                return -1;
            }
            if (a.team > b.team) {
                return 1;
            }
            return 0;
        })

        console.log(vis.cleanData)

        vis.resultsData = []

        // create matrix (row is the home team, column is the away team)
        vis.resultsData = vis.cleanData.map(function (d, ind) {
            //console.log('d', d)
            let team = [];

            let infos = [];
            let result;
            let hTeam;
            let aTeam;
            let ref;

            //console.log(infos)
            d.value.forEach(function (t, i) {
                //console.log('look', t)
                let info = {};

                if (t["FTR"] === 'H') {
                    info.results = 1
                }
                if (t["FTR"] === 'A') {
                    info.results = 2
                }
                if (t["FTR"] === 'D') {
                    info.results = 3
                }

                info.hTeam = t["Home Team"]
                info.aTeam = t["Away Team"]
                info.ref = t["Referee"]
                info.ftag = t["Ftag"]
                info.fthg = t["Fthg"]



                console.log(info)
                infos.push(info)
                console.log(infos[i])
            })
            //console.log(infos)
            return infos
        });

        console.log('w0w', vis.resultsData)

        // add a zero for the overlap of home and away teams (Arsenal cannot play against Arsenal)
        vis.resultsData.forEach(function (d, index) {
            console.log('d', d)
            let object = {
                results: 0,
                hTeam: 'N/A',
                aTeam: 'N/A'
            }
            d.splice(index, 0, object)

        })

        console.log('results', vis.resultsData)
        console.log('clean', vis.cleanData)

        // format data attributes to set up sorting
        vis.resultsData.forEach(function (d, index) {
            console.log("LOOOOK", +vis.cleanData[index].value[0]["HGD"])
            let team = {
                "index": index,
                "name": vis.cleanData[index].team,
                "info": d,
                "points": +vis.cleanData[index].value[0]["H Pts"],
                "gDifference": +vis.cleanData[index].value[0]["HGD"],
                "xGD": +vis.cleanData[index].value[0]["Hx G"],
                "xGA": +vis.cleanData[index].value[0]["Hx GA"],
                "xPTS": +vis.cleanData[index].value[0]["Hx PTS"]
            };

            // d.value.forEach(function(f) {
            //     //console.log(f['Home Team'])
            //     // team.home = f['Home Team']
            //     // team.away = f['Away Team']
            // })

            vis.displayData.push(team);
        });
        console.log(vis.displayData)
        console.log(vis.resultsData)


        // Update the visualization
        vis.updateVis();
    };

    updateVis(order) {
        let vis = this;
        console.log(order)

        // Draw x-axis labels
        let columnLabel = vis.svg.selectAll(".matrix-column-label")
            .data(vis.displayData);

        columnLabel.enter().append("text")
            .attr("class", "matrix-label matrix-column-label")
            .attr("text-anchor", "start")
            .attr("transform", function (d, index) {
                return "translate(" + (index * (vis.cellWidth + vis.cellPadding) + (vis.cellWidth + vis.cellPadding) / 2) + ",-8) rotate(300)"
            })
            .style("font-size", 10)
            .text(function (d) {
                return d.name;
            });

        if (order === "alphabetical") {
            vis.displayData.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            })
        }
        else {
            vis.displayData.sort(function (a, b) {
                console.log(a)
                return b[order] - a[order]
            })
        }



        // Draw matrix rows (and y-axis labels)
        let dataJoin = vis.svg.selectAll(".matrix-row")
            .data(vis.displayData, function (d) {
                return d.name;
            });

        // ENTER
        let rowsGroups = dataJoin.enter()
            .append("g")
            .attr("class", function (d, i) {
                return "matrix-row matrix-row-" + i;
            })
            .attr("matrix-row-index", function (d, i) {		// We add this attribute to access the row index later
                return i;
            });


        // ENTER
        rowsGroups.append("text")
            .attr("class", "matrix-label matrix-row-label")
            .attr("x", -10)
            .attr("y", vis.cellHeight / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .style("font-size", 10)
            .text(function (d, index) {
                return d.name;
            })

            .merge(dataJoin.select(".matrix-row-label"));   // merge ENTER + UPDATE (row labels)

        rowsGroups.merge(dataJoin)  // merge ENTER + UPDATE groups
            .style('opacity', 0.5)
            .transition()
            .duration(1000)
            .style('opacity', 1)
            .attr("transform", function (d, index) {
                return "translate(0," + (vis.cellHeight + vis.cellPadding) * index + ")";
            });

        console.log(document.getElementById('colorSelector').value)

        // Draw rectangles
        let cells = rowsGroups.selectAll(".matrix-cell")
            .data(function (d) {
                return d.info;
            })
            // .data(vis.resultsData)
            .enter().append("circle")
            .attr("class", function (d, i) {
                return `matrix-cell matrix-col-` + i +` home-` + d.hTeam.replaceAll(' ', '-') + ` away-` + d.aTeam.replaceAll(' ', '-');
            })
            .attr("cx", (d, index) => (vis.cellWidth + vis.cellPadding) * index + 10)
            .attr("cy", vis.cellHeight - 10)
            //.attr("matrix-col-index", function(d, i) {console.log(i)})
            .attr("r", vis.cellWidth / 2)
            //.attr("height", vis.cellHeight)
            .attr("fill", function (d, index) {
                if (d.results === 0) {
                    return "grey"
                }
                if (d.results === 1) {
                    return "green"
                }
                if (d.results === 2) {
                    return "red"
                }
                if (d.results === 3) {
                    return "orange"
                }
            })



            .on('mouseover', function(event, d) {
                if (d.results !== 0) {
                    // vis.tooltip
                    //     .style("opacity", 1)
                    //     .style("left", event.pageX + 20 + "px")
                    //     .style("top", event.pageY + "px")
                    d3.select("#teamH").text(`${d.hTeam} vs ${d.aTeam}`)
                    d3.select("#score").text(`${d.fthg} : ${d.ftag}`)
                    d3.select("#ref").text(`Referee: ${d.ref}`)
                    vis.logo1.innerHTML = `
        <img src="data/team_images/${d.hTeam}.png" alt="Logo of ${d.hTeam}" style="max-width: 100%; height: auto; padding-top: 20px; padding-bottom: 50px;">
      `;
                    vis.logo2.innerHTML = `
        <img src="data/team_images/${d.aTeam}.png" alt="Logo of ${d.aTeam}" style="max-width: 100%; height: auto; padding-top: 20px; padding-bottom: 50px;">
      `;
                }

                    console.log(d)

                    let row = +this.parentNode.getAttribute("matrix-row-index");
                    vis.mouseoverCol(row, row);
            })
            .on('mouseout', function(event, d) {
                vis.tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
                vis.highlightTeam(vis.selectedTeam)
            })

        // var celltext = rowsGroups.selectAll("text")
        //     .data(function (d) {
        //         return d.results;
        //     })
        //     // .data(vis.resultsData)
        //     .enter().append("text")
        //     .attr("x", (d, index) => (vis.cellWidth + vis.cellPadding) * index + 3)
        //     .attr("y", vis.cellHeight - 3)
        //     .attr('fill', 'white')
        //     .attr('font-size', 20)
        //     .text(function (d, index) {
        //         if (d === 0) {
        //             return "N"
        //         }
        //         if (d === 1) {
        //             return "H"
        //         }
        //         if (d === 2) {
        //             return "A"
        //         }
        //         if (d === 3) {
        //             return "D"
        //         }
        //     })


    };

    mouseoverCol(row, col) {
        d3.selectAll(".matrix-cell")
            .transition()
            .duration(300)
            .attr("fill-opacity", 0.2);

        d3.selectAll(".matrix-col-" + col)
            .transition()
            .duration(600)
            .attr("fill-opacity", 1)

        row = d3.selectAll(".matrix-row-" + row)
            .transition()
            .attr("fill-opacity", 1);

        row.selectAll('.matrix-cell')
            .transition()
            .duration(600)
            .attr("fill-opacity", 1);
    };

    highlightTeam(selectedTeam) {
        let vis = this
        vis.selectedTeam = selectedTeam

        d3.selectAll(".matrix-cell")
            .transition()
            .duration(300)
            .attr("fill-opacity", 0.2);

        d3.selectAll(".home-" + selectedTeam.replaceAll(' ', '-'))
            .transition()
            .duration(600)
            .attr("fill-opacity", 1)

        d3.selectAll(".away-" + selectedTeam.replaceAll(' ', '-'))
            .transition()
            .duration(600)
            .attr("fill-opacity", 1)


        // row = d3.selectAll(".matrix-row-" + row)
        //     .transition()
        //     .attr("fill-opacity", 1);
        //
        // row.selectAll('.matrix-cell')
        //     .transition()
        //     .duration(600)
        //     .attr("fill-opacity", 1);

    }
}





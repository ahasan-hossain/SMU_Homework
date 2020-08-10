//Load data and filter
$(document).ready(function() {
    Filter();
});

function Filter() {
    $.ajax({
        type: 'GET',
        url: "samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            console.log(data);
            data["names"].forEach(function(id) {
                // console.log(id);
                let option = `<option>${id}</option>`;
                $('#selDataset').append(option);
            });

            let initID = data["names"][0]

            optionChanged(initID);
        }
    });
}

//Call all functions
function optionChanged(id) {
    loadMetaData(id);
    makeBarPlot(id);
    bubblePlot(id);
    gaugePlot(id)
}


// Load the Demographic Info to adjust to Test filter
function loadMetaData(id) {
    $.ajax({
        type: 'GET',
        url: "samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let metaData = data["metadata"].filter(x => x.id == id)[0];
            console.log(metaData);



            //This clears metadata
            $('#sample-metadata').empty();

            Object.entries(metaData).forEach(function([key, value]) {
                let info = `<p><b>${key.toUpperCase()}</b> : ${value} </p>`;
                $('#sample-metadata').append(info);
            });
        }
    });
}



//Plot the bar graph
function makeBarPlot(id) {
    $.ajax({
        type: 'GET',
        url: "samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let sampleData = data["samples"].filter(x => x.id == id)[0];


            let plotData = sampleData["otu_ids"].map(function(e, i) {
                return [e, sampleData["sample_values"][i]];
            });


            // Sort bars and only return top 10. Must be in inverse
            let plotData_Sorted = plotData.sort((a, b) => b[1] - a[1]);
            x = plotData_Sorted.map(x => x[1]).slice(0, 10).reverse()
            y = plotData_Sorted.map(x => "OTU " + x[0]).slice(0, 10).reverse()


            var traces = [{
                type: 'bar',
                x: x,
                y: y,
                orientation: 'h',
                marker: {
                    color: x,
                    colorscale: 'Reds'
                }
            }];

            var layout = {
                title: 'OTU Ids to Values'
            };

            Plotly.newPlot('bar', traces, layout);
        }
    });
}



//Plot the bar graph
function bubblePlot(id) {
    $.ajax({
        type: 'GET',
        url: "samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let sampleData = data["samples"].filter(x => x.id == id)[0];

            var trace1 = {
                x: sampleData["otu_ids"],
                y: sampleData["sample_values"],
                mode: 'markers',
                marker: {
                    size: sampleData["sample_values"].map(x => x * 0.75),
                    color: sampleData["otu_ids"],
                    colorscale: 'Reds'
                }
            };

            var data = [trace1];

            var layout = {
                title: 'OTU Ids to Values',

            };

            Plotly.newPlot('bubble', data, layout);
        }
    });
}

function gaugePlot(id) {
    $.ajax({
        type: 'GET',
        url: "samples.json",
        contentType: 'application/json;charset=UTF-8',
        success: function(data) {
            let sampleData = data["metadata"].filter(x => x.id == id)[0];

            let all_wfreq = data["metadata"].map(x => x.wfreq);
            all_wfreq = all_wfreq.filter(function(el) {
                return el != null;
            });

            //Create the average function
            let average = (array) => array.reduce((a, b) => a + b) / array.length;

            console.log(sampleData);

            var trace1 = {
                type: "indicator",
                mode: "gauge+number+delta",
                value: sampleData.wfreq,
                delta: { reference: average(all_wfreq), increasing: { color: "RebeccaPurple" } },
                gauge: {
                    axis: { range: [Math.min(...all_wfreq), Math.max(...all_wfreq)], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "purple" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "darkgray",
                    steps: [
                        { range: [Math.min(...all_wfreq), Math.max(...all_wfreq)], color: "cyan" }
                    ],
                    threshold: {
                        line: { color: "red", width: 8 },
                        thickness: 0.95,
                        value: sampleData.wfreq
                    }
                }
            }

            var data = [trace1];

            var layout = {
                title: "Belly Button Wash Frequency"
            };

            Plotly.newPlot('gauge', data, layout);
        }
    });
}
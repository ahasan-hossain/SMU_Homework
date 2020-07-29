// from data.js
var tableData = data;



// Code the doc.ready

$(document).ready(function() {
    //init load
    populateShapeFilter();
    populateCountryFilter();
    populateStateFilter();
    buildTable();

    // Add your event listeners for button click and form submit, and prevent page from refreshing
    $('#filter-btn').on("click", function(event) {
        event.preventDefault();
        buildTable();
    });
    $('#form').on("submit", function(event) {
        event.preventDefault();
        buildTable();
    });

    $('#stateFilter, #countryFilter, #shapeFilter').on("change", function(event) {
        event.preventDefault();
        buildTable();
    });

});



// Filter by State
function populateStateFilter() {
    var states = [...new Set(tableData.map(x => x.state))];
    states.sort();

    states.forEach(function(state) {
        let choice = `<option>${state}</option>`
        $('#stateFilter').append(choice);
    });
}

// Filter by Country
function populateCountryFilter() {
    var countries = [...new Set(tableData.map(x => x.country))];
    countries.sort();

    countries.forEach(function(country) {
        let choice = `<option>${country}</option>`
        $('#countryFilter').append(choice);
    });
}


// Filter by Shape
function populateShapeFilter() {
    var shapes = [...new Set(tableData.map(x => x.shape))];
    shapes.sort();

    shapes.forEach(function(shape) {
        let choice = `<option>${shape}</option>`
        $('#shapeFilter').append(choice);
    });
}



function buildTable() {
    // Add filters

    var inputValue = $('#datetime').val();
    var stateFilter = $('#stateFilter').val();
    var countryFilter = $('#countryFilter').val();
    var shapeFilter = $('#shapeFilter').val();


    // Use the form input to filter the data by blood type
    //alert(inputValue);
    var sub_data = tableData;
    if (inputValue !== "") {
        sub_data = tableData.filter(x => Date.parse(x.datetime) === Date.parse(inputValue));
    }
    if (stateFilter != "All") {
        sub_data = sub_data.filter(x => x.state === stateFilter);
    }
    if (countryFilter != "All") {
        sub_data = sub_data.filter(x => x.country === countryFilter);
    }
    if (shapeFilter != "All") {
        sub_data = sub_data.filter(x => x.shape === shapeFilter);
    }





    // converted to data table
    $('#ufo-table').DataTable().clear().destroy(); //clear datatable
    $('#ufo-table tbody').empty();
    sub_data.forEach(function(thing) {
        let row = "<tr>"
        Object.entries(thing).forEach(function([key, value]) {
            row += `<td>${value}</td>`;
        });
        row += "</tr>";
        $('#ufo-table tbody').append(row);
    });
    $('#ufo-table').DataTable({
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'csvHtml5',
            ]
        }) //rebuild it


}
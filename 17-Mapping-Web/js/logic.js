$(document).ready(function() {
    let fullURL = $('#timeFilter').val();
    makeMap(fullURL, -1);

    //EL for dropdowns
    $("#timeFilter, #magFilter").change(function() {
        let fullURL = $('#timeFilter').val();
        let minMag = $('#magFilter').val();
        let vizText = $("#timeFilter option:selected").text();
        $('#vizTitle').text(`Recorded Earthquakes from the ${vizText}`);
        makeMap(fullURL, minMag);
    });
});

function makeMap(fullURL, minMag) {
    $('#mapParent').empty();
    $('#mapParent').append('<div style="height:700px" id="map"></div>');

    // Add tile layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v10",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });

    d3.json(fullURL).then(function(response) {
        // console.log(response);

        //make Markers for the heatmap
        var markers = L.markerClusterGroup(); //this is already a master layer
        var heatArray = [];
        var circles = [];

        var earthquakes = response.features;

        earthquakes.forEach(function(earthquake) {
            if ((earthquake.geometry.coordinates[1]) && (earthquake.geometry.coordinates[0])) {
                if (earthquake.properties.mag >= minMag) {

                    let temp = L.marker([+earthquake.geometry.coordinates[1], +earthquake.geometry.coordinates[0]]).bindPopup(`<h4>${earthquake.properties.place}</h4><hr><h5>Mag: ${earthquake.properties.mag}</h5><hr><h5>Time: ${new Date(earthquake.properties.time)}</h5>`);
                    markers.addLayer(temp);

                    //heatmap points
                    heatArray.push([+earthquake.geometry.coordinates[1], +earthquake.geometry.coordinates[0]]);

                    //circle points
                    let circle = L.circle([+earthquake.geometry.coordinates[1], +earthquake.geometry.coordinates[0]], {
                        fillOpacity: 0.8,
                        color: "white",
                        fillColor: getCircleColor(earthquake.properties.mag),
                        radius: getMarkerSize(earthquake.properties.mag)
                    }).bindPopup(`<h4>${earthquake.properties.place}</h4><hr><h5>Mag: ${earthquake.properties.mag}</h5><hr><h5>Time: ${new Date(earthquake.properties.time)}</h5>`);

                    circles.push(circle);
                }
            }
        });

        //Load data
        var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
        d3.json(tectonicPlatesURL).then(function(plates) {
            let plateLayer = L.geoJson(plates, {
                // Style each feature (in this case a tectonic plate)
                style: function(feature) {
                    return {
                        color: "orange",
                        weight: 1.5
                    };
                }
            });

            //Create heatmap layer
            var heat = L.heatLayer(heatArray, {
                radius: 60,
                blur: 40
            });

            //Create circle layer
            var circleLayer = L.layerGroup(circles);

            // Create a baseMaps object to contain the streetmap and outdoorsmap
            var baseMaps = {
                "Street": streetmap,
                "Outdoors": outdoorsmap,
                "Light": lightmap,
                "Satellite": satellitemap
            };

            var overlayMaps = {
                "Heatmap": heat,
                "Markers": markers,
                "Circles": circleLayer,
                "Tectonic Plates": plateLayer
            };

            // Creating map object
            var myMap = L.map("map", {
                center: [37.7749, -122.419],
                zoom: 4,
                layers: [outdoorsmap, markers, plateLayer]
            });

            // Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
            myMap.addLayer(markers);
            L.control.layers(baseMaps, overlayMaps).addTo(myMap);

            // Create a legend
            var legend = L.control({ position: 'bottomleft' });
            legend.onAdd = function() {
                var div = L.DomUtil.create("div", "info legend");

                //create HTML for legend (has to be i tags)
                div.innerHTML += "<h4>Magnitudes</h4>";
                div.innerHTML += '<i style="background: #98ee00"></i><span>0-1</span><br>';
                div.innerHTML += '<i style="background: #d4ee00"></i><span>1-2</span><br>';
                div.innerHTML += '<i style="background: #eecc00"></i><span>2-3</span><br>';
                div.innerHTML += '<i style="background: #ee9c00"></i><span>3-4</span><br>';
                div.innerHTML += '<i style="background: #ea822c"></i><span>4-5</span><br>';
                div.innerHTML += '<i style="background: #ea2c2c"></i><span>5+</span>';

                return div
            }
            legend.addTo(myMap);
        });
    });
}

//Function for Markersize and Circle Color
function getMarkerSize(mag) {
    let radius = 50000;
    if (mag > 0) {
        radius = mag * 50000;
    }
    return radius;
}

function getCircleColor(mag) {
    let color = "";
    if (mag >= 5) {
        color = "#ea2c2c";
    } else if (mag >= 4) {
        color = "#ea822c";
    } else if (mag >= 3) {
        color = "#ee9c00";
    } else if (mag >= 2) {
        color = "#eecc00";
    } else if (mag >= 1) {
        color = "#d4ee00";
    } else {
        color = "#98ee00";
    }

    return color;
}
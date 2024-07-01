// URL for the GeoJSON earthquake data - all earthquakes in the past 7 days
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Initiate the Leaflet map
let earthquake_map = L.map("map", {
    // Centered on Kansas City
    center: [39.09, -94.58],
    zoom: 5
});


// Add the tile layer to the map
let Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});
Stadia_AlidadeSmooth.addTo(earthquake_map);


//Leaflet circleMarker: fillColor property - marker color corresponding to earthquake depth
function depth_color(depth) {
    switch (true) {
        case depth >= 90:
            return "#FF5F65";
        case depth >= 70:
            return "#FCA35D";
        case depth >= 50:
            return "#FDB72A";
        case depth >= 30:
            return "#F7DB11";
        case depth >= 10:
            return "#DCF400";
        case depth >= -10:
            return "#A3F600";
        default:
            return "#000000";
    }
}

// Leaflet circleMarker: radius property  - marker size corresponding to earthquake magnitude 
function magnitude(marker_size) {
    return marker_size * 5;
}


//Leaflet circleMarker: properties
function marker_options(feature) {
    return {
        radius: magnitude(feature.properties.mag),
        fillColor: depth_color(feature.geometry.coordinates[2]),
        color: "#000000",
        weight: 1,
        opacity: .5,
        fillOpacity: .5
    };   
}


// Leaflet onEachFeature: properties
function each_feature(feature, layer) {
    let quake_date = new Date(feature.properties.time);
    layer.bindPopup(
        quake_date +
        "<h4>" + feature.properties.title + "</h4>" +
        "<b>Lat:</b> " + feature.geometry.coordinates[0] +
        "<br /><b>Lon:</b> " + feature.geometry.coordinates[1] +
        "<br /><b>Depth:</b> " + feature.geometry.coordinates[2]  + " km"
    );
}


// Legend for map color depth
function make_legend(){
    let legend = L.DomUtil.create("div", "legend"),

        depth = [-10, 10, 30, 50, 70, 90];
        legend.innerHTML +=
            '<b>Depth</b> <br />' +
            '<span style="background:' + depth_color(depth[0]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[0] + '-' +  depth[1] + ' km<br />' +
            '<span style="background:' + depth_color(depth[1]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[1] + '-' +  depth[2] + ' km<br />' +
            '<span style="background:' + depth_color(depth[2]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[2] + '-' +  depth[3] + ' km<br />' +
            '<span style="background:' + depth_color(depth[3]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[3] + '-' +  depth[4] + ' km<br />' +
            '<span style="background:' + depth_color(depth[4]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[4] + '-' +  depth[5] + ' km<br />' +
            '<span style="background:' + depth_color(depth[5]) + ';">&nbsp&nbsp&nbsp</span> ' + depth[5] + ' km<br />'

    return legend;
}


// Leaflet layer for the map legend
function add_legend(map){
    let legend = L.control({position: "bottomright"});
    legend.onAdd = make_legend
    legend.addTo(map)
}


// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {

    // Add earthquake geoJson data to the map
    L.geoJson(data, {

        pointToLayer: function (feature, latlng) {
           return L.circleMarker(latlng, marker_options(feature));
        },

        // Feature data popup
        onEachFeature: each_feature

    }).addTo(earthquake_map);

    // Add the color legend
    add_legend(earthquake_map)

});
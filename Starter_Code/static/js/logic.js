let streetmap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png")

let map = L.map("map", {
    center: [40.73, -94.0059],
    zoom: 3,
    layers: [streetmap]
  });

//reading the data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    function styleFunction(feature) {
        return {
            fillColor: getColor(feature.geometry.coordinates[2]),// 2 indicates depth into the earth in the geojson url we are pulling from
            radius: getRadius(feature.properties.mag),
            opacity: 1,
            fillOpacity: 1,
            color: 'black',
            weight: 0.3
        }
    };
    function getColor(depth) {
        switch (true) {
            case depth > 90: return "red";
            case depth > 60: return "blue";
            case depth > 30: return "yellow";
            default: return "green";
        } //switch is shorthand for if statements
    }
    function getRadius(mag) {
        if (mag === 0) {
            return 1
        }
        return mag * 4 // increase size to see
    }
    L.geoJson(data, {
        pointToLayer: function (feature, coords) {
            return L.circleMarker(coords);
        }, style: styleFunction, onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.place + "<br> Magnitude" + feature.properties.mag + 
            "<br> depth:" + feature.geometry.coordinates[2])
        }
    }).addTo(map);
})


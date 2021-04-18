let map;
var directionService;
var directionDisplay;
var marker;
var pizzaMarker;
const pizzaCoords = { lat: 50.464379, lng: 30.519131 };

function initMap() {
    directionService = new google.maps.DirectionsService();
    directionDisplay = new google.maps.DirectionsRenderer();

    map = new google.maps.Map(document.getElementById("map"), {
        center: pizzaCoords,
        zoom: 16,
    });

    directionDisplay.setMap(map);

    addMarker({ coords: pizzaCoords });
    pizzaMarker = marker;
    marker = null;

    google.maps.event.addListener(map, 'click', function(me) {
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function(err, address) {
            if (!err) {
                //Дізналися адресу
                console.log(address);
            } else {
                console.log("Немає адреси")
            }
            addMarker({coords: coordinates});
            calculateAndDisplayRoute(pizzaCoords, coordinates, function (err, duration) {
                console.log(duration);
                console.log(duration.duration.text);
                document.getElementById('delivery-time').innerHTML = duration.duration.text;
                document.getElementById('delivery-address').innerHTML = address;
                $('#exampleInputAddress1').val(address);
            });

        })
    });



}

function addMarker(props) {
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({
        position: props.coords,
        map: map,
    });
}

function geocodeLatLng(latlng, callback){
//Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var address = results[1].formatted_address;
            callback(null, address);
        } else {
            callback(new Error("Can't find adress"));
        }
    });
}

function geocodeAddress(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            callback(null, coordinates);
        } else {
            callback(new Error("Can not find the adress"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng, callback) {
    directionDisplay.setMap(map);
    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionService, directionDisplay);
    };
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]

    }, function(response, status) {
        if (status === 'OK') {
            varleg = response.routes[0].legs[0];
            callback(null, {
                duration: varleg.duration
            });
        } else {
            callback(new Error("Can' not find -direction"));
        }
    });
}

function calculateAndDisplayRoute(A_latlng, B_latlng, callback) {
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]

    }, function(response, status) {
        if (status === 'OK') {
            directionDisplay.setDirections(response);
            varleg = response.routes[0].legs[0];
            callback(null, {
                duration: varleg.duration
            });
        } else {
            callback(new Error("Can' not find -direction"));
        }
    });
}

document.addEventListener("keyup", function(event) {
    var txt = $("#exampleInputAddress1").val();
    if (event.code === 'Enter' && $("#exampleInputAddress1").is(":focus") && txt !== "") {
        geocodeAddress(txt, function (err, coordinates) {
            calculateAndDisplayRoute(pizzaCoords, coordinates, function (err, duration) {
                console.log(duration);
                console.log(duration.duration.text);
                document.getElementById('delivery-time').innerHTML = duration.duration.text;
                geocodeLatLng(coordinates, function (err, address) {
                    document.getElementById('delivery-address').innerHTML = address;
                    $('#exampleInputAddress1').val(address);
                });
            });
        });
        $(".input").val("");
    }
});
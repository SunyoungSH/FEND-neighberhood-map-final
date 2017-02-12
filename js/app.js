// Lists of my favorite restaurants and cafes in Mannheim, Germany
var locations = [{
        title: 'Soban',
        address: 'I2 22 68159 Mannheim',
        type: 'restaurant',
        phone: '+49 621 44581800',
        summary: 'The best Korean food in town.',
        fsid: '57adac4f498e5988a961d6e2',
        location: {
            lat: 49.4912315508094,
            lng: 8.46756253391504
        }
    },
    {
        title: 'Azteca Mexicana',
        address: 'Stadthaus N1 68161 Mannheim',
        type: 'restaurant',
        phone: '+4962118144777',
        summary: 'Always meets expectation. When in doubt, choose Azteca!',
        fsid: '4fafb8a9e4b0861ead114cdb',
        location: {
            lat: 49.4860551818188,
            lng: 8.46556471185025
        }
    },
    {
        title: 'Asia Food Ichi',
        address: 'Q2 13 68161 Mannheim',
        type: 'restaurant',
        phone: '+496218624678',
        summary: 'Authentic Chinese food',
        fsid: '4e9323566c25b073b7f59257',
        location: {
            lat: 49.4884605407715,
            lng: 8.46895694732666
        }
    },
    {
        title: 'Zwei Hasen',
        address: 'Bellenstr. 36 68163 Mannheim',
        type: 'restaurant',
        phone: '+49621822602',
        summary: 'Cheap but of decent quality Italien',
        fsid: '4d446f8bbbb1a14356984672',
        location: {
            lat: 49.4752815,
            lng: 8.4697995
        }
    },
    {
        title: 'Supan´s',
        address: 'N3 1 68161 Mannheim',
        type: 'restaurant',
        phone: '+496211567723',
        summary: 'Nice Thai food, but only standing tables',
        fsid: '4bf5352ccad2c928d3ba9c99',
        location: {
            lat: 49.48546,
            lng: 8.46655
        }
    },
    {
        title: 'Zeitgeist',
        address: 'Meerfeldstr. 45 68163 Mannheim',
        type: 'cafe',
        phone: '+4962144590157',
        summary: 'Best icecream in Mannheim! Flavers are changed everyday.',
        fsid: '5558a56c498ede0747d56084',
        location: {
            lat: 49.4738739571148,
            lng: 8.46924369447743
        }
    },
    {
        title: 'Cafe Sammo',
        address: 'B1 4 68159 Mannheim',
        type: 'cafe',
        phone: '+4917664197851',
        summary: 'where the uni students hang out',
        fsid: '4c5421ef479fc928eac29b92',
        location: {
            lat: 49.4861,
            lng: 8.46349
        }
    },
    {
        title: 'Novus',
        address: 'M4 1 68161 Mannheim',
        type: 'cafe',
        phone: '+4962113873',
        summary: 'Really nice lunch specials',
        fsid: '4baa60b8f964a5206e643ae3',
        location: {
            lat: 49.4846914888694,
            lng: 8.4669981701966
        }
    },
    {
        title: 'Starks',
        address: 'Kunststr. N4,13 68161 Mannheim',
        type: 'cafe',
        phone: '+496211220129',
        summary: 'Nice brunches',
        fsid: '4bd97eb52e6f0f47edb80a08',
        location: {
            lat: 49.4855730193,
            lng: 8.46857448103
        }
    },
    {
        title: 'Blum Coffee Bar',
        address: 'Schwetzinger Str. 92 68165 Mannheim',
        type: 'cafe',
        phone: '+4962126230',
        summary: 'Yummy cakes!',
        fsid: '4c8649092f1c236ab0a25b43',
        location: {
            lat: 49.4777764,
            lng: 8.4781379
        }
    }
];

// request for Foursqure API to get ratings and a photo of the place
var add4square = function(item) {
    var clientId = 'HCUV3F2U4REXQ0DTZO40EEPYAC52FLUDETS1RMP5BPFUJ2O0';
    var clientSecret = '4KG3PXFRROKCJVNZGWXPL3FUCSGMP1L5NTWK4RCZYRWVQYQS';
    var v = '&v=20170212';
    var url = 'https://api.foursquare.com/v2/venues/';
    var fullUrl = url + item.fsid + '?client_id=' + clientId + '&client_secret=' + clientSecret + v;
    var photoUrl = url + item.fsid + '/photos?client_id=' + clientId + '&client_secret=' + clientSecret + v;
    $.ajax({
        type: 'GET',
        dataType: 'json',
        async: true,
        url: fullUrl,
        success: function(data) {
            var rating = data.response.venue.rating;
            var imgSrcPre = data.response.venue.photos.groups[0].items[0].prefix;
            var imgSrcSuf = data.response.venue.photos.groups[0].items[0].suffix;
            var imgSrc = imgSrcPre + '300x200' + imgSrcSuf;
            item.rating = rating;
            item.imgSrc = imgSrc;
        }
    }).fail(function() {
        //Foursqure API Error Handling
        item.error = "Sorry, information available regarding this place could not be reached. Please refresh and try again.";
    });
};

//ViewModel manages the list, its filtering and showing infowindow when a list item is clicked using KnockOut JS.
var ViewModel = function() {
    var self = this;
    //creating list from the data model
    this.list = ko.observableArray([]);
    this.showList = ko.observable(true);
    for (var i = 0; i < locations.length; i++) {
        self.list.push(locations[i]);
    }
    this.matchMarker = function(item) {
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].title == item.title) {
                return markers[i];
            }
        }
    };
    //When an item in the list is cliceked, infowindow is shown
    this.toggleShow = function(item) {
        google.maps.event.trigger(self.matchMarker(item), 'click');
    };
    //toggle list view when window width is less than 600px
    this.toggleList = function() {
        self.showList(!self.showList());
    }
    // List is filtered based on searchbar
    this.filteredList = ko.observableArray(self.list());
    this.searchStr = ko.observable('');
    this.filtered = ko.computed(function() {
        var filter = self.searchStr().toLowerCase();
        return ko.utils.arrayFilter(self.list(), function(item) {
            var result = (item.title.toLowerCase().indexOf(filter) > -1 || item.address.toLowerCase().indexOf(filter) > -1);
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].title == item.title) {
                    markers[i].setVisible(result);
                }
            }
            return result;
        });
    });

};

var map;
var markers = [];

// all Google Map API related functionalities
function initMap() {
    // Map styles to be filled out later!
    var styles = [

    ];
    var infoWindow = new google.maps.InfoWindow();
    // constructs a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 49.4792,
            lng: 8.47077
        },
        zoom: 14,
        styles: styles,
        mapTypeControl: false
    });
    // markers created
    for (var i = 0; i < locations.length; i++) {
        var marker = new google.maps.Marker({
            position: locations[i].location,
            title: locations[i].title,
            address: locations[i].address,
            type: locations[i].type,
            phone: locations[i].phone,
            summary: locations[i].summary,
            visible: locations[i].visible,
            fsid: locations[i].fsid,
            map: map,
            animation: google.maps.Animation.DROP,
            error: ""
        });
        markers.push(marker);
        // Foursqure API info added to the markers
        add4square(markers[i]);
        // Open infowindow when marker is clicked.
        marker.addListener('click', function() {
            var marker = this;
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 750);
            openInfoWindow(this, infoWindow);
        });
    }
    // setting content of infowindow. In case of error, show an error message.
    function openInfoWindow(marker, infoWindow) {
        if (marker.error !== "") {
            infoWindow.setContent(marker.error);
        } else {
            infoWindow.marker = marker;
            infoWindow.setContent(
                '<div id="infoWindow"><b>' +
                marker.title + '</b><br>' + 'Address: ' + marker.address + '<br>' + 'Type: ' + marker.type + '<br>' + 'Phone: ' + marker.phone + '<br>' + 'Rating: ' + marker.rating + '/10' + '<br>' + '<em>"' + marker.summary + '"</em>' + '<br><img src=' + marker.imgSrc + '></div>');
        }
        infoWindow.open(map, marker);
        infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
        });

    }
    // show markers
    function showMarkers() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }
}
// handles error in case Google Maps API cannot be reached
function googleErrorHandler() {
    alert("Sorry, Google ran into an error! :(");
}

ko.applyBindings(ViewModel());

// Sources I got help from:
// https://www.codeproject.com/Articles/822879/Searching-filtering-and-sorting-with-KnockoutJS-in
// http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
// https://github.com/udacity/ud864
// http://knockoutjs.com/documentation/introduction.html
// Several posts in Udacity forum

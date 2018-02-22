/*
 * Cars/offers localizations on map
 *
 *  INFO !!!
 *  1. just for the map we will need google maps script with API key and styles from snazzy maps
 *  2. for map with clusters and infoboxes we will need these jQuery libraries:
 *      2.1 OverlappingMarkerSpiderfier
 *          https://github.com/jawj/OverlappingMarkerSpiderfier
 *     2.2 MarkerClusterer for Google Maps v3
 *         http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/
 *     2.3 MarkerWithLabel for V3
 *         https://github.com/printercu/google-maps-utility-library-v3-read-only/tree/master/markerwithlabel
 *     2.4 InfoBox
 *         https://developers.google.com/maps/documentation/javascript/infowindows
 *
 *  HAVE FUN :-)
 */

(function($) {

	$(document).ready( function() {

		var map;
		var marker;
		var markers = [];
    	var infoboxes = [];

		function initializeMap() {

			var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			var isDraggable = w > 480 ? true : false;

			var latlng = new google.maps.LatLng( 40.7127837, -74.00594130000002 );
      var mapOptions = {
          zoom: 11,
          mapTypeControl: false,
          scrollwheel: false,
          needsFit: true,
          isPanned: false,
          formIndex: 0,
          center: latlng,
          draggable: isDraggable,
          styles: [{"featureType": "water","elementType": "geometry","stylers": [{"color": "#e9e9e9"},{"lightness": 17}]},
                   {"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 20}]},
                   {"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#ffffff"},{"lightness": 17}]},
                   {"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#ffffff"},{"lightness": 29},{"weight": 0.2}]},
                   {"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 18}]},
                   {"featureType": "road.local","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 16}]},
                   {"featureType": "poi","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 21}]},
                   {"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#dedede"},{"lightness": 21}]},
                   {"elementType": "labels.text.stroke","stylers": [{"visibility": "on"},{"color": "#ffffff"},{"lightness": 16}]},
                   {"elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#333333"},{"lightness": 40}]},
                   {"elementType": "labels.icon","stylers": [{"visibility": "off"}]},
                   {"featureType": "transit","elementType": "geometry","stylers": [{"color": "#f2f2f2"},{"lightness": 19}]},
                   {"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#fefefe"},{"lightness": 20}]},
                   {"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#fefefe"},{"lightness": 17},{"weight": 1.2}]}
                ],
     }

			map = new google.maps.Map(document.getElementById('cd-locations'), mapOptions);

			/* marker loop */
			createMarkers();
		};

	    function createMarkers() {

	    	tdClearMap();

	    	var oms = new OverlappingMarkerSpiderfier(map, {
		      	markersWontMove: true,
		      	markersWontHide: true,
	          	keepSpiderfied: true
	        });
		    oms.addListener('unspiderfy', function(spidered, unspidered) {
		      	for (var i = 0; i < spidered.length; i++) {
			        spidered[i].setLabel("" + (i + 1));
			        spidered[i].setOptions({
			          	zIndex: i
			        });
		      	}
		    });

		    // Clusterer
		    var styles = [[{
			    url: 'assets/images/cluster-icon.png',
			    width: 75,
          height: 40,
			    opt_anchor: [15, 15],
			    textColor: '#438cca',
			    textSize: 14
			}]];

		    var markerCluster = new MarkerClusterer(map, markers, {styles: styles[0]});
	          minClusterZoom = 14;
    			  markerCluster.setMaxZoom(minClusterZoom);
    			  markerCluster.setMap(map);

	    	var self = this;
			  var section = jQuery( '#demoCars' ).eq( map.formIndex );

			this.results = {};
			this.items = section.find( '.cd-offer-blk, .dealer-card' );

			//var marker, i;
		    var bounds = new google.maps.LatLngBounds();

		    var totalListings = 0;

			jQuery.each( this.items, function(i, el) {

				totalListings++;

				var $el = jQuery(el);

				if ( ! ( $el.data( 'lat' ) && $el.data( 'long' ) ) ) {
					return;
				}

				var data = {
					lat:      $el.data( 'lat' ),
					lng:      $el.data( 'long' ),
					thumb:    $el.data( 'thumb' ),
					pin:      $el.data( 'pin' ),
					price:    $el.data( 'price' ),
					title:    $el.data( 'title' ),
					desc:     $el.data( 'desc' ),
					link:     $el.data( 'link' )
				}

				var siteLatLng = new google.maps.LatLng( data.lat, data.lng );
		        var marker = new MarkerWithLabel({
		            position: siteLatLng,
		            map: map,
		            draggable: false,
		            title: data.title,
		            icon: data.pin,
		            html:  '<div class="marker-holder"><div class="marker-content"><div class="marker-listing-image" style="background-image: url('+data.thumb+');"></div><span class="marker-listing-title"><a href="'+data.link+'">'+data.title+'</a></span></div></div>'
		        });

             var infobox = new InfoBox({
    		        disableAutoPan: false,
    		        maxWidth: 60,
    	        	pixelOffset: new google.maps.Size(-30, -50),
    		        zIndex: null,
    		        boxStyle: {
    		        	background: "#fff",
    		            opacity: 1,
    		            width: "60px",
    	            	height: "35px"
    		        },
    		        closeBoxMargin: "28px 26px 0px 0px",
    		        closeBoxURL: "",
    		        infoBoxClearance: new google.maps.Size(1, 1),
    		        pane: "floatPane",
    		        enableEventPropagation: false
    		    });

		        bounds.extend(siteLatLng);
		        markers.push(marker);
		        oms.addMarker(marker);
		        markerCluster.addMarker(marker);

            infobox.setContent(marker.html);
            infobox.open(map, marker);

			});

	        /* end marker loop */

	        map.fitBounds(bounds);

	    }

		function tdClearMap() {
	        //Loop through all the markers and remove
	        for (var i = 0; i < markers.length; i++) {
	            markers[i].setMap(null);
	        }
	        markers = [];
	    };

	    var $target = jQuery( '#cd-locations' );

		if ( $target.length > 0 ) {
			initializeMap();
		}

   	});

})(jQuery);

<!doctype html>

<!--[if lt IE 7]><html <?php language_attributes(); ?> class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if (IE 7)&!(IEMobile)]><html <?php language_attributes(); ?> class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if (IE 8)&!(IEMobile)]><html <?php language_attributes(); ?> class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--> <html <?php language_attributes(); ?> class="no-js"><!--<![endif]-->

	<head>
		<meta charset="utf-8">

		<title><?php wp_title(''); ?></title>

		<!-- Google Chrome Frame for IE -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

		<!-- mobile meta (hooray!) -->
		<meta name="HandheldFriendly" content="True">
		<meta name="MobileOptimized" content="320">
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

		<!-- icons & favicons (for more: http://themble.com/support/adding-icons-favicons/) -->
		<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico">

  		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
  		
  		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
  		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDbWc_3x-gGY0LnXMBpRukGoVNsJrLMbW0&sensor=true"></script>
  		<script type="text/javascript">
  			var map;
  			var bigMap;
  			var marker;

  			/*BUGS
			*
				If you change the address text after verification, it will still submit without re-confirming.
			*
			*/

			function initializeMap ( el, mapOptions ) {
				var map;
				if(mapOptions) {

				} else {
					mapOptions = {
						zoom: 16,
		          		mapTypeId: google.maps.MapTypeId.ROADMAP
					};	
				}
				map = new google.maps.Map(el, mapOptions);
				return map;
			} 

			function drawOrders ( orders, map ) {
				for( order in orders ) {
					placeMarker(map, new google.maps.LatLng(order.latitude,order.longitude));
				}
			}

			function placeMarker ( map, latLng ) {
    			var marker = new google.maps.Marker({
				    	position: latLng,
				    	title:"BRING COOKIES HERE"
					});
    			
				marker.setMap(map);
    			return marker;
    		}

    		function moveMarker ( marker, latLng ) {
    			marker.position = latLng;
    			return marker;
    		}

	  		function initialize() {
		        //center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		        if(map)
		        	return;
    			var mapOptions = {
		          zoom: 16,
		          mapTypeId: google.maps.MapTypeId.ROADMAP
		        };
		        map = new google.maps.Map(document.getElementById("map_overlay"), mapOptions);
		        drawDeliveryZones(map);
		    }

		    function displayBigMap() {
		    	if(bigMap)
		    		return;
		    	if(!$("#bigMap").length > 0)
		    		return;
		    	var mapOptions = {
		          zoom: 13,
		          mapTypeId: google.maps.MapTypeId.ROADMAP
		        };
		        bigMap = new google.maps.Map(document.getElementById("bigMap"), mapOptions);
		        drawDeliveryZones(bigMap);
		        bigMap.setCenter(new google.maps.LatLng(42.372202,-71.118193));
		    }

		    function Map ( selector, options ) {
		    	this.selector = selector;
		    	this.$ = $(selector);
		    	this.options = options || {zoom:13, mapTypeId: google.maps.MapTypeId.ROADMAP};
		    	this.map = new google.maps.Map(this.$.get(0),this.options);
		    	this.deliveryZones = { };
		    }

		    Map.prototype.showMap( ) {
		    	this.$.show();
		    }
		    
		    Map.prototype.hideMap( ) {
		    	this.$.hide();
		    }

		    Map.prototype.containsLocation( latLng ) {
		    	for ( var zone in this.deliveryZones ) {
		    		if (google.maps.geometry.poly.containsLocation(latLng,zone) )
		    			return true;
		    	}
		    	return false;
		    }

		    //map should be refactored into an object that contains an instance of the map itself, a reference to the ID it will be contained in, a jquery object shortcut, and 
		    //the polygons that make up the delivery zones. Should have methods to show/hide the map, show/hide the map overlay, 


		    $(document).ready(displayBigMap);
		    $(document).ready(function ( ) {
		    	//$("#getCookiesButton").on("click.locate",locate);
		    	//$("#getCookiesButton").on("click.submitForm",submitGetCookiesForm);
		    });
		    $(document).ready(initializeOrderBox);

		    function drawDeliveryZones ( map ) {
    			var tufts = [new google.maps.LatLng(42.405856,-71.131132),
							new google.maps.LatLng(42.401958,-71.123621),
							new google.maps.LatLng(42.400897,-71.119094),
							new google.maps.LatLng(42.400897,-71.116390),
							new google.maps.LatLng(42.402719,-71.113772),
							new google.maps.LatLng(42.407092,-71.116626),
							new google.maps.LatLng(42.409231,-71.118386),
							new google.maps.LatLng(42.410387,-71.119888),
							new google.maps.LatLng(42.414047,-71.125660)];
    			var boston = [new google.maps.LatLng(42.382323,-71.130724),
							new google.maps.LatLng(42.369357,-71.122742),
							new google.maps.LatLng(42.353406,-71.137247),
							new google.maps.LatLng(42.331488,-71.117291),
							new google.maps.LatLng(42.328759,-71.110640),
							new google.maps.LatLng(42.324857,-71.098280),
							new google.maps.LatLng(42.331202,-71.094546),
							new google.maps.LatLng(42.340148,-71.078925),
							new google.maps.LatLng(42.351725,-71.089997),
							new google.maps.LatLng(42.350425,-71.094975),
							new google.maps.LatLng(42.351725,-71.112571),
							new google.maps.LatLng(42.354738,-71.118193),
							new google.maps.LatLng(42.378202,-71.106176),
							new google.maps.LatLng(42.386317,-71.116219)];
				var tuftsZone = new google.maps.Polygon({
					paths: tufts,
					strokeColor: "#569556",
					strokeOpacity: 0.8,
					strokeWeight: 2.0,
					fillColor: "#569556",
					fillOpacity: 0.35
				});
				var bostonZone = new google.maps.Polygon({
					paths: boston,
					strokeColor: "#569556",
					strokeOpacity: 0.8,
					strokeWeight: 2.0,
					fillColor: "#569556",
					fillOpacity: 0.35
				});

				tuftsZone.setMap(map);
				bostonZone.setMap(map);
    		}

    		function submitGetCookiesForm ( ) { 
    			$.ajax({
    				type: "GET",
    				url: "http://getcooki.es/weborder/weborder.php",
    				data: { 
    					address: $("#address").val(),
    					phone: $("#phone").val(),
    					latitude: $("#latitude").val(),
    					longitude: $("#longitude").val()
    				},
    				success: ajaxResponseHandler,
    				error: ajaxErrorHandler
    			});

    		}

    		function ajaxResponseHandler( response ) {
    			if(response.sent) {
    				$("#ajax_overlay").css('background-color','green');
    				$("#ajax_overlay input[type=button]").val("CLOSE");
    				resetForm();
    			} else {
    				$("#ajax_overlay").css('background-color','red');
    				$("#ajax_overlay input[type=button]").val("TRY AGAIN");
    			}
    			var date = new Date(response.time*1000);
    			$("#ajax_overlay p").text(response.message+' '+date);
    			$("#ajax_overlay").show();

    			
    		}

    		function ajaxErrorHandler ( response ) {
    			$("#ajax_overlay").css('background-color','red');
    			$("#ajax_overlay input[type=button]").val("TRY AGAIN");
    			$("#ajax_overlay p").text("Sorry, there was an error! Please text us at 424-241-2825 to order!");
    			$("#ajax_overlay").show();
    		}

    		function hideAjaxOverlay() {
    			$("#ajax_overlay").hide();
    		}

    		function resetForm (  ) {
    			$("#address").css("background-color","white");
    			$("#address").val("");
    			$("#phone").css("background-color","white");
    			$("#phone").val("");
    			resetGetCookiesButton();
    		}

    		function resetGetCookiesButton (  ) {
    			$("#getCookiesButton").on("click.locate",locate);
    			$("#getCookiesButton").off("click.submitForm");
    			$("#getCookiesButton").val("CONFIRM");
    			$("#address").css("background-color","white");
    			$("#address").off("change.address");
    			$("#address").off("keypress.address");
    		}

    		//$(document).ready(initialize);

    		function locate ( ) {
		    	var address = $('#address').val();
		    	$("#infobox_overlay").show();
		    	$("#map_overlay").show();
    			initialize();
    			if (address) {
    				geocodeAddress(address);
    			} else {
    				getLatLngGPS();
    			}
    			$("#address").on("change.address",resetGetCookiesButton);
    			$("#address").on("keypress.address",resetGetCookiesButton);
    		}

    		

    		function centerMap ( latLng ) {
    			if(marker) {
    				marker.position = latLng;
    			}
    			else {
    				marker = new google.maps.Marker({
				    	position: latLng,
				    	title:"BRING COOKIES HERE"
					});
    			}

				// To add the marker to the map, call setMap();
				marker.setMap(map);
    			map.setCenter(latLng);   			
    		}


		    function hideMap ( ) {
		    	$("#infobox_overlay").hide();
		    	$("#map_overlay").hide();
		    }

		    function geocodeAddress( address ) {
		    	var geocoderRequest = {
			    	address: address
			    };
			    var geocoder = new google.maps.Geocoder();
			    //setLatLng(result.geometry.location.latitude,result.geometry.location.longitude)
			    geocoder.geocode(geocoderRequest, function(result) {
			    	setLatLng(result[0].geometry.location.lat(),result[0].geometry.location.lng());
			    	centerMap(getLatLng());
			    });
		    }

		    function acceptLocation() {
		    	hideMap();
		    	$("#address").css("background-color","green");
		    	$("#getCookiesButton").val("GET COOKIES!");
		    	$("#addressVerified").val("true");
		    	$("#getCookiesButton").off("click.locate");
    			$("#getCookiesButton").on("click.submitForm",submitGetCookiesForm);
    			$("#address").on("change.address",resetGetCookiesButton);
    			$("#address").on("keypress.address",resetGetCookiesButton);

		    }

		    function rejectLocation() {
		    	$("#address").focus();
		    	hideMap();
    			resetGetCookiesButton();
		    }

		    function getLatLngGPS ( ) {
		    	if (navigator.geolocation) 
			    {
			        navigator.geolocation.getCurrentPosition( focusLatLng );
			    }
		    }

		    function focusLatLng( position ) {
		    	setLatLng( position.coords.latitude, position.coords.longitude );
		    	centerMap(getLatLng());
		    	var geocoderRequest = {
			    	location: getLatLng()
			    };
			    var geocoder = new google.maps.Geocoder();
			    //setLatLng(result.geometry.location.latitude,result.geometry.location.longitude)
			    geocoder.geocode(geocoderRequest, function(result) {
			    	$("#address").val(result[0].formatted_address);
			    });
		    }

		    function setLatLng ( latitude, longitude ) {
		    	document.getElementById("latitude").value = latitude;
			    document.getElementById("longitude").value = longitude;
		    }

		    function getLatLng ( lat, lng ) { 
		    	if( lat && lng ) {
		    		return new google.maps.LatLng(lat,lng);
		    	}
		    	return new google.maps.LatLng($("#latitude").val(),$("#longitude").val());
		    }

		    function initializeOrderBox ( ) {
		    	checkIfOpen();
		    	intervalID = setInterval(checkIfOpen,60000);
		    }

		    function checkIfOpen ( ) {
		    	$.ajax({
    				type: "GET",
    				url: "http://getcooki.es/weborder/areweopen.php",
    				success: checkIfOpenHandler
    			});
		    }

		    function checkIfOpenHandler ( response ) {
		    	if(response.currentlyOpen) {
			    	$("#status_indicator").css("background-color","green");
			    	$("#status_indicator").text("DELIVERY OPEN");
			    	$("#getCookiesButton").on("click.locate",locate);
			    	$("#getCookiesButton").val("CONFIRM");  	
			    	$("#address").removeAttr("disabled");
			    	$("#phone").removeAttr("disabled");
			    } else {
			    	$("#status_indicator").css("background-color","red");
			    	$("#status_indicator").text("DELIVERY CLOSED");
			    	$("#getCookiesButton").off("click.locate");
			    	$("#getCookiesButton").val("CLOSED");
			    	$("#address").attr("disabled","disabled");
			    	$("#phone").attr("disabled","disabled");
			    }
		    }
    	</script>
		<!-- wordpress head functions -->
		<?php wp_head(); ?>
		<!-- end of wordpress head -->

		<!-- drop Google Analytics Here -->
		<!-- end analytics -->

	</head>

	<body <?php body_class(); ?> onload="initialize();">

		<div id="container">

			<header class="header" role="banner">

				<div id="inner-header" class="clearfix">

					<!-- to use a image just replace the bloginfo('name') with your img src and remove the surrounding <p> -->
					<p id="logo" class="wrap h1"><a href="<?php echo home_url(); ?>" rel="nofollow"><?php bloginfo('name'); ?></a></p>

					<nav role="navigation">
						<?php bones_main_nav(); ?>
					</nav>

				</div> <!-- end #inner-header -->

				<div id="intro" class="site-intro wrap clearfix">
					<div class="site-description">
    <div id="sweetIdeaInfo" class="sixcol widget_header">
    	<h4>LATE-NIGHT COOKIE DELIVERY</h4>
    	<div class="information">
    		<div class="days">
    			<h5>THURSDAY</h5>
    			<h5>FRIDAY</h5>
    			<h5>SATURDAY</h5>
    		</div>
    		<div class="hours">
		    	<h5>10PM-3AM</h5>
		    	<h5>10PM-3AM</h5>
		    	<h5>10PM-3AM</h5>
		    </div>
    	<h4>TEXT 424-241-2825</h4>
    	</div>
    	<div id="maplink">
    		<a href="http://getcooki.es/delivery-zones"><img src="http://maps.googleapis.com/maps/api/staticmap?center=42.372202,-71.118193&zoom=13&size=100x100&sensor=true"></a>
    	</div>
    </div>
    <div id="infobox" class="sixcol widget_header" style="margin-left: 10px;">
    	<div id="map_overlay" class="overlay"></div>
    	<div id="mapToolbar" class="overlay">
    		<h3 style="line-height: 0;">Is this right?</h3>
    		<input onclick="acceptLocation();" type="button" class="greenButton" value="YUP!"><BR>
    		<input onclick="rejectLocation();" type="button" class="greenButton" value="NOPE!">
    	</div>
    	<div id="ajax_overlay" class="overlay">
    		<p></p>
    		<input class="greenButton" onclick="hideAjaxOverlay();" type="button" value="TRY AGAIN">
    	</div>
    	<div id="getcookies" class="sixcol" style="margin-left: 0px;width: 100%;">
    	<h4 style="display: inline-block;">GET COOKIES</h4>
    	<div id="status_indicator" style="float: right;display: inline-block;">DELIVERY CLOSED</div>
    	<form id="weborder" method="POST" action="http://getcooki.es/weborder/weborder.php">
		<input type="text" placeholder="Street address and school/city" id="address" name="address"><!--<input id="locateButton" onclick="locate();" class="greenButton" style="width: 29%; margin-left: 4px;" type="button" value="CONFIRM"></input>-->
		<input type="hidden" id="latitude" name="latitude">
		<input type="hidden" id="longitude" name="longitude">
		<input type="hidden" id="addressVerified" name="addressVerified">
    		<div style="width: 100%;text-align: center;">
    			<input type="text" placeholder="Your phone #" id="phone" name="phone"><input class="greenButton" id="getCookiesButton" type="button" value="CONFIRM">
    			
    		
    	</div></form>
    </div>
    
    </div>
    
    </div>
</div>
				</div>

			</header> <!-- end header -->
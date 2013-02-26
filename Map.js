var Map = function ( id, mapOptions ) {
    this.id = id;
    this.el = '';
    this.map = '';
    this.mapOptions = mapOptions;
} 

Map.prototype.draw = function ( ) {
	this.el = $("#"+this.id).get(0);
	var mapOptions = this.mapOptions;
	if(mapOptions) {
    } else {
      mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(42.405856,-71.131132),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };  
    }
    this.map = new google.maps.Map(this.el, mapOptions);
    this.deliveryZones = { };
    this.marker =  new google.maps.Marker({
      position: new google.maps.LatLng(42.372202,-71.118193),
      map: this.map
    });
    this.drawDeliveryZones();

    var clickMap = function ( e ) {
                var marker = new google.maps.Marker({
                  position: e.latLng,
                  map: this.map
                });
    }
    
    //set up event listeners
    /*var that = this;
    google.maps.event.addListener(this.map, 'click', function(e){ that.click(e); } );
    google.maps.event.addListener(this.deliveryZones.tufts, 'click', function(e){ that.click(e); } );
    google.maps.event.addListener(this.deliveryZones.frankenblob, 'click', function(e){ that.click(e); });*/
}

Map.prototype.isInitialized = function ( ) {
	if(this.map)
		return true;
	return false;
}

Map.prototype.placeMarker = function ( latLng, title ) {
	if(!this.isInitialized())
		return;
	var marker = new google.maps.Marker({
	    position: latLng,
	    title: title
	});
      
    marker.setMap(this.map);
    return marker;
}

Map.prototype.moveMarker = function ( latLng ) {
	if(!this.isInitialized())
		return;
	this.marker.position = latLng;
	this.marker.setMap(this.map);
	return this.marker;
}

Map.prototype.setCenter = function ( latLng ) {
	if(!this.isInitialized())
		return;
	this.map.setCenter(latLng);
}

Map.prototype.containsLocation = function ( latLng ) {
	for ( var zone in this.deliveryZones ) {
		if (google.maps.geometry.poly.containsLocation(latLng,this.deliveryZones[zone]) )
			return true;
	}
	return false;
}

Map.prototype.updateMarkerAddress = function ( callback ) {
	var geocoderRequest = {
		location: this.marker.getPosition()
	}
	var geocoder = new google.maps.Geocoder();
	that = this;
	geocoder.geocode(geocoderRequest,function(result){address=result[0].formatted_address;$.proxy(callback(address),that);});
}

Map.prototype.setMarkerAddress = function ( address ) {
	this.marker.address = address;
	console.log(this.marker.address);
}

Map.prototype.getMarkerLatLng = function ( ) {
	return this.marker.getPosition();
}

Map.prototype.click = function ( e ) {
    if ( this.containsLocation(e.latLng) ) {
    	this.moveMarker(this.marker,e.latLng);
        //this.updateMarkerAddress(this.setMarkerAddress);
    } else {
        //alert("we don't deliver there, hombre");
    }
}

Map.prototype.drawDeliveryZones = function ( ) {
	var tufts = [new google.maps.LatLng(42.405856,-71.131132),
	    new google.maps.LatLng(42.401958,-71.123621),
	    new google.maps.LatLng(42.400897,-71.119094),
	    new google.maps.LatLng(42.400897,-71.116390),
	    new google.maps.LatLng(42.402719,-71.113772),
	    new google.maps.LatLng(42.407092,-71.116626),
	    new google.maps.LatLng(42.409231,-71.118386),
	    new google.maps.LatLng(42.410387,-71.119888),
	    new google.maps.LatLng(42.414047,-71.125660)];
	var frankenblob = [new google.maps.LatLng(42.382323,-71.130724),
	    new google.maps.LatLng(42.369357,-71.122742),
	    new google.maps.LatLng(42.368564,-71.116991), 
	    new google.maps.LatLng(42.353977,-71.116498),
	    new google.maps.LatLng(42.356086,-71.131389), // Cambridge and Linden
	    new google.maps.LatLng(42.353557,-71.137408),
	    new google.maps.LatLng(42.340973,-71.125789),
	    new google.maps.LatLng(42.346429,-71.105318),
	    new google.maps.LatLng(42.331868,-71.113386),
	    new google.maps.LatLng(42.328759,-71.110640),
	    new google.maps.LatLng(42.324857,-71.098280),
	    new google.maps.LatLng(42.331202,-71.094546),
	    new google.maps.LatLng(42.340148,-71.078925),
	    new google.maps.LatLng(42.351725,-71.089997),
	    new google.maps.LatLng(42.361652,-71.079655),
	    new google.maps.LatLng(42.365671,-71.091033), // Hampshire and Broadway
	    new google.maps.LatLng(42.386317,-71.116219)];
	this.deliveryZones.tufts = new google.maps.Polygon({
		paths: tufts,
		strokeColor: "#569556",
		strokeOpacity: 0.8,
		strokeWeight: 2.0,
		fillColor: "#569556",
		fillOpacity: 0.35
	});
	this.deliveryZones.frankenblob = new google.maps.Polygon({
		paths: frankenblob,
		strokeColor: "#569556",
		strokeOpacity: 0.8,
		strokeWeight: 2.0,
		fillColor: "#569556",
		fillOpacity: 0.35
	});
	this.deliveryZones.tufts.setMap(this.map);
	this.deliveryZones.frankenblob.setMap(this.map);
}
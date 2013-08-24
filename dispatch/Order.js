var Order = function ( selector, uid, phoneNumber, timestamp, status, dispatchGrid ) {
	this.$ = $(selector);
	this.lat = '';
	this.lng = '';
	this.uid = uid;
	this.lastActivityTimestamp = timestamp;
	this.phoneNumber = phoneNumber;
	this.status = status;
	this.orderCreatedTimestamp = '';
	this.orderDispatchedTimestamp = '';
	this.orderDeliveredTimestamp = '';
	this.map = new Map();
	this.texter = new Texter(this.$,this.phoneNumber);
	this.dispatchGrid = dispatchGrid;
}

Order.prototype.geocodeAddress = function ( address ) {
    if(!address)
        return;
    var swBound = new google.maps.LatLng(42.321240,-71.130810);
    var neBound = new google.maps.LatLng(42.420415,-71.077251);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var geocoderRequest = {
        address: address,
        bounds: bounds
    };
    var geocoder = new google.maps.Geocoder();
    that = this;
    geocoder.geocode(geocoderRequest, function(result) {
        var latLng = new google.maps.LatLng(result[0].geometry.location.lat(),result[0].geometry.location.lng());
        that.lat = result[0].geometry.location.lat();
        that.lng = result[0].geometry.location.lng();
        that.map.setCenter(latLng);
        that.map.moveMarker(latLng);
    });
}

Order.prototype.draw = function ( ) {
	//initialize all divs individually
	var orderView = $("<div class='orderView'></div>");
	var orderSummary = $("<div class='orderViewRow orderSummary'></div>");
	orderSummary.append("<div class='phone'>"+this.phoneNumber+"</div>");
	orderSummary.append("<div class='timestamp'>"+this.lastActivityTimestamp+"</div>");
	var commSummary = $("<div class='orderViewRow commSummary'></div>");
	commSummary.append("<div class='informationDisplay'>FILLER</div>");
	commSummary.append("<div class='status'>"+this.status+"</div>");
	var texterPanel = $("<div class='orderViewRow texter closedPanel'></div>");
	var mapPanel = $("<div class='orderViewRow map closedPanel' id='map'></div>");
	var detailsPanel = $("<div class='orderViewRow details closedPanel'></div>");

	orderSummary.on('click',this.toggleDetails);
	commSummary.on('click',this.toggleTexter);

	orderView.append(orderSummary);
	orderView.append(commSummary);
	orderView.append(texterPanel);
	orderView.append(mapPanel);
	orderView.append(detailsPanel);

	this.$.append(orderView);

	this.texter.$.on('addressSaved',$.proxy(function(e,savedAddress){this.geocodeAddress(savedAddress);},this));
	this.displayGrid.$.on('orderDispatched',$.proxy(function(){},this));
}

Order.prototype.update = function ( data ) {

}

Order.prototype.toggleMap = function ( ) {
	this.togglePanel("map");
}

Order.prototype.toggleDetails = function ( ) {
	this.togglePanel("details");
}

Order.prototype.toggleTexter = function ( ) {
	this.togglePanel("texter");
}

Order.prototype.togglePanel = function ( panelClass ) {
	if(!panelClass)
		return console.log("panelClass undefined in Order.togglePanel");
	var panel = this.$.find(".orderViewRow."+panelClass);
	if(!panel)
		return console.log("panel not found.");
	if(panel.hasClass("closedPanel"))
		panel.removeClass("closedPanel"); //show the panel
	else
		panel.addClass("closedPanel"); //hide the panel
}
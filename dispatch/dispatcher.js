var Dispatcher = function ( selector ) {
    this.$ = $(selector);
    this.initialize(); 
}

Dispatcher.prototype.draw = function ( ) {
    this.$.append("<h1>Dispatcher</h1>");
    this.console = $("<div class='console'>Hello</div>");
    this.$.append(this.console);
    this.console.hide();
    var inputContainer = $("<div class='inputContainer'></div>");
    inputContainer.append("<input type='text' id='phone' placeholder='Phone #' tabindex='1'></input>");
    inputContainer.append("<input type='text' id='address' placeholder='Address' tabindex='2'></input>");
    inputContainer.append("<input type='text' id='comments' placeholder='Comments' tabindex='3'></input>");
    inputContainer.append("<input type='text' id='offercode' placeholder='Offer code' tabindex='4'></input>");
    inputContainer.append("<input type='text' id='shortlink' placeholder='Short link' tabindex='5'></input>");
    var customerContainer = $("<div class='customerWidget'></div>");

    this.$.append(inputContainer);
    this.$.append(customerContainer);

    this.customerWidget = new CustomerWidget(".customerWidget");
    this.customerWidget.orderListWidget.on("clickOrder",$.proxy(function(evt,address){this.$.find("#address").val(address); console.log(address); this.$.find("#address").blur();},this));
    this.$.append("<div id='map'></div>");
    
    this.$.append("<h1>Select Campus</h1>");
    this.$.append("<div id='campusGrid' tabindex='4'></div>");
    this.$.append("<div class='controls'><input type='button' value='SUBMIT' tabindex='5'></input></div>");

    this.$.find("#phone").on('keypress',$.proxy(function(e){if(e.keyCode==13){this.customerWidget.loadUser(this.$.find("#phone").val()); this.$.find("#address").focus();}},this));
    this.$.find("#phone").on('blur',$.proxy(function(){this.customerWidget.loadUser(this.$.find("#phone").val())},this));
    this.$.find("#address").on('keypress',$.proxy(function(e){if(e.keyCode==13){this.geocodeAddress(this.$.find("#address").val()); this.$.find("#comments").focus();}},this));
    this.$.find("#address").on("blur",$.proxy(function(){this.geocodeAddress(this.$.find("#address").val())},this));
    this.$.find("#shortlink").on('click',$.proxy(function(){this.$.find("#shortlink").toggleClass("off");},this));
    this.$.find(".controls input[type='button']").on("click",$.proxy(function(){this.dispatchOrder()},this));

    var that = this;
    this.map.draw();
    this.$.find("#map").on("click",function(){that.$.find("#shortlink").focus();});
    this.campusGrid.draw();
    this.campusGrid.on('keydown',function(e){if(e.keyCode==13) that.dispatchOrder();});
}


Dispatcher.prototype.drawShortlink = function ( ) {
    //draw shortlink controls. Shortlink field should be disabled. 
    //Shortlink field needs a click event to select all the text in the box
    //Shortlink should have a toggle for do not send that doesnt reset along with other form elements


    //ALTERNATE IDEA
    //have an on/off switch on each tile for the short link so you can set it per runner
}

Dispatcher.prototype.geocodeAddress = function ( address ) {
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
        that.shortenLink(latLng.lat(),latLng.lng());
    });
}


Dispatcher.prototype.clearForm = function ( ) {
    this.$.find("#address").val("");
    this.$.find("#phone").val("");
    this.$.find("#shortlink").val("");
    this.$.find("#comments").val("");
    this.campusGrid.unselectAll();
    this.$.find("#phone").focus();
}

Dispatcher.prototype.shortenLink = function ( lat, lng ) {
    
    var longLink = "https://maps.google.com/maps?q=loc:"+lat+","+lng+"&z=16";
    $.ajax({
        type: "POST",
        url: "http://getcooki.es/u/yourls-api.php",
        data: { 
            signature: "44e631ccb7",
            action: "shorturl",
            url: longLink,
            format: "json"
        },
        success: function ( response ) { $("#shortlink").val(response.shorturl); },
        error: function (response ) { console.log(response) }
    });
}

Dispatcher.prototype.dispatchOrder = function ( ) {
    var that = this;
    var _console = function ( message ) { 
        that.displayAlert(message);
    }
    var _clearForm = function ( ) {
        that.clearForm();
    }
    var shortCheck = !this.$.find("#shortlink").hasClass('off');
    shorty = '';
    if ( shortCheck ) {
        shorty = $("#shortlink").val();
    }
    $.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/dispatchOrder.php",
        data: { 
            campus: this.campusGrid.getCampus(),
            address: $("#address").val(),
            phone: $("#phone").val(),
            lat: this.lat,
            lng: this.lng,
            shortlink: shorty,
            comments: $("#comments").val()
        },
        success: function ( response ) { console.log(response); _console("Order sent."); _clearForm(); },
        error: function ( ) { _console("Order NOT sent."); }
    });
}

Dispatcher.prototype.initialize = function ( ) {
    var that = this;
    var _initializeGrid = function ( result ) {
        tiles = [];
        for( var zone in result ) {
            var zone = result[zone]; //eventually use zone.runnerID as well as other attr
            tiles.push(new DispatchTile(zone.zoneId,zone.zoneName,zone.shortName));
        }
        that.campusGrid = new DispatchTileGrid("#campusGrid","",tiles);
    };
    var _initialize = function ( ) {
        that.map = new Map("map");
        that.draw();
    };
    

    $.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/getZoneAssignments.php",
        success: function ( response ) { _initializeGrid(response); _initialize(); },
        error: function ( ) { alert("Order not placed") }
    });
}

Dispatcher.prototype.displayAlert = function ( message ) {
    var that = this;
    var _hide = function ( ) {
        that.console.hide();
    }
    this.console.show();
    this.console.html(message);
    window.setTimeout(_hide,3000);
}

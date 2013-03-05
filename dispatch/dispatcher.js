var DispatchTile = function ( id, name, description, image ) {
    this.idPrefix = 'zone';
    this.id = this.idPrefix+''+id;
    this.campusId = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.selected = false;
    this.$ = '';
}

DispatchTile.prototype.unselect = function ( ) {
    if (this.selected) {
        this.selected = false;
        this.$.removeClass("selected");
    }
}

DispatchTile.prototype.toggleSelected = function ( ) {
    this.selected = !this.selected;
    if(this.selected)
        this.$.addClass("selected");
    else
        this.$.removeClass("selected");
}

DispatchTile.prototype.draw = function ( ) {
    tile = $("<div id='"+this.id+"' class='tile'></div>");
    this.$ = tile;
    var content = $("<div class='content'></div>");
    content.append("<div class='title'>"+this.name+"</div>");
    content.append("<div class='description'>"+this.description+"</div>");
    this.$.append(content);
    return tile;
}

function DispatchTileGrid ( selector, headerText, tiles ) { 
    this.$ = $(selector);
    this.cols = 2;
    this.headerText = headerText;
    if (tiles)
        this.tiles = tiles;
    else
        this.tiles = [];
}

DispatchTileGrid.prototype.draw = function ( ) {
    this.$.html("");
    var layout = $("<div class='tileLayout'></div>");
    //Draw the header text
    layout.append("<h1>"+this.headerText+"</h1>");
    /**Draw the tile matrix*/
    for ( var i = 0; i < Math.ceil(this.tiles.length/2); i++ ) {
        var row = $("<div class='tileRow'></div>");
        for ( var j = 0; j < this.cols; j++ ) {
            tile = this.tiles[(i*this.cols)+j];
            if(tile) {
                var tileDiv = tile.draw();
                tileDiv.on('click',$.proxy(function(){this.getSelected(event);},this));
                row.append(tileDiv);
            }
        }
        layout.append(row);
    }    
    this.$.append(layout);
    
  
}

DispatchTileGrid.prototype.getSelected = function ( e ) {
    var targetId = e.currentTarget.id;
    for(var tile in this.tiles) {
        tile = this.tiles[tile];
        if(targetId == tile.id ) {
            tile.toggleSelected();
        } else {
            tile.unselect();
        }
    }
}

DispatchTileGrid.prototype.getCampus = function ( ) {
    for(var tile in this.tiles) {
        tile = this.tiles[tile];
        if(tile.selected)
            return tile.campusId;
    }
}

DispatchTileGrid.prototype.unselectAll = function ( ) {
    for(var tile in this.tiles) {
        tile = this.tiles[tile];
        tile.unselect();
    }
}

var Dispatcher = function ( ) {
    this.map = new Map("map");

    this.initialize(); 
   
    $("#address").on('keypress',$.proxy(function(e){if(e.keyCode==13){this.geocodeAddress($("#address").val()); $("#comments").focus();}},this));

    $("#address").on("blur",$.proxy(function(){this.geocodeAddress($("#address").val())},this));
    $("#map").on("click",function(){$("#address").blur();});
    $(".controls input[type='button']").on("click",$.proxy(function(){this.dispatchOrder()},this));
}

Dispatcher.prototype.draw = function ( ) {
    this.map.draw();
    this.campusGrid.draw();

}

Dispatcher.prototype.geocodeAddress = function ( address ) {
    if(!address)
        return;
    var geocoderRequest = {
        address: address
    };
    var geocoder = new google.maps.Geocoder();
    that = this;
    geocoder.geocode(geocoderRequest, function(result) {
        var latLng = new google.maps.LatLng(result[0].geometry.location.lat(),result[0].geometry.location.lng());
        that.map.setCenter(latLng);
        that.map.moveMarker(latLng);
        that.shortenLink(latLng.lat(),latLng.lng());
    });
}


Dispatcher.prototype.clearForm = function ( ) {
    $("#address").val("");
    $("#phone").val("");
    $("#shortlink").val("");
    $("#comments").val("");
    this.campusGrid.unselectAll();
    $("#phone").focus();
}

/*Dispatcher.prototype.shortenLink = function ( lat, lng ) {
    $.ajax({
        type: "POST",
        url: "http://getcooki.es/weborder/linkShortener.php",
        data: { 
            latitude: lat,
            longitude: lng
        },
        success: function ( response ) { $("#shortlink").val(response.id); },
        error: function (response ) { console.log(response) }
    });
} */

Dispatcher.prototype.shortenLink = function ( lat, lng ) {
    
    var longLink = "https://maps.google.com/maps?q=loc:"+lat+","+lng;
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
    var _clearForm = function ( ) {
        that.clearForm();
    }

    $.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/dispatchOrder.php",
        data: { 
            campus: this.campusGrid.getCampus(),
            address: $("#address").val(),
            phone: $("#phone").val(),
            shortlink: $("#shortlink").val(),
            comments: $("#comments").val()
        },
        success: function ( response ) { $("#result").text(response); _clearForm(); },
        error: function ( ) { alert("FUCK SOMETHING WENT WRONG") }
    });
}

Dispatcher.prototype.initialize = function ( ) {
    var that = this;
    var _initializeTiles = function ( result ) {
        that.tiles = [];
        for( var zone in result ) {
            var zone = result[zone]; //eventually use zone.runnerID as well as other attr
            that.tiles.push(new DispatchTile(zone.zoneId,zone.zoneName,zone.shortName));
        }
    };
    

    $.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/getZoneAssignments.php",
        success: function ( response ) { _initializeTiles(response); that.campusGrid = new DispatchTileGrid("#campusGrid","",that.tiles); that.draw();},
        error: function ( ) { alert("Order not placed") }
    });
}

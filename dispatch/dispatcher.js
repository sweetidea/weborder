var DispatchTile = function ( id, name, description, image ) {
    this.id = id;
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
            return tile.id;
    }
}

var Dispatcher = function ( ) {
    this.map = new Map("map");
    
    var tiles = [];
    tiles.push(new DispatchTile("Tufts","Tufts","Julia"));
    tiles.push(new DispatchTile("NU","Northeastern","Gino"));
    tiles.push(new DispatchTile("BU","BU","DJ"));
    tiles.push(new DispatchTile("MIT","Harvard/MIT","John"));
    
    this.campusGrid = new DispatchTileGrid("#campusGrid","",tiles);

    $("#address").on("blur",$.proxy(function(){this.geocodeAddress($("#address").val())},this));
    $("#map").on("click",function(){$("#address").blur();});
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

Dispatcher.prototype.shortenLink = function ( lat, lng ) {
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
}

Dispatcher.prototype.dispatchOrder = function ( ) {
    $.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/dispatchOrder.php",
        data: { 
            campus: this.campusGrid.getCampus(),
            address: $("#address").val(),
            phone: $("#phone").val(),
            shortlink: $("#shortlink").val()
        },
        success: function ( response ) { $("#result").text(response) },
        error: function ( ) { alert("Order not placed") }
    });
}
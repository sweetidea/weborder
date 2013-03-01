var Tile = function ( id, name, description, image ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.$ = '';
}

Tile.prototype.clicker = function ( ) {
    if(this.$){
        var inputEl = this.$.find("input")[0];
        /*var val = parseInt(inputEl.value);
        if(isNaN(val))
            val = 0;
        val += 1;
        inputEl.value = val;*/
        inputEl.focus();
    }
}

Tile.prototype.draw = function ( ) {
    tile = $("<div id='"+this.id+"' class='tile'></div>");
    this.$ = tile;
    var content = $("<div class='content'></div>");
    content.append("<div class='title'>"+this.name+"</div>");
    content.append("<div class='description'>"+this.description+"</div>");
    content.on('click',$.proxy(function(){this.clicker();},this));
    this.$.append(content);
    this.$.append("<input type='text' value=''></input>");
    return tile;
}

Tile.prototype.getQty = function ( ) { 
    return parseInt(this.$.find("input[type='text']").val(),10);
}

//var MailOrderCart

//var ByTheBoxCart()

function TileGrid ( selector, headerText, tiles ) { 
    this.$ = $(selector);
    this.cols = 2;
    this.headerText = headerText;
    if (tiles)
        this.tiles = tiles;
    else
        this.tiles = [];
}

TileGrid.prototype.draw = function ( ) {
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
                tileDiv.on('click',$.proxy(function(){this.getPrice();},this));
                tileDiv.find('input').on('change',$.proxy(function(){this.getPrice();},this));
                row.append(tileDiv);
            }
        }
        layout.append(row);
    }    
    this.$.append(layout);
    
    //Draw controls
    this.$.append("<div class='controls'><input type='button' value='SUBMIT'></input></div>");

    //Add control listeners
    that = this;
    var x = this.$.find(".controls input[type='button']");
    this.$.find(".controls input[type='button']").on('click',function(){that.saveOrder();});
}

TileGrid.prototype.getProductManifest = function ( ) {
    var manifest = {};
    for(var tile in this.tiles) {
        var qty = this.tiles[tile].getQty();
        if(qty>0)
            manifest[this.tiles[tile].id] = qty;
    } 
    return manifest;
}


TileGrid.prototype.saveOrder = function ( ) {
    $.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/doughProduction.php",
        data: { 
            productManifest: this.getProductManifest()
        },
        success: function ( response ) { $("#result").text(response) },
        error: function ( ) { alert("Order not placed") }
    });
}
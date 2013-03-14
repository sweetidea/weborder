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
    this.cols = 4;
    this.selector = selector;
    this.headerText = headerText;
    if (tiles)
        this.tiles = tiles;
    else
        this.tiles = [];
}

DispatchTileGrid.prototype.draw = function ( ) {
    this.$ = $(this.selector);
    var that = this;
    var keydownListener = function ( keyCode ) {
        if(keyCode!=39&&keyCode!=37)
            return;
        var tileId = that.getCampus();
        if(tileId)
            tileId = tileId - 1;
        else 
            tileId = -1;
        if(keyCode==39) //right
            tileId = (tileId+1)%that.tiles.length;
        if(keyCode==37)//left
            tileId = (tileId-1)%that.tiles.length;
        if(tileId<0)
            tileId = that.tiles.length-1;
        that.selectTile(tileId+1);
    }
    var gridFocus = function ( ){
        that.$.find(".tileLayout").addClass("tileLayoutSelected");
        if(!that.getCampus()) {
        //    that.selectTile(1);
        }
    }
    this.$.html("");
    
    var layout = $("<div class='tileLayout'></div>");
    //Draw the header text
    if(this.headerText)
        layout.append("<h1>"+this.headerText+"</h1>");
    /**Draw the tile matrix*/
    for ( var i = 0; i < Math.ceil(this.tiles.length/2); i++ ) {
        var row = $("<div class='tileRow'></div>");
        for ( var j = 0; j < this.cols; j++ ) {
            tile = this.tiles[(i*this.cols)+j];
            if(tile) {
                var tileDiv = tile.draw();
                tileDiv.on('click',$.proxy(function(){event.stopPropagation(); this.getSelected(event);},this));
                row.append(tileDiv);
            }
        }
        layout.append(row);
    }    
    this.$.append(layout);
    
    this.$.on('click',$.proxy(function(e){this.$.focus();},this));
    this.$.on('focus',$.proxy(function(e){gridFocus();},this));
    this.$.on('blur',$.proxy(function(e){this.$.find(".tileLayout").removeClass("tileLayoutSelected");},this));
    this.$.on('keydown',function(e){keydownListener(e.keyCode);});
}

DispatchTileGrid.prototype.selectTile = function ( tileId ) {
    var prefix = "";
    for(var tile in this.tiles) {
        tile = this.tiles[tile];
        if(parseInt(tileId)>=0) 
            prefix = tile.idPrefix;
        if(prefix+''+tileId == tile.id ) {
            tile.toggleSelected();
        } else {
            tile.unselect();
        }
    }
}

DispatchTileGrid.prototype.getSelected = function ( e ) {
    var targetId = e.currentTarget.id;
    this.selectTile(targetId);
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

DispatchTileGrid.prototype.on = function ( e, func ) {
    if(this.$) {
        return this.$.on(e,func);
    }
    return false;
}
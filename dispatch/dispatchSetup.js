var DispatchTile = function ( id, name, description, runnerList ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.runnerList = runnerList || [];
    this.$ = '';
}

DispatchTile.prototype.draw = function ( ) {
    tile = $("<div id='"+this.id+"' class='tile'></div>");
    this.$ = tile;
    var content = $("<div class='content'></div>");
    content.append("<div class='title'>"+this.name+"</div>");
    var dropdownWrapper = $("<div class='description'></div>");
    dropdownWrapper.append(this.buildRunnerDropdown(this.id));
    content.append(dropdownWrapper);    
    this.$.append(content);
    return tile;
}

DispatchTile.prototype.buildRunnerDropdown = function ( tileId ) {
    var dropdown = $("<select id='"+tileId+"'></select>");
    for(var i = 0; i < this.runnerList.length; i++ ) {
        var option = $("<option value='"+this.runnerList[i].id+"'>"+this.runnerList[i].shortName+"</option>");
        dropdown.append(option);
    }
    return dropdown;
}

DispatchTile.prototype.getAssignment = function ( ) {
    return this.$.find("select").val();
}

function DispatchTileGrid ( selector, headerText ) { 
    this.$ = $(selector);
    this.cols = 2;
    this.headerText = headerText;
    this.initialize();
}

DispatchTileGrid.prototype.createTiles = function ( runnerList ) {
    var tiles = [];
    tiles.push(new DispatchTile("1","Tufts","Julia",runnerList));
    tiles.push(new DispatchTile("2","Northeastern","Gino",runnerList));
    tiles.push(new DispatchTile("3","BU","DJ",runnerList));
    tiles.push(new DispatchTile("4","Harvard/MIT","John",runnerList));
    this.tiles = tiles;
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
                //tileDiv.on('click',$.proxy(function(){this.getSelected(event);},this));
                row.append(tileDiv);
            }
        }
        layout.append(row);
    }    
    this.$.append(layout);
    this.$.append("<div class='controls'><input type='button' value='SUBMIT'></input></div>");

    that = this;
    var x = this.$.find(".controls input[type='button']");

    this.$.find(".controls input[type='button']").on('click',function(){that.saveSchedule();});
    
  
}

DispatchTileGrid.prototype.getScheduleManifest = function ( ) {
    var manifest = {};
    for(var tile in this.tiles) {
        var runnerId = this.tiles[tile].getAssignment();
        manifest[this.tiles[tile].id] = runnerId;
    } 
    return manifest;
}

DispatchTileGrid.prototype.saveSchedule = function ( ) {
    $.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/zoneAssignment.php",
        data: { 
            scheduleManifest: this.getScheduleManifest()
        },
        success: function ( response ) { $("#result").text(response) },
        error: function ( ) { alert("Order not placed") }
    });
}

DispatchTileGrid.prototype.initialize = function ( ) {
    that = this;
    $.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/runnerList.php",
        success: function ( response ) { console.log(response); that.createTiles(response); that.draw(); },
        error: function ( ) { alert("Order not placed") }
    });
}

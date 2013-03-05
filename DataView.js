var DataView = function ( selector, table ) {
	this.$ = $(selector);
	if(!this.$)
		return false; //if we're unable to find the container, shut it down
	this.$.addClass("dataView");
	this.table = table; //name of the DB table
	this.schema = []; //array of column titles
	this.data = []; //array of data
	this.loadData();
}

DataView.prototype.draw = function ( ) {
	this.drawSchema();
	this.drawData();
}

DataView.prototype.drawData = function ( ) {
	for ( var dataCounter in this.data ) {
		var data = this.data[dataCounter];
		this.drawDataRow(data);
	}
}

DataView.prototype.drawDataRow = function ( data ) {
	var _drawCell = function ( d, klass ) {
		return $("<div class='cell "+klass+"'>"+d+"</div>");
	}
	var dataRow = $("<div id='"+this.table+""+data[0]+"' class='data'></div>");
	for ( var counter in data ) {
		dataRow.append(_drawCell(data[counter],this.schema[counter]));
	}
	this.$.append(dataRow);
}

DataView.prototype.drawSchema = function ( ) {
	var _drawCell = function ( d, klass ) {
		return $("<div class='cell "+klass+"'>"+d+"</div>");
	}
	var schemaRow = $("<div id='schema' class='schema'></div>");
	for ( var counter in this.schema ) {
		var title = this.schema[counter];
		schemaRow.append(_drawCell(title,this.schema[counter]));
	}
	this.$.append(schemaRow);
}

DataView.prototype.loadData = function ( ) {
	var that = this;
	var _loadData = function ( data ) { //data{ schema: [], data: [] }
		that.schema = data.schema;
		that.data = data.data;
		that.draw();
	};

	$.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dataView.php",
        data: {
        	table: this.table
        },
        success: function ( response ) { _loadData(response); },
        error: function ( ) { alert("Order not placed") }
    });
}
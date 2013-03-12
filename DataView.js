var DataView = function ( selector, table ) {
	this.$ = $(selector);
	if(!this.$)
		return false; //if we're unable to find the container, shut it down
	this.$.addClass("dataView");
	this.table = table; //name of the DB table
	this.schema = []; //array of column titles
	this.data = []; //array of data
	this.loadCustomData();
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
	var _select = function ( element ) { //solution from http://stackoverflow.com/questions/985272/jquery-selecting-text-in-an-element-akin-to-highlighting-with-your-mouse
	    if(!$("#autoselect").prop("checked"))
	    	return false;
	    var doc = document 
	        , text = doc.getElementById(element)
	        , range, selection
	    ;    
	    if (doc.body.createTextRange) {
	        range = document.body.createTextRange();
	        range.moveToElementText(text);
	        range.select();
	    } else if (window.getSelection) {
	        selection = window.getSelection();        
	        range = document.createRange();
	        range.selectNodeContents(text);
	        selection.removeAllRanges();
	        selection.addRange(range);
	    }
	}

	var _drawCell = function ( d, klass ) {
		return $("<td class='cell "+klass+"'>"+d+"</td>");
	}
	var _getDay = function ( d ) {
		switch(d) {
			case 0: return "Sunday"; break;
			case 1: return "Monday"; break;
			case 2: return "Tuesday"; break;
			case 3: return "Wednesday"; break;
			case 4: return "Thursday"; break;
			case 5: return "Friday"; break;
			case 6: return "Saturday"; break;
		}
	}
	var dataRow = $("<tr id='"+this.table+""+data[0]+"' class='data'></tr>");
	var dummyLength = 8;
	var offset = 2*60*60*1000; //server time is 2 hours behind
	var time  = new Date(data[1]).getTime();
	time = new Date(time+offset);
	var hours = time.getHours();
	if(hours==0)
		hours=12;
	var minutes = time.getMinutes();
	if(minutes<10)
		minutes = '0'+minutes;
	var output = "";
	for ( var i = 0; i < dummyLength; i++) {
		switch(i) {
			case 1: output = time.getMonth()+1 + '/'+ time.getDate()+'/'+time.getFullYear(); break;
			case 2: output = _getDay(time.getDay()); break;
			case 3: output = hours+':'+minutes; break;
			case 4: 
			case 5: output = data[i-2]; break;
			case 6: output = ""; break;
			case 7: output = data[4]; break;
			default: output = data[i];
		}
		dataRow.append(_drawCell(output,this.schema[i]));
	}
	/*for ( var counter in data ) {
		dataRow.append(_drawCell(data[counter],this.schema[counter]));
	}*/
	dataRow.on("click",function(){_select(dataRow.attr("id"));});
	this.$.append(dataRow);
}

DataView.prototype.drawSchema = function ( ) {
	var _drawCell = function ( d, klass ) {
		return $("<td class='cell "+klass+"'>"+d+"</td>");
	}
	var schemaRow = $("<tr id='schema' class='schema'></tr>");
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

DataView.prototype.loadCustomData = function ( ) {
	var that = this;
	var _loadData = function ( data ) { //data{ schema: [], data: [] }
		that.schema = ["Number","Date","Night","Time","Zone","Delivery Person","Source","Address"];
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
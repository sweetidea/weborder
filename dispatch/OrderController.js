var OrderController = function ( ) {
	this.orderInstances = {};
	this.lastPollTimestamp = new Date(0);
	this.texterController = new TexterController();
	var that = this;
	this.getTextInterval = window.setInterval(function(){that.getOrders();},5000);
}

OrderController.prototype.addOrder = function ( order ) {
	this.orderInstances[order.uid] = order;
	this.texterController.addTexter(order.texter);
}

OrderController.prototype.removeOrder = function ( order ) {
	this.texterController.removeTexter(order.texter);
	delete this.orderInstances[order.uid];
}

OrderController.prototype.getOrders = function ( ) {
	var that = this;
	$.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/OrderController-getOrders.php",
        data: {
        	orderIDArray: this.getOrderIDArray(),
        	time: this.lastPollTimestamp.getTime()/1000 //divide because we want seconds, not ms
        },
        success: function ( response ) { that.updateOrders(response);  },
        error: function ( ) { console.log("Noooo text not sent"); }
    });
}

OrderController.prototype.updateOrders = function ( orders ) {
	for ( var key in this.orderInstances ) {
		var order = this.orderInstances[key];
		var lastActivity = order.update(orders[key]);
		if (lastActivity>this.lastPollTimestamp) {
			this.lastPollTimestamp = lastActivity;
		}
	}
}

OrderController.prototype.getOrderIDArray = function ( ) {
	var orderIDArray = [];
	for (var key in this.orderInstances) {
	    orderIDArray.push(key);
	}
	return orderIDArray;
}


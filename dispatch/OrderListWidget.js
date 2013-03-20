var OrderListWidget = function ( selector, phone, timestamp, maxOrders ) {
	if(!selector)
		return false;
	this.phone = phone;
	this.timestamp = timestamp;
	this.maxOrders = maxOrders;
	this.selector = selector;
	this.$ = $(this.selector);
}

OrderListWidget.prototype.draw = function ( ) {
	this.$.addClass("orderListWidget");
}

OrderListWidget.prototype.loadOrders = function ( phone, timestamp ) {
	if(phone)
		this.phone = phone;
	if(timestamp)
		this.timestamp = timestamp;
	if(!this.phone)
		return false;
	var _loadOrders = $.proxy(function ( orders ) { 
		this.$.empty();
		for( var orderCount in orders) {
			order = orders[orderCount];
			var row = $("<div id='"+orderCount+"' class='orderRow'><div class='address'>"+order.address+"</div><div class='timestamp'>"+order.timestamp+"</div></div>");
			row.on("click",$.proxy(this.clickOrderEvent,this));
			this.$.append(row);
		}
	},this);

	$.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/Orders.php",
        data: {
        	phoneNumber: this.phone,
        	timestamp: this.timestamp,
        	maxOrders: this.maxOrders
        },
        success: function ( response ) { _loadOrders(response); },
        error: function ( ) { alert("Order not placed") }
    });
}

OrderListWidget.prototype.on = function ( evt, func ) {
	return this.$.on(evt,$.proxy(func,this));
}

OrderListWidget.prototype.clickOrderEvent = function ( evt ) {
	target = $(evt.currentTarget);
	if( target.hasClass("address") ) {

	} else {
		target = target.find(".address");
	}
	console.log(target.text());
	this.$.trigger("clickOrder",[target.text()]);

}
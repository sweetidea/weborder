var CustomerWidget = function ( selector ) {
	if(!selector)
		return false;
	this.phone = "";
	this.selector = selector;
	this.$ = $(this.selector);
	this.user = "";
	this.draw();
}

CustomerWidget.prototype.getPhoneNumber = function ( ) {
	return this.phone;
}

CustomerWidget.prototype.draw = function ( ) {
	var that = this;
	var phoneNumber = $("<div class='phone'></div>");
	var phoneNumberBox = $("<span id='phoneNumberBox'></span>");

	var _getCreditModifier = $.proxy(function ( ) {
		return parseFloat(this.$.find("#creditModifier").val());
	},this);

	var _toggleView = $.proxy(function ( ) {
		this.$.find(".creditContainer").toggle();
		this.$.find(".orderContainer").toggle();
	},this);

	phoneNumber.append(phoneNumberBox);
	this.$.append(phoneNumber);

	var controls = $("<div class='controls'></div>");
	controls.append("<h3>CREDIT</h3><h3>ORDERS</h3>");
	this.$.append(controls);
	controls.find("h3").on('click',_toggleView);

	var creditContainer = $("<div class='creditContainer'></div>")
	creditContainer.append("<div class='credit'>Credit: <span id='value'></span></div>");
	creditContainer.append("<div class='creditControl'><input type='text' id='creditModifier'></input><input type='button' value='ADD' id='add'></input><input type='button' value='SUB' id='sub'></input></div>");
	creditContainer.find("#add").on('click',function(){that.modifyCredit(_getCreditModifier);});
	creditContainer.find("#sub").on('click',function(){that.modifyCredit(_getCreditModifier,true);});
	this.$.append(creditContainer);

	var orderContainer = $("<div class='orderContainer'></div>");
	this.$.append(orderContainer);
	this.orderListWidget = new OrderListWidget(".customerWidget .orderContainer"); //this will potentially fail with multiple customer widgets on the same page. Need to have it go off a unique identifier
	this.orderListWidget.draw();
}

CustomerWidget.prototype.modifyCredit = function ( credit, subtract ) {
	var that = this;

	var _updateCredit = $.proxy(function ( credit ) {
		this.$.find(".credit #value").text(credit);
	},this);

	$.ajax({
        type: "POST",
        url: "http://getcooki.es/weborder/dispatch/modifyCredit.php",
        data: {
        	phoneNumber: that.getPhoneNumber(),
        	credit: credit,
        	subtract: subtract
        },
        success: function ( response ) { _updateCredit(response[0].credit) },
        error: function ( ) { alert("User could not be loaded.") }
    });
}

CustomerWidget.prototype.drawData = function ( user ) {
	if ( user ) {
		this.$.find("#phoneNumberBox").text(user.phone);
		this.$.find(".credit #value").text(user.credit);
	} else {
		this.$.find("#phoneNumberBox").text(this.phone);
		this.$.find(".credit #value").text("User not found.");
	}
}

CustomerWidget.prototype.loadUser = function ( phone ) {
	var that = this;
	var phoneNumber = phone;
	this.phone = phone;
	this.orderListWidget.loadOrders(this.phone);

	var _loadInformation = function ( response ) {
		response = response[0];
		if(!response) 
			return null;
		var user = {};
		for ( var key in response ) {
			user[key] = response[key];
		}
		that.user = user;
		return user;
	};

	$.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/getCustomerInfo.php",
        data: {
        	phoneNumber: phoneNumber
        },
        success: function ( response ) { that.drawData(_loadInformation(response)); },
        error: function ( ) { alert("User could not be loaded.") }
    });
}

var CustomerWidgetEditable = function ( selector ) {
	CustomerWidget.call(this,selector);
}

CustomerWidgetEditable.prototype = new CustomerWidget();
CustomerWidgetEditable.prototype.constructor = CustomerWidgetEditable;

CustomerWidgetEditable.prototype.draw = function ( ) {
	var that = this;
	var phoneNumber = $("<div class='phone'></div>");
	var phoneNumberBox = $("<input type='text' id='phoneNumberBox' placeholder='Phone #'></input>");

	var _getCreditModifier = $.proxy(function ( ) {
		return parseFloat(this.$.find("#creditModifier").val());
	},this);

	phoneNumberBox.on('keydown',function(e){if(e.keyCode==13) that.loadUser(that.getPhoneNumber()); });
	phoneNumberBox.on('blur',function(){that.loadUser(that.getPhoneNumber());});

	phoneNumber.append(phoneNumberBox);
	
	this.$.append(phoneNumber);
	var infoContainer = $("<div class='infoContainer'></div>")
	infoContainer.append("<div class='credit'>Credit: <span id='value'></span></div>");
	infoContainer.append("<div class='creditControl'><input type='text' id='creditModifier'></input><input type='button' value='ADD' id='add'></input><input type='button' value='SUB' id='sub'></input></div>");
	infoContainer.find("#add").on('click',function(){that.modifyCredit(_getCreditModifier);});
	infoContainer.find("#sub").on('click',function(){that.modifyCredit(_getCreditModifier,true);});
	this.$.append(infoContainer);
}

CustomerWidgetEditable.prototype.getPhoneNumber = function ( ) {
	return this.$.find("#phoneNumberBox").val();
}

CustomerWidgetEditable.prototype.drawData = function ( user ) {
	if ( user ) {
		this.$.find("#phoneNumberBox").val(user.phone);
		this.$.find(".credit #value").text(user.credit);
	} else {
		this.$.find("#phoneNumberBox").val(phoneNumber);
		this.$.find(".credit #value").text("User not found.");
	}
}
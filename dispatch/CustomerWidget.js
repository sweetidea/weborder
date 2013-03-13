var CustomerWidget = function ( selector, editable ) {
	if(!selector)
		return false;
	this.phone = "";
	if(editable)
		this.editable = true;
	else
		this.editable = false;
	this.selector = selector;
	this.$ = $(this.selector);
	this.user = "";
	this.draw();
}

CustomerWidget.prototype.getPhoneNumber = function ( ) {
	if(this.editable) {
		return this.$.find("#phoneNumberBox").val();
	} else {
		return this.phone;
	}
}

CustomerWidget.prototype.draw = function ( ) {
	var that = this;
	var phoneNumber = $("<div class='phone'></div>");
	var phoneNumberBox = $("<input type='text' id='phoneNumberBox' placeholder='Phone #'></input>");
	var _getPhoneNumber = $.proxy(function ( ) {
		return this.$.find("#phoneNumberBox").val();
	},this);
	var _getCreditModifier = $.proxy(function ( ) {
		return parseFloat(this.$.find("#creditModifier").val());
	},this);
	if(this.editable) {
		phoneNumberBox.on('keydown',function(e){if(e.keyCode==13) that.loadUser(_getPhoneNumber()); });
		phoneNumberBox.on('blur',function(){that.loadUser(_getPhoneNumber());});
		phoneNumberBox.prop("disabled","disabled");
	}

	phoneNumber.append(phoneNumberBox);
	
	this.$.append(phoneNumber);
	var infoContainer = $("<div class='infoContainer'></div>")
	infoContainer.append("<div class='credit'>Credit: <span id='value'></span></div>");
	infoContainer.append("<div class='creditControl'><input type='text' id='creditModifier'></input><input type='button' value='ADD' id='add'></input><input type='button' value='SUB' id='sub'></input></div>");
	infoContainer.find("#add").on('click',function(){that.modifyCredit(_getCreditModifier);});
	infoContainer.find("#sub").on('click',function(){that.modifyCredit(_getCreditModifier,true);});
	this.$.append(infoContainer);
}

CustomerWidget.prototype.modifyCredit = function ( credit, subtract ) {
	var _getPhoneNumber = $.proxy(function ( ) {
		return this.$.find("#phoneNumberBox").val();
	},this);

	var _updateCredit = $.proxy(function ( credit ) {
		this.$.find(".credit #value").text(credit);
	},this);

	$.ajax({
        type: "POST",
        url: "http://getcooki.es/weborder/dispatch/modifyCredit.php",
        data: {
        	phoneNumber: _getPhoneNumber(),
        	credit: credit,
        	subtract: subtract
        },
        success: function ( response ) { _updateCredit(response[0].credit) },
        error: function ( ) { alert("User could not be loaded.") }
    });
}

CustomerWidget.prototype.loadUser = function ( phone ) {
	var that = this;
	var phoneNumber = phone;
	var _drawData = function ( user ) {
		if ( user ) {
			that.$.find("#phoneNumberBox").val(user.phone);
			that.$.find(".credit #value").text(user.credit);
		} else {
			that.$.find("#phoneNumberBox").val(phoneNumber);
			that.$.find(".credit #value").text("User not found.");
		}
	};

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
        success: function ( response ) { _drawData(_loadInformation(response)); },
        error: function ( ) { alert("User could not be loaded.") }
    });
}
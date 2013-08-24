var TexterController = function ( ) {
	this.texterInstances = {};
	this.lastPollTimestamp = new Date(0);
	var that = this;
	this.getTextInterval = window.setInterval(function(){that.getTexts();},5000);
}

TexterController.prototype.addTexter = function ( texter ) {
	this.texterInstances[texter.phoneNumber] = texter;
}

TexterController.prototype.removeTexter = function ( texter ) {
	delete this.texterInstances[texter.phoneNumber];
}

TexterController.prototype.getTexts = function ( ) {
	var that = this;
	$.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/TexterController-getTexts.php",
        data: {
        	phoneNumberArray: this.getPhoneNumberArray(),
        	time: this.lastPollTimestamp.getTime()/1000 //divide because we want seconds, not ms
        },
        success: function ( response ) { that.updateTextHistory(response);  },
        error: function ( ) { console.log("Noooo text not sent"); }
    });
}

TexterController.prototype.updateTextHistory = function ( texts ) {
	for ( var key in this.texterInstances ) {
		var texter = this.texterInstances[key];
		var lastActivity = texter.updateTextHistory(texts[key]);
		if (lastActivity>this.lastPollTimestamp) {
			this.lastPollTimestamp = lastActivity;
		}
	}
}

TexterController.prototype.getPhoneNumberArray = function ( ) {
	var phoneNumberArray = [];
	for (var key in this.texterInstances) {
	    phoneNumberArray.push(key);
	}
	return phoneNumberArray;
}


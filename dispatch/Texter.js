/**
* Texter.js
* Fills the given div with a scrollable window that shows a coversation history.
* Also provides controls for sending texts back to the specific phone # the window is associated with.
*/

var Texter = function ( selector, phoneNumber ) {
	this.$ = $(selector);
	this.phoneNumber = phoneNumber;
	this.lastActivity = '';
	this.initialize();

}

Texter.prototype.draw = function () {
	this.$.append("<h1>"+this.firstName+" "+this.lastName+"</h1>");
	this.loadTexts();
	this.loadControls();
}

Texter.prototype.initialize = function ( ) {
	this.loadInformation();
}

Texter.prototype.loadInformation = function ( ) {
	/*the purpose of this function is to load the user's info based on their phone number.*/
	var that = this;
	var _loadInformation = function ( response ) {
		response = response[0];
		for ( var key in response ) {
			that[key] = response[key];
		}
	};

	$.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/getInfo.php",
        data: {
        	phoneNumber: this.phoneNumber
        },
        success: function ( response ) { _loadInformation(response); that.draw(); },
        error: function ( ) { alert("Order not placed") }
    });
}

Texter.prototype.updateTextHistory = function ( texts ) {
	var historyBox = this.$.find("#history #messageContainer");
	for( var text in texts ) {
		text = texts[text];
		var message = this.drawTextMessage(text);
		historyBox.append(message);
	}
	if(texts.length>0) {
		this.lastActivity = new Date(text.timestamp);
		this.newMessageAlert(texts[0]);
	}	

}

Texter.prototype.newMessageAlert = function ( text ) {
	var historyBox = this.$.find("#history #messageContainer");
	var height = historyBox.height();
	this.$.find("#history").scrollTop(height);
	if(text.from != "+19785284097")
		historyBox.addClass("newMessage");
}

Texter.prototype.drawTextMessage = function ( data ) {
	var textMessage = $("<div class='text'></div>");
	var offset = 2*60*60*1000; //server time is 2 hours behind
	var time  = new Date(data.timestamp).getTime();
	time = new Date(time+offset);
	var hours = time.getHours();
	var ampm = 'AM';
	if(hours==0)
		hours=12;
	if(hours>=12) {
		ampm='PM';
		if(hours>12)
			hours=hours%12;
	}
	var minutes = time.getMinutes();
	if(minutes<10)
		minutes = '0'+minutes;

	//This code thanks to http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the
	var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
  	data.message = data.message.replace(urlRegEx, "<a href='$1' target='_blank'>$1</a>");

	var timeString = time.getMonth()+1 + '/'+ time.getDate()+'/'+time.getFullYear()+' '+hours+':'+minutes+' '+ampm;
	if(data.from!=this.phoneNumber){
		textMessage.addClass("from"); //the naming here is super confusing and needs to be fixed
	}
	textMessage.append("<div class='message'>"+data.message+"</div><div class='number'>"+data.from+"</div><div class='timestamp'>"+timeString+"</div>");
	return textMessage;
}

Texter.prototype.getTexts = function ( ) {
	var that = this;
	$.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/getTexts.php",
        data: {
        	phoneNumber: this.phoneNumber,
        	time: this.lastActivity.getTime()/1000 //divide because we want seconds, not ms
        },
        success: function ( response ) { that.updateTextHistory(response);  },
        error: function ( ) { console.log("Noooo text not sent"); }
    });
}

Texter.prototype.loadTexts = function ( ) {
	var historyBox = $("<div id='history' class='history'></div>");
	var messageContainer = $("<div id='messageContainer'></div>");
	messageContainer.on("click",function(){messageContainer.removeClass("newMessage");});
	historyBox.append(messageContainer);
	this.$.append(historyBox);	
	var that = this;
	var _loadTexts = function ( texts ) {
		for( var text in texts ) {
			text = texts[text];
			messageContainer.append(that.drawTextMessage(text));
		}
		if(text && text.timestamp)
			that.lastActivity = new Date(text.timestamp);
		else
			that.lastActivity = new Date(0);
		var height = messageContainer.height();
		historyBox.scrollTop(height);
		that.getTextInterval = window.setInterval(function(){that.getTexts();},1000);
	}
	$.ajax({
        type: "GET",
        url: "http://getcooki.es/weborder/dispatch/getTexts.php",
        data: {
        	phoneNumber: this.phoneNumber
        },
        success: function ( response ) { _loadTexts(response);  },
        error: function ( ) { console.log("Noooo text not sent"); }
    });
}

Texter.prototype.sendText = function ( ) {
	var message = this.$.find(".controls #message");
	var that = this;
	var _postText = function ( ) {
		that.displayAlert(message.val());
		message.val("");
	}

	$.ajax({
        type: "POST",
        url: "http://getcooki.es/weborder/dispatch/sendText.php",
        data: {
        	phoneNumber: this.phoneNumber,
        	message: message.val()
        },
        success: function ( response ) { _postText(); },
        error: function ( ) { console.log("Noooo text not sent"); }
    });
}

Texter.prototype.loadControls = function ( ) {
	var controls = $("<div id='controls' class='controls'></div>");
	var textMessageBox = $("<input type='text' id='message' placeholder='Text message'></input>");
	textMessageBox.on('keypress',$.proxy(function(e){if(e.keyCode==13){this.sendText();};},this));
	controls.append(textMessageBox);
	var sendTextButton = $("<input type='button' value='SUBMIT'></input>");
	sendTextButton.on('click',$.proxy(function(){this.sendText();},this));
	controls.append(sendTextButton);
	this.$.append(controls);
	this.$.append("<div id='overlay' class='texterOverlay'><div id='message'></div></div>");
}

Texter.prototype.displayAlert = function ( message ) {
	var that = this;
	var _hide = function ( ) {
		that.$.find("#overlay").hide();
	}
	this.$.find("#overlay").position({top:400,left:400});
	this.$.find("#overlay").show();
	this.$.find("#overlay #message").html(message);
	window.setTimeout(_hide,3000);
}
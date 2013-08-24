var TextMessageTouchSelector = function ( selector ) {
    this.$ = $(selector);
    this.text = this.$.text();
    this.wordArray = this.text.split(" ");
}

TextMessageTouchSelector.prototype.draw = function ( ) {
    this.$.html("");
    var that = this;
    for(counter in this.wordArray) {
        var word = this.wordArray[counter];
        word = $("<span class='textMessageComponent'></span>").text(word);
        word.on("click",function(e){e.stopPropagation(); $(e.target).toggleClass("textMessageComponentSelected"); that.getSelectedWords();});
        this.$.append(word);
        this.$.append(" ");
    }
    var controls = $("<div class='addressSelectorControls'></div>");
    var addressEditor = $("<input id='addressEditor' type='text'></input>");
    var button = $("<input type='button' value='SAVE'></input>");
    var that = this;
    button.on("click",function(){that.saveAddress();});
    controls.append(addressEditor);
    controls.append(button);
    this.$.append(controls);
}

TextMessageTouchSelector.prototype.getSelectedWords = function ( ) {
    var selectedWords = this.$.find(".textMessageComponentSelected");
    var composedWord = "";
    $.each(selectedWords,function(i,val) { composedWord+=$(val).text()+" "; });
    console.log(composedWord);
    this.updateAddressEditor(composedWord);
    return composedWord;
}

TextMessageTouchSelector.prototype.updateAddressEditor = function ( text ) {
    this.$.find("#addressEditor").val(text);
}

TextMessageTouchSelector.prototype.saveAddress = function ( ) {
    this.savedAddress = this.$.find("#addressEditor").val();
    this.$.find(".addressSelectorControls").remove();
    this.$.text(this.text);
    this.$.trigger('addressSaved',this.savedAddress);
    return this.savedAddress;
}
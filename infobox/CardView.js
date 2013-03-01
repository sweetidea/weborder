var Card = function ( id, klass, name, description, image ) {
    this.id = id;
    this.name = name || "";
    this.description = description || "";
    this.image = image || "";
    this.klass = klass || "";
    this.$ = '';
}

Card.prototype.draw = function ( ) {
	card = $("<div id='"+this.id+"' class='card "+this.klass+"'></div>");
    this.$ = card;
    var content = $("<div class='content'></div>");
    content.append("<div class='title'>"+this.name+"</div>");
    content.append("<div class='description'>"+this.description+"</div>");
    content.on('click',$.proxy(function(){this.clicker();},this));
    this.$.append(content);
    return card;
}

Card.prototype.show = function ( ) {
	this.$.show();
}

Card.prototype.hide = function (  ) {
	this.$.hide();
}

var CardView = function (selector, cards) {
	this.$ = $(selector);
    this.cols = 2;
    this.displayedCard = 0;
    if (cards)
        this.cards = cards;
    else
        this.cards = [];
}

CardView.prototype.nextCard = function ( ) {
	var cardId = this.displayedCard;
	cardId += 1;
	if(cardId>=this.cards.length)
		cardId = 0;
	this.displayCard(cardId);
}

CardView.prototype.previousCard = function ( ) {
	var cardId = this.displayedCard;
	cardId -= 1;
	if(cardId<0)
		cardId = this.cards.length-1;
	this.displayCard(cardId);
}

CardView.prototype.displayCard = function ( cardPos ) {
	//could modify this to display using hashes instead of index. doing so would overcome
	//issue of figuring out how thumbnails correspond to cards.
	if(!this.cards[cardPos])
		return false;
	for ( var i = 0; i < this.cards.length; i++ ) {
		if (i!=cardPos)
			this.cards[i].hide();
	}
	this.cards[cardPos].show();
	this.displayedCard = cardPos;
}

CardView.prototype.draw = function ( ) {
    this.$.html("");
    this.$.addClass("cardView")
    var layout = $("<div class='cardLayout'></div>");
    for ( var i = 0; i < this.cards.length; i++ ) {
    	var card = this.cards[i];
    	card = card.draw();
    	card.hide();
    	layout.append(card);
    }
    this.$.append(layout);
    
    //Draw controls
    var controls = $("<div class='controls'></div>");
    var leftclick = $("<div class='leftclick'>&lt;</div>");
    var rightclick = $("<div class='rightclick'>&gt;</div>");
    var that = this;
    leftclick.on("click", function ( e ) { that.previousCard(); });
    rightclick.on("click", function ( e ) { that.nextCard(); });
    controls.append(leftclick);
    controls.append(rightclick);
    /*for ( var i = 0; i < this.cards.length; i++ ) {
    	var card = this.cards[i];
    	var thumbnail = $("<div class='thumbnail'>"+card.name+"</div>");
    	var that = this;
    	thumbnail.on("click", function ( e ) { that.displayCard(i); });
    	layout.append(thumbnail);
    }*/

    this.$.append(controls);

    //Add control listeners
    that = this;
    this.displayCard(this.displayedCard);
}
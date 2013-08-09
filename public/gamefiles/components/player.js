Crafty.c('player',{
	id: null,
	character: null,
	table: null,
	cards: null,
	stackcards: null,
	acitvecards: null,
	cardslots: [],

	player: function(id,table,charpos){
		this.id = id;
		this.table = table;
		this.drawChar(charpos);
		return this;
	}
	,drawCards: function(){
		var limit = Object.keys(this.cardslots).length;
		for(var i=0;i<=limit-1;i++)
		{
			if(this.cardslots[i].hasCard == false)				//each slot without card gets a card
			{
				var that = this;
				var randnumber = Math.floor((Math.random()*this.stackcards.length));		//random card from stack
				var newCard = Crafty.e("2D, DOM, Card, Draggable,"+this.stackcards[randnumber])
								.Card(this.table)
								.attr({
									x: this.cardslots[i].x+5,
									y: this.cardslots[i].y+5,
									value: this.stackcards[randnumber],
									sourceCardslot: i
								})
								.bind("StartDrag",function(){							//event start drag
									this.oldpos.x = this.x;
									this.oldpos.y = this.y;
								})
								.bind("StopDrag", function(data) {						//event stop drag
									var card = this;
									this.dropped(function(chosencardslot){
										if(chosencardslot != "undefined")	//correct drop
										{
											that.cardslots[card.sourceCardslot].hasCard = false;
										}
									});
								});
				this.acitvecards.push(newCard);
				this.cardslots[i]['hasCard'] = true;
				this.stackcards.splice(randnumber,1);
			}
			else
			{i++;}
		}
	}
	,resetStackcards: function(){
		this.stackcards = {};
		this.acitvecards = [];
		$.each(this.cardslots,function(key,cardslot){
			cardslot.hasCard = false;
		});
	}
	,setCards: function(cards){
		this.stackcards = cards;
	}
	,setPlayerCardslots: function(playerCardslots){
		this.playerCardslots = playerCardslots;
	}
	,isTurn: function(){
		this.drawCards();
		$.each(this.acitvecards,function(key,card){
			card.enableDrag();
		});
	}
	,turnOver: function(){
		$.each(this.acitvecards,function(key,card){
			card.disableDrag();
		});
	}
	,drawChar: function(charpos){
		console.log(this.id);
		console.log(charpos);
		this.character = Crafty.e('2D,DOM,playerchar'+this.id).attr({x: charpos[0], y: charpos[1]});
	}
});
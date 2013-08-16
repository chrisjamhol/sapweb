Crafty.c('player',{
	id: null,
	character: null,
	table: null,
	cards: null,
	stackcards: null,
	acitvecards: null,
	cardslots: [],
	healthDisplay: null,

	player: function(id,table,charpos,healthPos){
		this.id = id;
		this.table = table;
		this.drawChar(charpos);
		this.drawHealth(healthPos);
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
		}
		return this;
	}
	,resetStackcards: function(){
		this.stackcards = {};
		this.acitvecards = [];
		$.each(this.cardslots,function(key,cardslot){
			cardslot.hasCard = false;
		});
		return this;
	}
	,setCards: function(cards){
		this.stackcards = cards;
		return this;
	}
	,setPlayerCardslots: function(playerCardslots){
		this.playerCardslots = playerCardslots;
		return this;
	}
	,isTurn: function(){
		this.drawCards();
		$.each(this.acitvecards,function(key,card){
			card.enableDrag();
		});
		return this;
	}
	,turnOver: function(){
		$.each(this.acitvecards,function(key,card){
			card.disableDrag();
		});
		return this;
	}
	,drawChar: function(charpos){
		this.character = Crafty.e('2D,DOM,playerchar'+this.id).attr({x: charpos[0], y: charpos[1]});
		return this;
	}
	,drawHealth: function(healthPos){
		this.healthDisplay = Crafty.e('2D,DOM,Text,hpDisplay')
								.attr({x: healthPos[0], y: healthPos[1]})
								.textFont({
									family: 'PipeDream',
									size: '35px',
									weight: 'bold'
								})
								.textColor('#d83f46', 1)
								.text(this.hp);
		return this;
	}
	,updateHealthDisplay: function(){
		this.healthDisplay.text(this.hp);
		return this;
	}
});
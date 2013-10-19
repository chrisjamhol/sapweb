Crafty.c('player',{
	id: null,
	character: null,
	table: null,
	cards: null,
	stackcards: null,
	acitvecards: null,
	cardslots: [],
	healthDisplay: null,
	nameDisplay: null,
	firstTurn: null,

	player: function(id,table,charpos,healthPos,characterId,playername,firstTurn){
		this.id = id;
		this.table = table;
		this.characterId = characterId;
		this.drawChar(charpos);
		this.drawHealth(healthPos);
		this.firstTurn = firstTurn;
		this.name = playername;
		return this;
	}
	,drawCards: function(){
		var limit = Object.keys(this.cardslots).length;
		var newCardsData = [];
		for(var i=0;i<=limit-1;i++)
		{
			if(this.cardslots[i].hasCard == false)				//each slot without card gets a card
			{
				var that = this;
				var randnumber = Math.floor((Math.random()*this.stackcards.length));		//random card from stack
				console.log(this.table);
				var newCard = Crafty.e("2D, DOM, Card, Draggable,"+this.stackcards[randnumber])
								.Card(this.table)
								.attr({
									x: this.cardslots[i].x+5,
									y: this.cardslots[i].y+5,
									value: this.stackcards[randnumber],
									sourceCardslot: i
								})
								.bind("StartDrag",function onStartDrag(){							//event start drag
									this.oldpos.x = this.x;
									this.oldpos.y = this.y;
								})
								.bind("StopDrag", function onStopDrag (data) {						//event stop drag
									var card = this;
									this.dropped(function onDropped(chosencardslot){
										if(chosencardslot != "undefined")	//correct drop
										{
											that.cardslots[card.sourceCardslot].hasCard = false;
										}
									});
								});
				this.acitvecards.push(newCard);
				this.cardslots[i]['hasCard'] = true;
				this.stackcards.splice(randnumber,1);
				newCardsData.push({"slot": i, "card": {"value": newCard.value}});
			}
		}
		return newCardsData;
	}
	,getHandCards: function(){
		var cards = {};
		$.each(this.acitvecards,function packHandCards(key,card){cards[key] = card.value;});
		return cards;
	}
	,resetStackcards: function(){
		this.stackcards = {};
		this.acitvecards = [];
		$.each(this.cardslots,function resetCardslot(key,cardslot){
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
		var newCards = this.drawCards();
		$('.turnBadgeTop').addClass('turnBadgeTopTurn');
		$.each(this.acitvecards,function(key,card){
			card.enableDrag();
			card.attr({'z': 500});
		});
		return newCards;
	}
	,turnOver: function(){
		$('.turnBadgeTop').removeClass('turnBadgeTopTurn');
		$.each(this.acitvecards,function(key,card){
			card.disableDrag();
		});
		return this;
	}
	,drawChar: function(charpos){
		this.character = Crafty.e('2D,DOM,playerchar'+this.characterId).attr({x: charpos[0], y: charpos[1]});
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
								.textColor('#d83f46', 1);
		return this;
	}
	,drawName: function(){
		this.nameDisplay = Crafty.e('2D,DOM,Text,nameDisplay')
								.attr({x: healthPos[0], y: healthPos[1]})
								.textFont({
									family: 'PipeDream',
									size: '35px',
									weight: 'bold'
								})
								.textColor('#d83f46', 1)
								.text(this.name);
		return this;
	}
	,removeCardsFromStack: function(cards){
		var that = this;
		$.each(cards,function removeCardFromStack(index,card){
			that.stackcards.splice(that.stackcards.indexOf(card),1);
		});
	}
	,startPlaying: function(){
		if(this.firstTurn){
			this.isTurn();
		}
	}
	,updateHealthDisplay: function(){
		if(this.hp < 0)
			{var newHp = 0;}
		else
			{var newHp = this.hp;}
		this.healthDisplay.text(newHp);
		return this;
	}
});
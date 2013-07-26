Crafty.c('player',{
	id: null,
	table: null,
	hp: null,
	cards: null,
	stackcards: null,
	acitvecards: null,
	direction: null,
	cardslots: null,

	player: function(id,hp,table,direction,cardslots){
		this.cardslots = [];
		this.acitvecards = [];
		this.id = id;
		this.hp = hp;
		this.direction = direction;
		this.table = table;
		this.cardslots = cardslots;
		return this;
	}
	,drawCards: function(){
		var limit = Object.keys(this.cardslots).length;
		for(var i=0;i<=limit-1;i++)
		{
			if(this.cardslots[i].hasCard == false)
			{
				var that = this;
				var randnumber = Math.floor((Math.random()*this.stackcards.length));
				var newCard = Crafty.e("2D, DOM, Card, Draggable,"+this.stackcards[randnumber])
								.Card(this.table)
								.attr({
									x: this.cardslots[i].x+5,
									y: this.cardslots[i].y+5,
									value: this.stackcards[randnumber],
									sourceCardslot: i
								})
								.bind("StartDrag",function(){
									this.oldpos.x = this.x;
									this.oldpos.y = this.y;
								})
								.bind("StopDrag", function(data) {
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
		//this.cards = cards;
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
	,getHp: function(){
		console.log(this.hp);
	}
});
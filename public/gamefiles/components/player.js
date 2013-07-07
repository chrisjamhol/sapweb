Crafty.c('player',{
	table: null,
	turn: false,
	hp: null,
	cards: null,
	stackcards: null,
	acitvecards: null,
	direction: null,
	cardslots: [],

	player: function(hp,cards,table,direction,cardslots){
		this.hp = hp;
		this.direction = direction;
		this.table = table;
		this.cards = cards;
		this.stackcards = cards;
		this.cardslots = cardslots;
		return this;
	}
	,init: function(){	

	}
	,drawCards: function(count){
		var randomcards = [];
		console.log(this.cardslots);
		for(var i=0;i<=count-1;i++)
		{
			var randnumber = Math.floor((Math.random()*this.stackcards.length));			
			randomcards.push(
				Crafty.e("2D, DOM, Card, Draggable,"+this.stackcards[randnumber])
					.attr({
						x: this.cardslots[i][0]+5,
						y: this.cardslots[i][1]+5,
						value: this.stackcards[randnumber]
					})
					// .bind("StopDrag", function() {
					// 	console.log(this.attr('x')+" "+this.attr('y')+" "+this.value);
					// 	this.tabel.setCard(this);
					// 	//if(blabla) 
					// })
			);			
			this.stackcards.splice(randnumber,1);
		}
	}
	,isTurn: function(){
		console.log(this.turn);
	}
	,getHp: function(){
		console.log(this.hp);
	}			
});
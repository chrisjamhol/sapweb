Crafty.c('player',{
	id: null,
	table: null,
	hp: null,
	cards: null,
	stackcards: null,
	acitvecards: null,
	direction: null,
	cardslots: null,

	player: function(id,hp,cards,table,direction,cardslots){
		this.cardslots = [];
		this.acitvecards = [];
		this.id = id;
		this.hp = hp;
		this.direction = direction;
		this.table = table;
		this.cards = cards;
		this.stackcards = cards;
		this.cardslots = cardslots;
		return this;
	}
	,drawCards: function(count){
		for(var i=0;i<=count-1;i++)
		{
			var randnumber = Math.floor((Math.random()*this.stackcards.length));
			this.acitvecards.push(
				Crafty.e("2D, DOM, Card, Draggable,"+this.stackcards[randnumber])
					.Card(this.table)
					.attr({
						x: this.cardslots[i][0]+5,
						y: this.cardslots[i][1]+5,
						value: this.stackcards[randnumber]
					})
					.bind("StartDrag",function(){
						this.oldpos.x = this.x;
						this.oldpos.y = this.y;
					})
					.bind("StopDrag", function(data) {
						//console.log(data);
						var chosencardslot = this.dropped();
						//this.table.showdown(chosencardslot);
					})
			);
			this.stackcards.splice(randnumber,1);
		}
	}
	,isTurn: function(){
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
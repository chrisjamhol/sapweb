Crafty.c('table',{
	handcardsCount: 4,
	cards: null,
	fieldCardslots: null,
	player: [],
	playercount: null,
	directions: ['top','bottom'],
	rules: null,
	turn: {
		player: null,
		move: 0
	},
	playerCardslotsPos: {
					top:[[560,25],[660,25],[760,25],[860,25]],
					bottom:[[560,440],[660,440],[760,440],[860,440]]
				  },
	table: function(cards,playercount){
		this.cards = cards;
		this.playercount = playercount;
		//create player
		for(var i=0;i<=this.playercount-1;i++)
		{
			this.player.push(
				Crafty.e("2D, DOM, player,life")
			);
		}
		this.rules = Crafty.e("Rules");
		return this;
	},
	init: function(playercount){
			//init battelfield
		var offset = {x: 86, y: 70};
		var cardsAttr = {w: 70, h: 82, padding: 5};
		this.fieldCardslots = {
			getSlots: function(){return this.rows;},
			rows: [
						//row1
					[
						{x:offset.x+cardsAttr.padding,y:offset.y+cardsAttr.padding,card:null},
						{x:offset.x+cardsAttr.padding*2+cardsAttr.w*1,y:offset.y+cardsAttr.padding,card:null},
						{x:offset.x+cardsAttr.padding*3+cardsAttr.w*2,y:offset.y+cardsAttr.padding,card:null},
						{x:offset.x+cardsAttr.padding*4+cardsAttr.w*3,y:offset.y+cardsAttr.padding,card:null},
						{x:offset.x+cardsAttr.padding*5+cardsAttr.w*4,y:offset.y+cardsAttr.padding,card:null}
					],
						//row2
					[
						{x:offset.x+cardsAttr.padding,y:offset.y+cardsAttr.padding*2+cardsAttr.h,card:null},
						{x:offset.x+cardsAttr.padding*2+cardsAttr.w*1,y:offset.y+cardsAttr.padding*2+cardsAttr.h,card:null},
						{x:offset.x+cardsAttr.padding*3+cardsAttr.w*2,y:offset.y+cardsAttr.padding*2+cardsAttr.h,card:null},
						{x:offset.x+cardsAttr.padding*4+cardsAttr.w*3,y:offset.y+cardsAttr.padding*2+cardsAttr.h,card:null},
						{x:offset.x+cardsAttr.padding*5+cardsAttr.w*4,y:offset.y+cardsAttr.padding*2+cardsAttr.h,card:null}
					],
						//row3
					[
						{x:offset.x+cardsAttr.padding,y:offset.y+cardsAttr.padding*3+cardsAttr.h*2,card:null},
						{x:offset.x+cardsAttr.padding*2+cardsAttr.w*1,y:offset.y+cardsAttr.padding*3+cardsAttr.h*2,card:null},
						{x:offset.x+cardsAttr.padding*3+cardsAttr.w*2,y:offset.y+cardsAttr.padding*3+cardsAttr.h*2,card:null},
						{x:offset.x+cardsAttr.padding*4+cardsAttr.w*3,y:offset.y+cardsAttr.padding*3+cardsAttr.h*2,card:null},
						{x:offset.x+cardsAttr.padding*5+cardsAttr.w*4,y:offset.y+cardsAttr.padding*3+cardsAttr.h*2,card:null}
					],
						//row4
					[
						{x:offset.x+cardsAttr.padding,y:offset.y+cardsAttr.padding*4+cardsAttr.h*3,card:null},
						{x:offset.x+cardsAttr.padding*2+cardsAttr.w*1,y:offset.y+cardsAttr.padding*4+cardsAttr.h*3,card:null},
						{x:offset.x+cardsAttr.padding*3+cardsAttr.w*2,y:offset.y+cardsAttr.padding*3+cardsAttr.h*3,card:null},
						{x:offset.x+cardsAttr.padding*4+cardsAttr.w*3,y:offset.y+cardsAttr.padding*4+cardsAttr.h*3,card:null},
						{x:offset.x+cardsAttr.padding*5+cardsAttr.w*4,y:offset.y+cardsAttr.padding*4+cardsAttr.h*3,card:null}
					],
						//row5
					[
						{x:offset.x+cardsAttr.padding,y:offset.y+cardsAttr.padding*5+cardsAttr.h*4,card:null},
						{x:offset.x+cardsAttr.padding*2+cardsAttr.w*1,y:offset.y+cardsAttr.padding*5+cardsAttr.h*4,card:null},
						{x:offset.x+cardsAttr.padding*3+cardsAttr.w*2,y:offset.y+cardsAttr.padding*5+cardsAttr.h*4,card:null},
						{x:offset.x+cardsAttr.padding*4+cardsAttr.w*3,y:offset.y+cardsAttr.padding*5+cardsAttr.h*4,card:null},
						{x:offset.x+cardsAttr.padding*5+cardsAttr.w*4,y:offset.y+cardsAttr.padding*5+cardsAttr.h*4,card:null}
					]
				  ]
		};
	}
	,giveCards: function(){
		$.each(this.playerCardslotsPos,function(direction,position){
			for(var i=0;i<=position.length-1;i++){
				Crafty.e("2D,DOM,Cardslot").attr({x:position[i][0], y:position[i][1]});
			}
		});
		var givenCards = [];
			//playing cards
		var fieldSlots = this.fieldCardslots.getSlots();
		var cards = this.cards;
		$.each(fieldSlots,function(key,row){
			if(key == 1 || key == 2 || key ==3)
			{
				Crafty.e("2D,DOM,Cardslot,FieldCardslot").attr({x:row[0].x, y:row[0].y});	//free left and right cardslot
				Crafty.e("2D,DOM,Cardslot,FieldCardslot").attr({x:row[4].x, y:row[4].y});
				for(var col=1;col<=3;col++)
				{
					var randnumber = Math.floor((Math.random()*cards.length));
					var card = Crafty.e("2D, DOM, Card, "+cards[randnumber])
								.attr({
									x: row[col].x+5,
									y: row[col].y+5,
									value: cards[randnumber]
								})
					row[col].card = card;
					givenCards.push(cards[randnumber]);
					cards.splice(randnumber,1);
				}
			}
			else
			{
				for(var col=0;col<=row.length-1;col++)
				{
					Crafty.e("2D,DOM,Cardslot,FieldCardslot")
						.attr({
							x:row[col].x,
							y:row[col].y
						});
				}
			}
		});
		return givenCards;
		//to show all cards
		// var y = 0; var height = 72+5;var x = 0; var width = 60+5;var stacklength = this.stackcards.length;
		// for(var i=0;i<=stacklength-1;i++){
		// 	var randnumber = Math.floor((Math.random()*this.stackcards.length));
		// 	if((i%15)==0){x=0;y++;}
		// 	randomcards.push(Crafty.e("2D, DOM, Card, Draggable, "+this.stackcards[randnumber]).attr({x: (x*width),y: (y*height)}));
		// 	x++;
		// 	this.stackcards.splice(randnumber,1);
		// }
	}
	,cardDropped: function(card,cardslot){
		console.log(this.turn);
		if(this.turn.move < 1)
		{this.turn.move++;}
		else
		{
			this.player[this.turn.player].turnOver();
			this.turn.player = (this.turn.player == this.player[0].id) ? this.player[1].id : this.player[0].id;
			this.player[this.turn.player].isTurn();
			this.turn.move = 0;			
		}		
	}
	,newGame: function(){
		var givenCards = this.giveCards();
		var that = this;
		$.each(this.player,function(key,player){
			var playerHp = 100;
			player
				.player(
					key,
					playerHp,
					that.shuffle(that.cards),
					that,that.directions[key],
					that.getPlayerCardslots(that.directions[key])
				)
				.drawCards(4);
		});
		if(this.turn.player == null)
		{
			this.turn.player = this.player[0].id;	//randomize!!!!			
			this.player[this.turn.player].isTurn();
		}
	}
	,getRandomCard: function(){
		return
	}
	,shuffle: function(array){
		var currentIndex = array.length
	    , temporaryValue
	    , randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
	,getPlayerCardslots: function(direction){return this.playerCardslotsPos[direction];}
});
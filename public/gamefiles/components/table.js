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
		this.fieldCardslots = {
			getSlots: function(){return this.rows;},
			modify: function(operator)
			{
				$.each(this.rows,function(count,row){
					$.each(row,function(col,slot){
						if(slot.obj !== null){
							slot.obj[operator]();
						}
					});
				});
			},
			rows: []
		};
				//seting up the positions for the fieldcardslots
			var offset = {x: 86, y: 70},
				cardsAttr = {w: 70, h: 82, padding: 5},
				rowcount = 5,
				colcount = 5;
			for(var row=0; row<=rowcount-1; row++)
			{
				this.fieldCardslots.rows[row] = [];
				for(var col=1; col<=colcount;col++)
				{
					var factor = ((col-1) <= 0) ? null : (col-1);
					this.fieldCardslots.rows[row].push(
						{x:offset.x+cardsAttr.padding*(col)+cardsAttr.w*(factor),y:offset.y+cardsAttr.padding*(row+1)+cardsAttr.h*(row),obj:null,card:null}
					);
				}
			}
	}
	,giveCards: function(){
		$.each(this.playerCardslotsPos,function(direction,position){
			for(var i=0;i<=position.length-1;i++){
				Crafty.e("2D,DOM,Cardslot").attr({x:position[i][0],y :position[i][1]});
			}
		});
		var givenCards = [];
			//playing cards
		var fieldSlots = this.fieldCardslots.getSlots();
		var cards = this.cards;
		$.each(fieldSlots,function(key,row){
			if(key == 1 || key == 2 || key ==3)
			{

				row[0].obj = Crafty.e("2D,DOM,FieldCardslot,Cardslot").FieldCardslot(key,0).attr({x:row[0].x, y:row[0].y});	//free left and right cardslot
				row[4].obj = Crafty.e("2D,DOM,FieldCardslot,Cardslot").FieldCardslot(key,4).attr({x:row[4].x, y:row[4].y});
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
					row[col].obj = Crafty.e("2D,DOM,FieldCardslot,Cardslot")
										.FieldCardslot(key,col)
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
		cardslot.setTaken();
		this.fieldCardslots.rows[cardslot.row][cardslot.col].card = card;
		if(this.turn.move < 1)
		{
			this.limitDropzones(cardslot,this.fieldCardslots);
			this.turn.move++;
		}
		else
		{
			var that = this;
			this.checkForHits(cardslot,this.fieldCardslots,function(hits){
				console.log(hits);
				that.player[that.turn.player].turnOver();
				that.turn.player = (that.turn.player == that.player[0].id) ? that.player[1].id : that.player[0].id;
				that.player[that.turn.player].isTurn();
				that.turn.move = 0;
				//------------> enable all slots with no card <----------------
				$.each(that.fieldCardslots.rows,function(count,row){
					$.each(row,function(col,slot){
						if(slot.card == null && slot.obj != null){slot.obj.enable();}
					});
				});
			});
		}
	}
	,limitDropzones: function(sourceCardslot,fieldcardslots){
		var row = sourceCardslot.row, col = sourceCardslot.col;
		//------------> disable all <----------------
		fieldcardslots.modify('disable');
		//------------> enable allowed <----------------
			//easy cols and rows
		if( row > 0 && row < 4 )		//vertiacl
		{
			if(col == 0){fieldcardslots.rows[row][4].obj.enable();}
			else if(col == 4){fieldcardslots.rows[row][0].obj.enable();}
		}
		else if( col > 0 && col <4 )	//horizontal
		{
			if(row == 0){fieldcardslots.rows[4][col].obj.enable();}
			else if(row == 4){fieldcardslots.rows[4][col].obj.enable();}
		}
			//corners
		else if(row == 0 && col == 0)	//top left
		{fieldcardslots.rows[4][4].obj.enable();}
		else if(row == 4 && col == 0)	//bottom left
		{fieldcardslots.rows[0][4].obj.enable();}
		else if(row == 0 && col == 4)	//top right
		{fieldcardslots.rows[4][0].obj.enable();}
		else if(row == 4 && col == 4)	//bottom right
		{fieldcardslots.rows[0][0].obj.enable();}
	}
	,checkForHits: function(sourceCardslot,fieldcardslots,callback){
		var row = sourceCardslot.row, col = sourceCardslot.col;
		var affectedRows = [];
		var rows = [];
		console.log("chekcing for hits: "+row+" / "+col);
		if(row == 0 && (col == 0 || col == 4) || ((row > 0 && row < 4 ) && (col == 0 || col == 4)) || (row == 4 && (col == 0 || col == 4)) )
		{
			rows.push(fieldcardslots.rows[row]);
		}
			//corners
		else if(row == 0 && col == 0)	//top left
		{

		}
		else if(row == 4 && col == 0)	//bottom left
		{

		}
		else if(row == 0 && col == 4)	//top right
		{

		}
		else if(row == 4 && col == 4)	//bottom right
		{

		}
		callback(this.rules.check(rows));
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
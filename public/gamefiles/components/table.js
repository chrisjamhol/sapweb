Crafty.c('table',{
	allCards: null,
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
	rounds: 0,
	moves: 0,
	playerCardslots: {},
	playerCardslotsPos: {
					top:[[560,25],[660,25],[760,25],[860,25]],
					bottom:[[560,440],[660,440],[760,440],[860,440]]
				  },
	playerCharPos: {
					0: [830,135],
					1: [830,310]
				}
	,table: function(cards,playercount){
		this.cards = cards;
		this.allCards = cards;
		this.playercount = playercount;
		//create player
		for(var i=0;i<=this.playercount-1;i++)
		{
			this.player[i] = Crafty.e("2D, DOM, player,life,weaponComp,shield").life(120);
		}
		this.rules = Crafty.e("Rules");
		return this;
	},
	init: function(playercount){
			//init battelfield -> this.fieldCardslots (obj)
		this.fieldCardslots = {
			getSlots: function(){return this.rows;},
			modify: function(operator) 		//enable
			{
				$.each(this.rows,function(count,row){
					$.each(row,function(col,slot){
						if(slot.obj !== null){
							slot.obj[operator]();
						}
					});
				});
			},
			clearCards: function(){			//clear from cards for new round or new game
				$.each(this.rows,function(key,row){
					$.each(row,function(col,slot){
						slot.card = null;
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
	,newGame: function(){
		var that = this;
		var playercount = 0;
			//setting up the player cardslots
		$.each(this.playerCardslotsPos,function(direction,position){
			var playerCardslots = {};
			for(var i=0;i<=position.length-1;i++){
				playerCardslots[i] = Crafty.e("2D,DOM,Cardslot").attr({x:position[i][0], y:position[i][1], hasCard: false});
			}
			that.playerCardslots[direction] = [];
			that.playerCardslots[direction].push(playerCardslots);
			that.player[playercount].cardslots = playerCardslots;
			playercount++;
		});
			//init player
		this.initPlayer(function(){
				//start new round
			that.round = 0;
			that.newRound();
		});
	}
	,initPlayer: function(callback){
		var that = this;
		$.each(this.player,function(key,player){
				//create the player obj
			player
				.player(
					key,							//player "id"
					that,							//link to table
					//that.player[key].cardslots,		//playercardslots (4)
					that.playerCharPos[key]			//position for the avatar
				);
				//setting the attr for the player obj
			player.life(120);
			player.weaponComp(20,"w_mightyhammer");				//todo: make this variable
			player.shield(20);
		});
		callback();
	}
	,newRound: function(){
		var that = this;

		this.shuffle(this.cards);

		if(this.round != 0)									//first round no cards need to be cleard
		{
			this.clearCards();
		}

		this.giveCards();									//give cards and remove them from the cards the players get --> no doubles on both sides

		$.each(this.player,function(key,player){
			player.resetStackcards();						//remove all cards
			player.setCards(that.shuffle(that.cards));		//give new cards (without the this.giveCards()) to the players stack
			player.drawCards();								//draw cards to fill the player cardslots from separate carddecks per player
		});

		if(this.turn.player == null)						//is first round
		{
			this.turn.player = this.player[0].id;			//todo: randomize!!!!
			this.player[this.turn.player].isTurn();
		}
		else
		{
			this.changeTurn();								//change active player
		}
	}
	,clearCards: function(){
		$.each(Crafty("Card"),function(key,cardId){			//destroy Card and FieldCardslot elements for new Round
			this.cards = this.allCards;
			Crafty(cardId).destroy();
		});
		$.each(Crafty("FieldCardslot"),function(key,slot){
			Crafty(slot).destroy();
		});

		$.each(this.fieldCardslots.rows,function(count,row){	//reset the battelfield card slots (enabled = true;taken = false;)
			$.each(row,function(col,slot){
				if(slot.card == null && slot.obj != null){slot.obj.reset();}
			});
		});

		this.fieldCardslots.clearCards();					//delete old cards from all fieldslots
	}
	,giveCards: function(){
		var that = this;
		var fieldSlots = this.fieldCardslots.getSlots();
		var cards = this.cards;

		$.each(fieldSlots,function(key,row){				//set all fieldcardslots and set pos for fieldcardslots and cardslots
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
	}
	,cardDropped: function(card,cardslot){
			//comes from the event from card element!!! Assures that card is dropped correct
		cardslot.setTaken();														//block slot til next round
		this.fieldCardslots.rows[cardslot.row][cardslot.col].card = card;			//set refrents to the dropped card in slot

		if(this.turn.move < 1)
		{
			this.limitDropzones(cardslot,this.fieldCardslots);						//set allowed dropps for second card
			this.turn.move++;
		}
		else
		{
			var that = this;
			this.checkForHits(cardslot,this.fieldCardslots,function(hits){			//checking for hits
				console.log(hits);
				console.log(that.turn);
				if(hits.length > 0)															//if damage -> deal damage
				{
					$.each(hits,function(hitcount,hit){
						var weaponDamage = 0;
						if(that.turn.player == 0)				//player 0 attaks
						{
							weaponDamage = that.player[0].attack(hit.label);
							victim = 1;
						}
						else if(that.turn.player == 1)			//player 1 attaks
						{
							weaponDamage = that.player[1].attack(hit.label);
							victim = 0;
						}
						that.player[victim].takeDamage(weaponDamage);
						console.log(that.player[victim].hp);
					});
				}

				//------------> enable all slots with no card <----------------
				if(that.moves < 7)													//round over?
				{
					that.changeTurn();

					$.each(that.fieldCardslots.rows,function(count,row){						//enable all fieldcardslots again
						$.each(row,function(col,slot){
							if(slot.card == null && slot.obj != null){slot.obj.enable();}
						});
					});
					that.moves++;
				}
				else 																//round over!
				{
					that.round++;
					that.newRound();												//start new round
					that.moves = 0;
				}
			});
		}
	}
	,limitDropzones: function(sourceCardslot,fieldcardslots){
		var row = sourceCardslot.row, col = sourceCardslot.col;
		//------------> disable all <----------------
		fieldcardslots.modify('disable');
		//------------> enable allowed <----------------
			//easy cols and rows
		if( (row > 0 && row < 4) && (col == 0 || col == 4) )		//horizontal
		{
			if(col == 0){fieldcardslots.rows[row][4].obj.enable();}
			else if(col == 4){fieldcardslots.rows[row][0].obj.enable();}
		}
		else if( (col > 0 && col < 4) && (row == 0 || row == 4) )	//vertical
		{
			if(row == 0){fieldcardslots.rows[4][col].obj.enable();}
			else if(row == 4){fieldcardslots.rows[0][col].obj.enable();}
		}
		else if( (row == 0 || row == 4) && (col == 0 || col == 4) )
		{
			//corners
			if(row == 0 && col == 0)	//top left
			{fieldcardslots.rows[4][4].obj.enable();}
			if(row == 4 && col == 0)	//bottom left
			{fieldcardslots.rows[0][4].obj.enable();}
			if(row == 0 && col == 4)	//top right
			{fieldcardslots.rows[4][0].obj.enable();}
			if(row == 4 && col == 4)	//bottom right
			{fieldcardslots.rows[0][0].obj.enable();}
		}
	}
	,checkForHits: function(sourceCardslot,fieldcardslots,callback){			//get affected rows and check them agains the rules
		var row = sourceCardslot.row, col = sourceCardslot.col;
		var affectedRows = [];
		var rows = [];
			//corners
		if( (row == 0 && col == 0) || (row == 4 && col == 4) )	//top left to bottom right
		{
			var rowObj = [];
			var colcount = 0;
			for(var i = 0; i <= 4; i++)
			{
				rowObj.push(fieldcardslots.rows[i][colcount]);
				colcount++;
			}
			rows.push(rowObj);
		}
		if( (row == 4 && col == 0) || (row == 0 && col == 4))	//top right to bottom left
		{
			var rowObj = [];
			var colcount = 4;
			for(var i = 0; i <= 4; i++)
			{
				rowObj.push(fieldcardslots.rows[i][colcount]);
				colcount--;
			}
			rows.push(rowObj);
		}
			//horizontal
		if((row > 0 && row < 4) && (col == 0 || col == 4))
		{
			rows.push(fieldcardslots.rows[row]);
		}
			//vertical
		if((col > 0 && col < 4) && (row == 0 || row == 4))
		{
			var rowObj = [];
			for(var i = 4; i >= 0; i--) {
				rowObj.push(fieldcardslots.rows[i][col]);
			};
			rows.push(rowObj);
		}
		callback(this.rules.check(rows));
	}
	,changeTurn: function(){
		this.player[this.turn.player].turnOver();
		this.turn.player = (this.turn.player == this.player[0].id) ? this.player[1].id : this.player[0].id;
		this.player[this.turn.player].isTurn();
		this.turn.move = 0;
	}
	,shuffle: function(cards){
		var currentIndex = cards.length
	    , temporaryValue
	    , randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = cards[currentIndex];
			cards[currentIndex] = cards[randomIndex];
			cards[randomIndex] = temporaryValue;
		}
		return cards;
	}
});
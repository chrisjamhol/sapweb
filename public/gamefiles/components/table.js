Crafty.c('table',{
	allCards: null,
	cards: null,
	fieldCardslots: null,
	hitDescription: null,
	hitDescriptionPos: {x: 560, y: 270},
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
				},
	playerHealthPos: {
					0: [715,150],
					1: [715,375]
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

			//creating the hitDescription obj
		this.hitDescription = Crafty.e('2D,DOM,Text,Tween,hitDescription')
								.attr({x: this.hitDescriptionPos.x, y: this.hitDescriptionPos.y})
								.textFont({
									family: 'PipeDream',
									size: '35px',
									weight: 'bold'
								})
								.textColor('#d83f46', 1);
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
					that.playerCharPos[key],		//position for the avatar
					that.playerHealthPos[key]
				);
				//setting the attr for the player obj
			player.life(120);
			player.weaponComp(20,"w_stick");				//todo: make this variable
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
			this.checkForHits(cardslot,this.fieldCardslots,function handleHits(hits){			//checking for hits
				if(hits.length > 0)															//if damage -> deal damage
				{
					that.dealDamage(hits,function(){
						if(that.player[victim].hp <= 0)
						{
							Crafty.winner = (that.player[victim].id == 1) ? 0 : 1;
							Crafty.scene("won");
						}
						else
						{
							that.handleTurnEnd();
						}
					});
				}
				else
				{
					that.handleTurnEnd();
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

			//horizontal
		if((row > 0 && row < 4) && (col == 0 || col == 4))
		{
				//push affected row
			rows.push(fieldcardslots.rows[row]);
				//get adjacent cols
			var colcardCount = this.getAdjacentColCardCount(fieldcardslots);
			if(colcardCount.left == 5) {rows.push(this.getColCards(fieldcardslots,0));} 	//left col is filled with 5 cards
			if(colcardCount.right == 5){rows.push(this.getColCards(fieldcardslots,4));} 	//right col is filled with 5 cards
		}
			//vertical
		if((col > 0 && col < 4) && (row == 0 || row == 4))
		{
				//get main col
			rows.push(this.getColCards(fieldcardslots,col));
				//get adjasend rows
			var rowcardCount = this.getAdjacentRowCardCount(fieldcardslots);
			if(rowcardCount.top == 5) {rows.push(fieldcardslots.rows[0]);} 					//top row is filled with 5 cards
			if(rowcardCount.bottom == 5){rows.push(fieldcardslots.rows[4]);} 				//bottom row is filled with 5 cards
		}
			//corners
		if( (row == 0 && col == 0) || (row == 4 && col == 4) )	//top left to bottom right
		{
				//diagonal
			rows.push(this.getDiagonalCards(fieldcardslots,"lr"));		//lr -> left to right
				//adjasend col and row
			var colcardCount = this.getAdjacentColCardCount(fieldcardslots);
			var rowcardCount = this.getAdjacentRowCardCount(fieldcardslots);
				if(colcardCount.left == 5){rows.push(this.getColCards(fieldcardslots,0));}
				if(rowcardCount.top == 5){rows.push(fieldcardslots.rows[0]);}
				if(colcardCount.right == 5){rows.push(this.getColCards(fieldcardslots,4));}
				if(rowcardCount.bottom == 5){rows.push(fieldcardslots.rows[4]);}
		}

		if( (row == 4 && col == 0) || (row == 0 && col == 4))	//top right to bottom left
		{
				//diagonal
			rows.push(this.getDiagonalCards(fieldcardslots,"rl"));		//rl -> left to right
				//adjasend col and row
			var colcardCount = this.getAdjacentColCardCount(fieldcardslots);
			var rowcardCount = this.getAdjacentRowCardCount(fieldcardslots);
				if(colcardCount.left == 5){rows.push(this.getColCards(fieldcardslots,4));}
				if(rowcardCount.top == 5){rows.push(fieldcardslots.rows[0]);}
				if(colcardCount.right == 5){rows.push(this.getColCards(fieldcardslots,0));}
				if(rowcardCount.bottom == 5){rows.push(fieldcardslots.rows[4]);}
		}
		callback(this.rules.check(rows));
	}
	,dealDamage: function(hits,callback){
		var that = this;
		var weaponDamage = 0;
		var hits = hits;
		var hit = hits[0];
		if(this.turn.player == 0)				//player 0 attaks
		{
			weaponDamage = this.player[0].attack(hit.label);
			victim = 1;
		}
		else if(this.turn.player == 1)			//player 1 attaks
		{
			weaponDamage = this.player[1].attack(hit.label);
			victim = 0;
		}
		var hitname = hit.name;
		this.displayDamage(hitname,function serveDamage(){
			that.player[victim].takeDamage(weaponDamage).updateHealthDisplay();
			hits.shift();
			if(hits[0] != null)
			{
				that.dealDamage(hits,callback);
			}
			else
			{
				callback();
			}
		});

	}
	,displayDamage: function(hitDescription,callback){
			//updateing the hitDescription Lable
		this.hitDescription.text(hitDescription);
		var hitDescriptionDomId = Crafty('hitDescription');
		var hitDescriptionDomObject = $('#ent'+hitDescriptionDomId[0]);
		$(hitDescriptionDomObject[0]).show();
		$(hitDescriptionDomObject[0]).fadeOut(2000,function(){
			callback();
		});
	}
	,handleTurnEnd: function(){
		if(this.moves < 7)
			{this.initNewTurn();}
		else
			{this.roundOver();}
	}
	,changeTurn: function(){
		this.player[this.turn.player].turnOver();
		this.turn.player = (this.turn.player == this.player[0].id) ? this.player[1].id : this.player[0].id;
		this.player[this.turn.player].isTurn();
		this.turn.move = 0;
	}
	,initNewTurn: function(){
		this.changeTurn();
		$.each(this.fieldCardslots.rows,function(count,row){						//enable all fieldcardslots again
			$.each(row,function(col,slot){
				if(slot.card == null && slot.obj != null){slot.obj.enable();}
			});
		});
		this.moves++;
	}
	,roundOver: function(){
		this.round++;
		this.newRound();
		this.moves = 0;
	}
	,getAdjacentColCardCount: function(fieldcardslots){
		var cardcountL = 0;
		var cardcountR = 0;
		$.each(fieldcardslots.rows,function(rowcount,row){
			if(row[0].card != null){cardcountL++;}
			if(row[4].card != null){cardcountR++;}
		});
		return {"left": cardcountL, "right": cardcountR};
	}
	,getAdjacentRowCardCount: function(fieldcardslots){
		var cardCount = [];
		$.each([fieldcardslots.rows[0],fieldcardslots.rows[4]],function(rowindex,row){
			cardCount[rowindex] = 0;
			for(var i = 0; i <= 4; i++)
			{
				if(row[i].card != null){cardCount[rowindex]++;}
			}
		});
		return {"top": cardCount[0], "bottom": cardCount[1]};
	}
	,getColCards: function(fieldcardslots,col){
		var colCards = [];
		for(var i = 0; i <= 4; i++){colCards.push(fieldcardslots.rows[i][col]);}
		return colCards;
	}
	,getDiagonalCards: function(fieldcardslots,direction){
		var rowObj = [];
		var colcount = (direction == "lr") ? 0 : 4;
		for(var i = 0; i <= 4; i++)
		{
			rowObj.push(fieldcardslots.rows[i][colcount]);
			//colcount++;
			colcount = (direction == "lr") ? (colcount+1) : (colcount-1);
		}
		return rowObj;
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
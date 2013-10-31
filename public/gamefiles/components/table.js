Crafty.c('table',{
	tabledata: null,
	socket: null,
	allCards: null,
	cards: null,
	fieldcards: null,
	fieldCardslots: null,
	lastPlayedCard: null,
	hitDescription: null,
	hitDescriptionPos: {x: 560, y: 270},
	player: null,
	opponent: null,
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
					1:[[560,25],[660,25],[760,25],[860,25]],
					2:[[560,440],[660,440],[760,440],[860,440]]
				  },
	playerCharPos: {
					1: [830,135],		//player 1
					2: [830,310]		//player 2
				},
	playerHealthPos: {
					1: [560,150],		//player 1
					2: [560,375]		//player 2
				},
    playerNamePos: {
    				1: [560,200],		//player 1
					2: [560,325]		//player 2
    }
	,table: function(cards,data,socket){
		this.cards = cards;
		this.allCards = cards;
		this.tabledata = data;
		this.socket = socket;
		//create player
		this.player = Crafty.e("2D, DOM, player, life, weaponComp, shield");
		this.opponent = Crafty.e("2D, DOM, opponent, life");
		this.fieldcards = this.tabledata.fieldcards;
		this.rules = Crafty.e("Rules");
		this.initSockets(socket);
		return this;
	},
	init: function(){
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
			setCardsOpacity: function(opacity){
				$.each(this.rows,function(key,row){
					$.each(row,function(col,slot){
						if(slot.card){
							slot.card.css("opacity",opacity);
						};
					});
				});
			},
			setCardOpacity: function(data){
				switch(data.mode){
					case "row":
						$.each(this.rows[data.row],function setCardOpacityRow(index,col){
							if(col.card)
								{col.card.css("opacity",data.opacity);}
						});
						break;
					case "col":
						$.each(this.rows,function setCardOpacityCol(index,row){
							if(row[data.col].card)
								{row[data.col].card.css("opacity",data.opacity);}
						});
						break;
					case "diagonal":
						switch(data.direction){
							case "toLeft":
								var col = 4;
								$.each(this.rows,function setCardOpacityDiagonalToLeft(index,row){
									if(row[col].card)
										{row[col].card.css("opacity",data.opacity);}
									col--;
								});
								break;
							case "toRight":
								var col = 0;
								$.each(this.rows,function setCardOpacityDiagonalToRight(index,row){
									if(row[col].card)
										{row[col].card.css("opacity",data.opacity);}
									col++;
								});
								break;
						}
				}
				//this.rows[row][col].card.css("opacity",opacity);
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

		this.lastPlayedCard = {
			card: null,
			row: null,
			col: null,
			resetAll: function(){this.card = null;this.row = null;this.col = null;},
			set: function(card, row, col){this.card = card;this.row = row;this.col = col;}
		};
	}
	,initSockets: function(){
		var that = this;
		this.socket.on("reciveOpponentCards",function onReciveOpponentCards(opponentCardsData){
			var opponentCards = [];
			$.each(opponentCardsData,function(slot,data){
				that.opponent.setHandCard(opponentCardsData[slot]);
				opponentCards.push(data.card.value);
			});
			that.player.removeCardsFromStack(opponentCards);
			that.socketSend("recievedOpponentCards",that.player.drawCards());
		});

		this.socket.on("opponentCardsRecived",function onOpponentCardsRecived(opponentCardsData){
			var opponentCards = [];
			$.each(opponentCardsData,function(slot,data){
				that.opponent.setHandCard(opponentCardsData[slot]);
				opponentCards.push(data.card.value);
			});
			that.player.removeCardsFromStack(opponentCards);
			that.player.startPlaying();
		});

		this.socket.on("sendPlayerCards",function onSendPlayerCards(){
			that.sendPlayerCards();
		});

		this.socket.on("newOpponentHandCards",function onNewOpponentHandCards(handCards){
			var newCards = [];
			$.each(handCards,function setHandCard(count,cardData){
				that.opponent.setHandCard(cardData);
				newCards.push(cardData.card.value);
			});
			that.player.removeCardsFromStack(newCards);
		});

		this.socket.on("getDroppedCard",function onGetDroppedCard(dropData){
			Crafty(dropData.card.value).destroy();
			if(that.lastPlayedCard.card != dropData.card.value && that.lastPlayedCard.card != null){
				that.fieldCardslots.rows[that.lastPlayedCard.row][that.lastPlayedCard.col].card = null;
			}
			that.fieldCardslots.rows[dropData.cardslot.row][dropData.cardslot.col].card = Crafty.e("2D,DOM,Card,"+dropData.card.value).
																								attr({
																									x: that.fieldCardslots.rows[dropData.cardslot.row][dropData.cardslot.col].x+5,
																									y: that.fieldCardslots.rows[dropData.cardslot.row][dropData.cardslot.col].y+5,
																									value: dropData.card.value
																								});
		});
		this.socket.on("takeDamage",function onTakeDamage(hits){
			that.takeDamage(hits,0,function afterTakenDamage(){
				that.socketSend("hitsTaken");
			});
		});

		this.socket.on("tookDamage",function onTookDamage(damageData){
			that.opponent.takeDamage(damageData.damage).updateHealthDisplay();
			that.showHits([damageData],function checksAfterDealingDamages(){});
		});

		this.socket.on("hitsTaken",function onHitsTaken(){
			that.handleTurnEnd();
		});

		this.socket.on("startTurn",function onStartTurn(){
			that.enableFieldcardslots();
			that.opponent.turnOver();
			var newCardsData = that.player.isTurn();
			that.socketSend("newHandCards",newCardsData);
		});

		this.socket.on("newRound",function onNewRound(fieldcardsData){
			that.roundOver(fieldcardsData.fieldcards);
		});

		this.socket.on("playerFinishedRound",function onPlayerFinishedRound(){
			if(that.moves >= 7)
			{
				that.socketSend("newRound");
			}
		});

		this.socket.on("won",function onWon(){
			alert("you won :)");
			//Crafty.scene("win");
		});
	}
		//helper to send via socket
	,socketSend: function(statement,data){
		if(data){this.socket.emit(statement,data);}else{this.socket.emit(statement);}
	}
	,newGame: function(playerdata,opponentdata){
		var that = this;
			//setting up the player cardslots
		$.each(this.playerCardslotsPos,function settingUpCardslots(playerkey,position){
			var playerCardslots = {};
			for(var i=0;i<=position.length-1;i++){
				playerCardslots[i] = Crafty.e("2D, DOM, Cardslot, playercardslot")
										.playercardslot(i)
										.attr({x:position[i][0], y:position[i][1]});
			}
			that.playerCardslots[playerkey] = [];
			that.playerCardslots[playerkey].push(playerCardslots);
			if(playerkey == 1)
				{that.player.cardslots = playerCardslots;}
			else
				{that.opponent.cardslots = playerCardslots;}

		});
			//init player
		this.initPlayer(playerdata,opponentdata,function afterInitPlayer(){
				//start new round
			that.round = 0;
			that.newRound();
		});
	}
	,initPlayer: function(playerdata,opponentdata,callback){
		var that = this;
		//create the player obj
		var playerid = playerdata.id;
		that.player
			.player(
				playerid,							//player "id" (=socketId)
				that,								//link to table
				that.playerCharPos[1],		//position for the avatar
				that.playerHealthPos[1],
				that.playerNamePos[1],
				playerdata.avatar,
				playerdata.name,
				playerdata.isTurn
			);
		//setting the attr for the player obj
		that.player.life(playerdata.health);
		that.player.weaponComp(playerdata.weapon);
		that.player.shield(playerdata.shield);
		that.player.updateHealthDisplay();

		//create the opponent obj
		that.opponent
			.opponent(
				opponentdata.id,
				opponentdata.name,
				that.playerCharPos[2],
				that.playerHealthPos[2],
				that.playerNamePos[2],
				opponentdata.avatar
			);
		that.opponent.life(opponentdata.health);
		that.opponent.updateHealthDisplay();
		callback();
	}
	,newRound: function(){
		if(this.round != 0)									//first round no cards need to be cleard
			{this.clearCards();}

		this.player.resetStackcards();						//remove all cards
		this.player.setCards(Object.create(this.allCards));		    			//give new cards (without the this.giveCards()) to the players stack
		this.giveCards();
		if(this.player.firstTurn){
			this.socketSend("sendPlayerCards",this.player.drawCards());
		}else{
			console.log("not first turn");
			$('.turnBadgeBottom').addClass('turnBadgeBottomTurn');
			//this.opponent.isTurn();
		}

	}
	,clearCards: function(){
		$.each(Crafty("Card"),function destroyCard(key,cardId){			//destroy Card and FieldCardslot elements for new Round
			Crafty(cardId).destroy();
		});
		$.each(Crafty("FieldCardslot"),function destroyFieldCardslot(key,slot){
			Crafty(slot).destroy();
		});

		$.each(this.fieldCardslots.rows,function resetRow(count,row){	//reset the battelfield card slots (enabled = true;taken = false;)
			$.each(row,function(col,slot){
				if(slot.card == null && slot.obj != null){slot.obj.reset();}
			});
		});

		this.fieldCardslots.clearCards();					//delete old cards from all fieldslots
	}
	,sendPlayerCards: function(){
		// this.socketSend("sendPlayerCards",this.player.getHandCards());
	}
	,giveCards: function(fieldcards){
		var that = this;
		var fieldSlots = this.fieldCardslots.getSlots();
		var fieldcardCount = 0;
		var battlecards = [];
		$.each(fieldSlots,function settingUpFieldCardslots(key,row){	//set all fieldcardslots and set pos for fieldcardslots and cardslots
			if(key == 1 || key == 2 || key ==3)
			{

				row[0].obj = Crafty.e("2D,DOM,FieldCardslot,Cardslot").FieldCardslot(key,0).attr({x:row[0].x, y:row[0].y});	//free left and right cardslot
				row[4].obj = Crafty.e("2D,DOM,FieldCardslot,Cardslot").FieldCardslot(key,4).attr({x:row[4].x, y:row[4].y});
				for(var col=1;col<=3;col++)
				{
					var card = Crafty.e("2D, DOM, Card, "+that.fieldcards[fieldcardCount])
								.attr({
									x: row[col].x+5,
									y: row[col].y+5,
									value: that.fieldcards[fieldcardCount]
								});
					row[col].card = card;
					battlecards.push(card.value);
					fieldcardCount++;
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
		this.player.removeCardsFromStack(battlecards);
	}
	,cardDropped: function(card,cardslot){
		var that = this;
			//comes from the event from card element!!! Assures that card is dropped correct
		cardslot.setTaken();														//block slot 'til next round
		this.fieldCardslots.rows[cardslot.row][cardslot.col].card = card;			//set refrents to the dropped card in slot
		this.socketSend("cardDropped",{
										"card": {"value": card.value},
										"cardslot":
										{
											"row": cardslot.row,
											"col": cardslot.col
										}
									});
		if(this.turn.move <= 1)
		{
			if(this.lastPlayedCard.card != null){
				console.log(this.lastPlayedCard.card+" "+this.lastPlayedCard.row+" "+this.lastPlayedCard.col);
				this.fieldCardslots.rows[this.lastPlayedCard.row][this.lastPlayedCard.col].card = null;
			}
			if(card.value != this.lastPlayedCard.card){
				this.turn.move++;
			}
			this.lastPlayedCard.set(card.value, cardslot.row, cardslot.col);
			console.log(this.lastPlayedCard);
			this.limitDropzones(cardslot,this.fieldCardslots);						//set allowed dropps for second card
		}
		if(this.turn.move > 1)
		{
			var that = this;
			this.moves++;
			this.fieldCardslots.setCardsOpacity("1");
			this.checkForHits(cardslot,this.fieldCardslots,function handleHits(hits){			//checking for hits
				if(hits.length > 0)															//if damage -> deal damage
				{
					var damage = [];
					$.each(hits,function getHitDamage(index,hit){
						damage.push({
							"name": hit.name,
							"damage": that.player.attack(hit.label)
						});
					});
					that.socketSend("inflictDamage",damage);
				}
				else
				{
					that.handleTurnEnd();
				}
			});

		}
		console.log(this.fieldCardslots.getSlots());
	}
	,limitDropzones: function(sourceCardslot,fieldcardslots){
		var row = sourceCardslot.row, col = sourceCardslot.col;
		//------------> disable all <----------------
		fieldcardslots.modify('disable');
		fieldcardslots.setCardsOpacity("0.7");
		//------------> enable allowed <----------------
			//easy cols and rows
		if( (row > 0 && row < 4) && (col == 0 || col == 4) )		//horizontal
		{
			if(col == 0){fieldcardslots.rows[row][4].obj.enable();}
			else if(col == 4){fieldcardslots.rows[row][0].obj.enable();}
			fieldcardslots.setCardOpacity({mode: "row",row: row,opacity: "1"});
		}
		else if( (col > 0 && col < 4) && (row == 0 || row == 4) )	//vertical
		{
			if(row == 0){fieldcardslots.rows[4][col].obj.enable();}
			else if(row == 4){fieldcardslots.rows[0][col].obj.enable();}
			fieldcardslots.setCardOpacity({mode: "col",col: col,opacity: "1"});
		}
		else if( (row == 0 || row == 4) && (col == 0 || col == 4) )
		{
			//corners
			if(row == 0 && col == 0)	//top left
			{fieldcardslots.rows[4][4].obj.enable(); fieldcardslots.setCardOpacity({mode: "diagonal",direction: "toRight",opacity: "1"});}
			if(row == 4 && col == 0)	//bottom left
			{fieldcardslots.rows[0][4].obj.enable(); fieldcardslots.setCardOpacity({mode: "diagonal",direction: "toLeft",opacity: "1"});}
			if(row == 0 && col == 4)	//top right
			{fieldcardslots.rows[4][0].obj.enable(); fieldcardslots.setCardOpacity({mode: "diagonal",direction: "toLeft",opacity: "1"});}
			if(row == 4 && col == 4)	//bottom right
			{fieldcardslots.rows[0][0].obj.enable(); fieldcardslots.setCardOpacity({mode: "diagonal",direction: "toRight",opacity: "1"});}
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
	,showHits: function(hits,callback){
		var that = this;
		var hits = hits;
		var hit = hits[0];
		this.displayDamage(hit.name,function afterShowHit(){
			hits.shift();
			if(hits[0] != null)
			{
				that.showHits(hits,callback);
			}
			else
			{
				callback();
			}
		});
	}
	,takeDamage: function(hits,fullDamage,callback){
		var that = this;
		var fullDamage = 0;
		var hits = hits;
		var hit = hits[0];
		var fullDamage = fullDamage + hit.damage;

		var playerHp = this.player.getHp();
		that.player.takeDamage(hit.damage).updateHealthDisplay();
		that.socketSend("tookDamage",{"name": hit.name, "damage": hit.damage});

		this.displayDamage(hit.name,function takingDamage(){
			if( (playerHp - hit.damage) >= 0)
			{
				hits.shift();
				if(hits[0] != null)
					{that.takeDamage(hits,fullDamage,callback);}
				else
					{callback(fullDamage);}
			}
			else
			{
				//that.player.takeDamage(that.player.getHp()-that.player.getHp()).updateHealthDisplay();
				that.socketSend("lose");
				alert("you lost .....");
				// Crafty.scene("lose");
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
		this.turn.move = 0;
		if(this.moves < 7)
			{this.initNewTurn();}
		else
			{	this.initNewTurn();
				this.socketSend("playerFinishedRound");
			}
	}
	,changeTurn: function(){
		this.player.turnOver();
		this.opponent.isTurn();
		this.socketSend("turnOver");
	}
	,initNewTurn: function(){
		this.changeTurn();
		this.enableFieldcardslots();
		this.moves++;
	}
	,enableFieldcardslots: function(){
		$.each(this.fieldCardslots.rows,function enableFieldcardslot(count,row){		//enable all fieldcardslots again
			$.each(row,function(col,slot){
				if(slot.card == null && slot.obj != null){slot.obj.enable();}
			});
		});
	}
	,roundOver: function(newFieldCards){
		this.round++;
		this.lastPlayedCard.resetAll();
		this.fieldcards = newFieldCards;
		this.newRound();
		this.moves = 0;
	}
	,getAdjacentColCardCount: function(fieldcardslots){
		var cardcountL = 0;
		var cardcountR = 0;
		$.each(fieldcardslots.rows,function countAdjacentColCardCount(rowcount,row){
			if(row[0].card != null){cardcountL++;}
			if(row[4].card != null){cardcountR++;}
		});
		return {"left": cardcountL, "right": cardcountR};
	}
	,getAdjacentRowCardCount: function(fieldcardslots){
		var cardCount = [];
		$.each([fieldcardslots.rows[0],fieldcardslots.rows[4]],function countAdjacentRowCardCount(rowindex,row){
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
});
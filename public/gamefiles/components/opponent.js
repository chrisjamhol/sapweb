Crafty.c('opponent',{
	id: null,
	character: null,
	cardslots: [],
	healthDisplay: null,
	opponentnameDisplay: null,
	cardslots: null,
	opponentname: null,

	opponent: function(id,name,charpos,healthPos,namePos,characterId){
		this.id = id;
		this.opponentname = name;
		this.characterId = characterId;
		this.drawChar(charpos);
		this.drawHealth(healthPos);
		this.drawName(namePos);
		return this;
	}
	,setCards: function(cards){
		var that = this;
			//remove old cards
		$.each(Crafty('opponendCard'),function removeOpponentCard(key,cardId){Crafty(cardId).destroy();});
			//set new cards
		$.each(cards,function setOpponentCards(slot,cardvalue){
			if(cardvalue == null){that.cardslots[slot].hasCard = false;}
			else{

				Crafty.e("2D, DOM, opponendCard, "+cardvalue)
					.attr({
						x: that.cardslots[slot].x+5,
						y: that.cardslots[slot].y+5
					});
			}
		});
	}
	,setHandCard: function(cardData){
		this.cardslots[cardData.slot].hasCard = true;
		var newCard = Crafty.e("2D, DOM, opponendCard, "+cardData.card.value)
			.attr({
				x: this.cardslots[cardData.slot].x+5,
				y: this.cardslots[cardData.slot].y+5
			});
	}
	,resetStackcards: function(){
		$.each(this.cardslots,function(key,cardslot){
			cardslot.hasCard = false;
		});
		return this;
	}
	,isTurn: function(){
		$('.turnBadgeBottom').addClass('turnBadgeBottomTurn');
		return this;
	}
	,turnOver: function(){
		$('.turnBadgeBottom').removeClass('turnBadgeBottomTurn');
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
	,drawName: function(namePos){
		this.opponentnameDisplay = Crafty.e('2D,DOM,Text,nameDisplay')
									.attr({x: namePos[0], y: namePos[1]})
									.textFont({
										family: 'PipeDream',
										size: '35px',
										weight: 'bold'
									})
									.textColor('#d83f46', 1)
									.text(this.opponentname);
		return this;
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
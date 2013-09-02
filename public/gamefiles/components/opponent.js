Crafty.c('opponent',{
	id: null,
	character: null,
	cardslots: [],
	healthDisplay: null,
	cardslots: null,

	opponent: function(id,charpos,healthPos,characterId){
		this.id = id;
		this.characterId = characterId;
		this.drawChar(charpos);
		this.drawHealth(healthPos);
		return this;
	}
	,drawCards: function(){
		var limit = Object.keys(this.cardslots).length;
		for(var i=0;i<=limit-1;i++)
		{
			if(this.cardslots[i].hasCard == false)				//each slot without card gets a card
			{
				var that = this;
				var randnumber = Math.floor((Math.random()*this.stackcards.length));		//random card from stack
				var newCard = Crafty.e("2D, DOM, Card, "+this.stackcards[randnumber])
								.Card(this.table)
								.attr({
									x: this.cardslots[i].x+5,
									y: this.cardslots[i].y+5,
									value: this.stackcards[randnumber],
									sourceCardslot: i
								});
				this.acitvecards.push(newCard);
				this.cardslots[i]['hasCard'] = true;
				this.stackcards.splice(randnumber,1);
			}
		}




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
	,resetStackcards: function(){
		$.each(this.cardslots,function(key,cardslot){
			cardslot.hasCard = false;
		});
		return this;
	}
	,isTurn: function(){
		// this.drawCards();
		// $.each(this.acitvecards,function(key,card){
		// 	card.enableDrag();
		// });
		// return this;
	}
	,turnOver: function(){
		// $.each(this.acitvecards,function(key,card){
		// 	card.disableDrag();
		// });
		// return this;
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
	,updateHealthDisplay: function(newHp){
		this.healthDisplay.text(newHp);
		return this;
	}
});
Crafty.c('Rules',{
	hands: null,
	init: function(){
		this.hands = {
			straightflush: this.straightflush,
			fourofakind: this.fourofakind,
			fullhouse: this.fullhouse,
			flush: this.flush,
			staight: this.staight,
			threeofakind: this.threeofakind,
			twopair: this.twopair,
			onepair: this.onepair
			//,highcard: {}
		}
	}
	,check: function(lastCard){
		var affectedCards = this.getAffectedCards(lastCard);
			//check for highest hand
		$.each(this.hands,function(key,hand){
			if(hand())
			{

			}
		});
	}
	,getAffectedCards: function(lastCard){
		var startRow = lastCard.row;
		var startCol = lastCard.col;
		//return cards[];
	}
	,straightflush: function(){

	return false;
	},
	fourofakind: function(){

		return false;
	},
	fullhouse: function(){

		return false;
	},
	flush: function(){

		return false;
	},
	staight: function(){

		return false;
	},
	threeofakind: function(){

		return false;
	},
	twopair: function(){

		return false;
	},
	onepair: function(){

		return false;
	}
});
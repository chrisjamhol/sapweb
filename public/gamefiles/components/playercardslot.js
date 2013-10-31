Crafty.c('playercardslot',{
	id: null,
	cardSet: null,
	playercardslot: function(id){
		this.id = id;
		return this;
	},
	hasCard: function(){this.cardSet = true;},
	hasNoCard: function(){this.cardSet = false;},
	checkHasCard: function(){return this.cardSet;}
});
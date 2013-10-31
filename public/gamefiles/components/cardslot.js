Crafty.c('Cardslot',{
	id: null,
	hasCard: null,
	Cardslot: function(id){
		this.id = id;
		return this;
	},
	hasCard: function(){this.hasCard = true;},
	hasNoCard: function(){this.hasCard = false;},
	checkHasCard: function(){return this.hasCard;}
});
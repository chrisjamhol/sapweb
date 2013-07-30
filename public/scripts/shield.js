Crafty.c('shield',{
	value: null,
	shield: function(shield){
		this.value = shield;
		return this;
	},
	getShield: function(){
		return this.value;
	}
});
Crafty.c('weaponComp',{
	weapon: null,
	weaponComp: function(name){
		this.weapon = Crafty.e(name);
		return this;
	}
	,attack: function(hand){
		return this.weapon[hand];
	}
});
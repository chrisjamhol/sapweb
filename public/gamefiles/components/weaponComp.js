Crafty.c('weaponComp',{
	attk: null,
	weapon: null,
	weaponComp: function(attk,name){
		this.attk = attk;
		this.weapon = Crafty.e(name);
		return this;
	}
	,attack: function(hand){
		return this.weapon[hand];
	}
});
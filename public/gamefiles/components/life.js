Crafty.c('life',{
	hp: null,
	life: function(hp){
		this.hp = hp;
		return this;
	}
	,heal: function(points){this.hp += points;}
	,takeDamage: function(points){this.hp -= points;}
	,getHp: function(){return this.hp;}
});
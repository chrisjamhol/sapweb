Crafty.c('life',{
	hp: null,
	life: function(hp){
		this.hp = hp;
		return this;
	}
	,heal: function(points){this.hp += points;return this;}
	,takeDamage: function(points){this.hp -= points;return this;}
	,getHp: function(){return this.hp;}
});
Crafty.c('weapon',{
	attk: null,
	weapon: function(attk){
		this.attk = attk;
		return this;
	}
	,use: function(){
		return this.attk;
	}
});
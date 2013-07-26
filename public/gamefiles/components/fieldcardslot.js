Crafty.c('FieldCardslot',{
	row: null,
	col: null,
	enabled: null,
	taken: null,
	FieldCardslot: function(row,col){
		this.row = row;
		this.col = col;
		this.enabled = true;
		this.taken = false;
		return this;
	}
	,disable: function(){
		this.enabled = false;
	}
	,enable: function(){
		this.enabled = true;
	}
	,setTaken: function(){this.taken = true;}
	,checkEnabled: function(){return this.enabled;}
	,checkTaken: function(){return this.taken;}
	,reset: function(){
		this.enabled = true;
		this.taken = false;
	}
});
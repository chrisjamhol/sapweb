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
	,check: function(rows){
		var hits = [];
		var that = this;
		$.each(rows,function(key,row){
			$.each(that.hands,function(count,hand){
				var result = hand();
				if(result.hit)
					{hits.push(result);}
			});
		});
		return hits;
	}
	,straightflush: function(){
		var result = {hit:true};
		return result;
	},
	fourofakind: function(){
		var result = {hit:false};
		return result;
	},
	fullhouse: function(){
		var result = {hit:false};
		return result;
	},
	flush: function(){
		var result = {hit:false};
		return result;
	},
	staight: function(){
		var result = {hit:false};
		return result;
	},
	threeofakind: function(){
		var result = {hit:false};
		return result;
	},
	twopair: function(){
		var result = {hit:false};
		return result;
	},
	onepair: function(){
		var result = {hit:false};
		return result;
	}
});
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
			// $.each(that.hands,function(count,hand){
			// 	var result = hand();
			// 	if(result.hit)
			// 		{hits.push(result);}
			// });
		//switch highest occurrences
			var occurrences = this.countOccurrences(row);
			switch(occurrences){
			//--- highest occurrences: 1	----------------------------------------------------
				case 1:

					break;
			//--- highest occurrences: 2	----------------------------------------------------
				case 2:
					//is two pair?
						//if()
						// {

						// }
						// else if()
						// {

						// }
					break;
			//--- highest occurrences: 3 ----------------------------------------------------
				case 3:

					break;
			//--- highest occurrences: 4 ----------------------------------------------------
				case 4:
					hits.push({
						rank:7,
						type: "Four of a Kind"
					});
					break;
			}

			//check for flush

		});
		return hits;
	}
	,countOccurrences: function(row){
		//count occurrences
		 	var highest = {2:3,a:2};
		var occ = {};
		row.forEach(function(key,value){
			if(typeof(occ[value]) !== "undefinded")
			{
				occ[value]++;
			}
			else
			{
				occ.push({value: 1});
			}
		});
		occ.forEach(function(key,value){
			if(typeof(occ.high) == "undefinded" || (typeof(occ.high) != "undefinded") && occ.high <= value)
			{
				occ['high'] = value;
			}
		});

		return occ;
	}


	// ,straightflush: function(){
	// 	var rank = 8;
	// 	var result = {hit:true};
	// 	return result;
	// },
	// fourofakind: function(){
	// 	var rank = 7;
	// 	var result = {hit:false};
	// 	return result;
	// },
	// fullhouse: function(){
	// 	var rank = 6;
	// 	var result = {hit:false};
	// 	return result;
	// },
	// flush: function(){
	// 	var rank = 5;
	// 	var result = {hit:false};
	// 	return result;
	// },
	// staight: function(){
	// 	var rank = 4;
	// 	var result = {hit:false};
	// 	return result;
	// },
	// threeofakind: function(){
	// 	var rank = 3;
	// 	var result = {hit:false};
	// 	return result;
	// },
	// twopair: function(){
	// 	var rank = 2;
	// 	var result = {hit:false};
	// 	return result;
	// },
	// onepair: function(){
	// 	var rank = 1;
	// 	var result = {hit:false};
	// 	return result;
	// }
});
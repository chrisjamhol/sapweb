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
		console.log("checking");
		$.each(rows,function(key,row){
			// $.each(that.hands,function(count,hand){
			// 	var result = hand();
			// 	if(result.hit)
			// 		{hits.push(result);}
			// });
		//switch highest occurrences
			var occurrences = that.countOccurrences(row);
			console.log(occurrences);
			switch(occurrences.diff){
			//--- different cards: 1	----------------------------------------------------
				case 5:

					break;
			//--- highest occurrences: 2	----------------------------------------------------
				case 4:
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
				case 2:

					break;
			}
			/*
				hits.push({
						rank:7,
						type: "Four of a Kind"
					});
			*/
			//check for flush

		});
		return hits;
	}
	,countOccurrences: function(row){
		//count occurrences
		 	var highest = {2:3,a:2};
		var occ = {};
		var suits = {};
		occ['high'] = {count: 0,value: null};
		occ['values'] = {};
		occ['suits'] = {};
		$.each(row,function(key,slot){
			var suit = slot.card.value[0];
			var value = slot.card.value[1];
			if(typeof(occ.values[value]) != "undefined")
			{
				occ.values[value]++;
			}
			else
			{
				occ.values[value] = 1;
			}
			if(typeof(occ.suits[suit]) != "undefined")
			{
				occ.suits[suit]++;
			}
			else
			{
				occ.suits[suit] = 1;
			}
		});
		$.each(occ.values,function(key,value){
			if(typeof(occ.high) == "undefined" || (typeof(occ.high) != "undefined") && occ.high.count <= value)
			{
				occ.high['count'] = value;
				occ.high['value'] = key;
			}
		});
		occ['diff'] = Object.keys(occ.values).length;
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
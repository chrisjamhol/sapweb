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
		}
	}
	,check: function(rows){
		var hits = [];
		var that = this;
		$.each(rows,function(key,row){
		//switch highest occurrences
			var occ = that.countOccurrences(row);
			var result = {rank:null,name:null}
			//--- testcase -----
					// occ = {
					// 		diff: 5,
					// 		jocker: 1,
					// 		high:   {
					// 					count: 1,
					// 					value: 8
					// 			    },
					// 		suits:  {
					// 					c: 4,
					// 					j: 1
					// 		        },
					// 		values: {
					// 					8: 1,
					// 					7: 1,
					// 					6: 1,
					// 					5: 1,
					// 					1: 1
					// 				}
					// 	  };
			//--- /testcase ----
			switch(occ.diff){
			//--- different card values: 1	----------------------------------------------------
					//staight
				case 5:
					var failsafe = false;
					var limit = occ.high.value-5;
					var takenJocker = 0;
					for (var i = occ.high.value; i > limit; i--) {	//straight
						if(typeof(occ.values[i]) == "undefined")
						{
							if(occ.jocker && takenJocker < occ.jocker)
								{takenJocker++;}
							else
								{failsafe = true;}
						}
						else
							{failsafe = false;}

						if(failsafe){break;}
					};
					if(failsafe == false)
					{
						result.rank = 4;
						result.name = "Staight";
					}
					else	//check jocker
					{
						if(occ.jocker)		//one pair
						{
							result.rank = 1;
							result.name = "One Pair";
						}
					}
					break;
			//--- different card values: 4	----------------------------------------------------
					//pair
				case 4:
					if(occ.jocker)		//one pair
					{
						result.rank = 3;
						result.name = "Three of a Kind";
					}
					else
					{
						result.rank = 1;
						result.name = "One Pair";
					}
					break;

			//--- different card values: 3 ----------------------------------------------------
					//three of a kind
					//two pair
				case 3:
					if(occ.high.count == 3)	//three of a kind
					{
						if(occ.jocker)
						{
							result.rank = 7;
							result.name = "Four of a kind";
						}
						else
						{
							result.rank = 3;
							result.name = "Three of a kind";
						}
					}
					else if(occ.high.count == 2) //two pair
					{
						if(occ.jocker)
						{
							result.rank = 6;
							result.name = "Full House";
						}
						else
						{
							result.rank = 2;
							result.name = "Two Pair";
						}
					}
					break;

			//--- different card values: 2 ----------------------------------------------------
					//four of a kind
					//full house
				case 2:
					if(occ.high.count == 4)
					{
						if(occ.jocker)
						{
							result.rank = 7;
							result.name= "Four of a Kind";
						}
						else
						{
							result.rank = 9;
							result.name = "Five of a Kind";
						}
					}
					else if(occ.high.count == 3)
					{
						result.rank = 6;
						result.name= "Full House";
					}
					break;
			}

			//--- flush variants ----------------------------------------------------
			if(Object.keys(occ.suits).length == 1)
			{
				if(result.rank == 4)		//straight flush
				{
					result.rank = 8;
					result.name = "Staight Flush";
				}
				else if(result.rank < 5)	//flush
				{
					result.rank = 5;
					result.name = "Flush";
				}
			}

			if(result.rank != null){hits.push(result);}
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
			var value = (slot.card.value.length == 3) ? slot.card.value[1]+slot.card.value[2] : slot.card.value[1];
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

		// jocker
		if(typeof(occ.suits.j) != "undefined")
		{
			occ['jocker'] = occ.suits.j;
			delete occ.suits.j;
		}
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
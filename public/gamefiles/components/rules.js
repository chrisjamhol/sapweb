Crafty.c('Rules',{
	check: function(rows){
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
						result.label = "staight";
					}
					else	//check jocker
					{
						if(occ.jocker)		//one pair
						{
							result.rank = 1;
							result.name = "One Pair";
							result.label = "onepair";
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
						result.label = "threeofakind";
					}
					else
					{
						result.rank = 1;
						result.name = "One Pair";
						result.label = "onepair";
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
							result.label = "fourofakind";
						}
						else
						{
							result.rank = 3;
							result.name = "Three of a kind";
							result.label = "threeofakind";
						}
					}
					else if(occ.high.count == 2) //two pair
					{
						if(occ.jocker)
						{
							result.rank = 6;
							result.name = "Full House";
							result.label = "fullhouse";
						}
						else
						{
							result.rank = 2;
							result.name = "Two Pair";
							result.label = "twopair";
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
							result.label = "fourofakind";
						}
						else
						{
							result.rank = 9;
							result.name = "Five of a Kind";
							result.label = "fiveofakind";
						}
					}
					else if(occ.high.count == 3)
					{
						result.rank = 6;
						result.name= "Full House";
						result.label = "fullhouse";
					}
					break;
			}

			//--- flush variants ----------------------------------------------------
			if(Object.keys(occ.suits).length == 1)
			{
				if(result.rank == 4)		//staight flush
				{
					result.rank = 8;
					result.name = "Staight Flush";
					result.label = "straightflush";
				}
				else if(result.rank < 5)	//flush
				{
					result.rank = 5;
					result.name = "Flush";
					result.label = "flush";
				}
			}

			if(result.rank != null){hits.push(result);}
		});
		// hits = [{"rank":8,"name":"Staight Flush","label":"straightflush"},
		// 		{"rank":1,"name":"One Pair","label":"onepair"},
		// 		{"rank":4,"name":"Staight","label":"staight"}];
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
});
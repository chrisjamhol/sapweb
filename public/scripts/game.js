Game = {
	start: function()
	{
		var spritepath = "/public/gamefiles/sprites/";
		var gamefilespath = "/public/gamefiles/";
		loadComponents(['fps','card','player','table','rules','fieldcardslot'],function(){
			var cards = [];
			Crafty.init(1000, 563);
			// Crafty.e("FPS")
			// 	.FPS('frame', 1);
			//Crafty.canvas();
				// c clubs
				// d dimonds
				// h heats
				// s spades

				// j jack
				// q qeen
				// k king
				// a ass

			//load cards
			var cardsrows = 14+1;// -> offset because start is 2
			var cardspos = {};
			for(var i=2; i<=cardsrows;i++){
				var pos1 = [0,i-2];
				var pos2 = [1,i-2];
				var pos3 = [2,i-2];
				var pos4 = [3,i-2];

				if(i == 2)			//2's cards
				{cardspos["c"+2] = [0,0];cardspos["d"+2] = [1,0];cardspos["h"+2] = [2,0];cardspos["s"+2] = [3,0];}
				// else if(i <= 10)	//numberd cards
				// 	{cardspos["c"+i] = pos1;cardspos["d"+i] = pos2;cardspos["h"+i] = pos3;cardspos["s"+i] = pos4;}
				else if(i == 11)	//aces
					{cardspos["ac"] = pos1;cardspos["ad"] = pos2;cardspos["ah"] = pos3;cardspos["as"] = pos4;}
				else if(i == 12)	//jackes
					{cardspos["jc"] = pos1;cardspos["jd"] = pos2;cardspos["jh"] = pos3;cardspos["js"] = pos4;}
				else if(i == 13)	//kings
					{cardspos["kc"] = pos1;cardspos["kd"] = pos2;cardspos["kh"] = pos3;cardspos["ks"] = pos4;}
				else if(i == 14)	//queens
					{cardspos["qc"] = pos1;cardspos["qd"] = pos2;cardspos["qh"] = pos3;cardspos["qs"] = pos4;}
				else if(i == 15)	//jocker
				{
					var jokerCount = 2;
					for(var j=1; j<=jokerCount;j++)
					{cardspos["j"+j] = pos1;}
				}
			}
			Crafty.sprite(60,72,spritepath+"cards/cards.png",cardspos,0);
			//save all avalible cards in cards[]
			$.each(cardspos,function(key,pos){cards.push(key);});
			//end load cards
Crafty.sprite(50,50,"http://www.shoutmeloud.com/wp-content/uploads/2011/09/css-sprites.png?9792e1",{'icon':[2,2]});
Crafty.sprite(60,73,'C:/xampp/htdocs/workspace/sapweb/public/gamefiles/sprites/test.png',{'test':[0,0]});
			//other sprites
			Crafty.sprite(70,83,gamefilespath+'images/cardslot.png',{'Cardslot':[0,0]},0);

			//the loading screen that will display while our assets load
			Crafty.scene("loading", function() {
				//Crafty.background("#FFF");
				var itemsToLoad = [
									spritepath+"cards/cards.png",
									'C:/xampp/htdocs/workspace/sapweb/public/gamefiles/sprites/test.png'
								  ];
				Crafty.load(itemsToLoad, function() {
					cacheImages(itemsToLoad);
					Crafty.scene("main"); //after loading the icons, load main
				},function(e){console.log(e);});
			});
			Crafty.scene("loading");

			Crafty.scene("main", function() {
			Crafty.background("url('"+gamefilespath+"background/background1.png')");
			Crafty.e("2D,DOM,test,Draggable");
			Crafty.e("2D,DOM,icon,Draggable");
				var playercount = 2;
				var table = Crafty.e("2D,DOM,table").table(cards,playercount);
				table.newGame();
			});
		});

		function cacheImages(itemsToLoad){
			$.each(itemsToLoad,function(){

			});
		}

		function loadComponents(components,callback){
			var loaded = 0;	var compLenght = components.length;
			for(var i=0; i<=compLenght-1;i++)
			{
				$.getScript(gamefilespath+'components/'+components[i]+'.js',function(){
					//continue if all components are loaded
					if(loaded == compLenght-1){callback();}else{loaded++;}
				});
			}
		}
	}
}
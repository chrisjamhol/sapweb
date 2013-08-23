Game = {
	starttest: function(tabledata,playerdata,opponentdata){
		console.log(tabledata);		//fieldcards
		console.log(playerdata);
		console.log(opponentdata);
	},
	start: function startGame(tabledata,playerdata,opponentdata,firstTurn,socket)
	{
		var tabledata = tabledata,
			playerdata = playerdata,
			opponentdata = opponentdata,
			firstTurn = firstTurn
			socket = socket;

		Crafty.winner = null;
		//var spritepath = "/public/gamefiles/sprites/";
		var spritepath = "http://192.168.1.222/webroot_chris/test/"
		var gamefilespath = "/public/gamefiles/";
		loadComponents(['card','player','opponent','table','rules','fieldcardslot','life','weaponComp','shield'
							,'weapons/w_stick'
							,'weapons/w_mightyhammer'],function afterLoadComp(){
			var cards = [];
			Crafty.init(1000, 563, 'crafty_stage');

				//load cards (sprite)
			var cardspos = loadCardSprite();
			Crafty.sprite(60,72,spritepath+"cards/cards.png",cardspos,0);
				//save all avalible cards in cards[]
			$.each(cardspos,function(key,pos){cards.push(key);});

			//load player sprites
			Crafty.sprite(98,120,spritepath+"characters/monsters.png",
				{
					"playerchar0": [0,0],
					"playerchar1": [1,0]
				},0);

			//other sprites
			Crafty.sprite(70,83,gamefilespath+'images/cardslot.png',{'Cardslot':[0,0]},0);

			//the loading screen that will display while our assets load
			Crafty.scene("loading", function sceneLoading() {
				var itemsToLoad = [
									spritepath+"cards/cards.png"
								  ];
				Crafty.load(itemsToLoad, function loadSceneMain() {
					Crafty.scene("main");
				},function(e){
					//console.log(e);
				});
			});

			Crafty.scene("main", function sceneMain() {
				Crafty.e("2D,DOM,Image").image(gamefilespath+'background/background1.png').attr({z:-1});
				var table = Crafty.e("2D,DOM,table").table(cards,tabledata,socket);
				table.newGame(playerdata,opponentdata,firstTurn);
			});

			Crafty.scene("won",function sceneWon(){
				Crafty.background('#000000');
				Crafty.e("2D,DOM,Text,winner")
								.attr({
									x: 422,
									y: 200
								})
								.textFont({
									family: 'PipeDream',
									size: '35px',
									weight: 'bold'
								})
								.textColor('#FFFFFF',1)
								.text("winner: <br />Player "+Crafty.winner);

				var replayButton = Crafty.e("2D, DOM, Image, Mouse")
									.image(gamefilespath+'images/replayButton.png')
									.attr({x:347,y:300})
									.bind('MouseUp',function(){
										Crafty.scene("main");
									});

				Crafty.e("2D,DOM,Text,winner")
								.attr({
									x: 452,
									y: 308
								})
								.textFont({
									family: 'PipeDream',
									size: '30px',
									weight: 'bold'
								})
								.textColor('#000000',1)
								.text("replay");
				console.log(Crafty.winner);
			});

			Crafty.scene("loading");
		});

		function loadCardSprite(){
			// c clubs		h heats
			// d dimonds	s spades
			var cardsrows = 14+1;	// -> offset because start is 2
			var cardspos = {};		//cardpos on sprite
			for(var i=2; i<=cardsrows;i++){
				var pos1 = [0,i-2];		var pos2 = [1,i-2];
				var pos3 = [2,i-2];		var pos4 = [3,i-2];

				if(i == 2)			//2's cards
					{cardspos["c"+2] = [0,0];cardspos["d"+2] = [1,0];cardspos["h"+2] = [2,0];cardspos["s"+2] = [3,0];}
				else if(i <= 10)	//numberd cards
					{cardspos["c"+i] = pos1;cardspos["d"+i] = pos2;cardspos["h"+i] = pos3;cardspos["s"+i] = pos4;}
				else if(i == 11)	//aces
					{cardspos["c14"] = pos1;cardspos["d14"] = pos2;cardspos["h14"] = pos3;cardspos["s14"] = pos4;}
				else if(i == 12)	//jackes
					{cardspos["c11"] = pos1;cardspos["d11"] = pos2;cardspos["h11"] = pos3;cardspos["s11"] = pos4;}
				else if(i == 13)	//kings
					{cardspos["c13"] = pos1;cardspos["d13"] = pos2;cardspos["h13"] = pos3;cardspos["s13"] = pos4;}
				else if(i == 14)	//queens
					{cardspos["c12"] = pos1;cardspos["d12"] = pos2;cardspos["h12"] = pos3;cardspos["s12"] = pos4;}
				else if(i == 15)	//jocker
				{
					var jokerCount = 2;
					for(var j=1; j<=jokerCount;j++)
					{cardspos["j1"] = pos1;}
				}
			}
			return cardspos;
		}

		function loadComponents(components,callback){
			var loaded = 0;	var compLenght = components.length-1;
			for(var i=0; i<=compLenght;i++)
			{
				$.getScript(gamefilespath+'components/'+components[i]+'.js',function loadScripts(){
					//continue if all components are loaded
					if(loaded == compLenght){callback();}else{loaded++;}
				}).fail(function(){
					console.log("faild to load (parseError??)");
				});
			}
		}
	}
}
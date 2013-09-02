module.exports = function(cards){
	var cards = cards;
	var Player = require('./Player');
	var players =  {};
	var matches = [];

	var addPlayer = function(id,playerdata){
			//create Player
		if(players[id] != null){players[id] == null;}
		players[id] = Player().create(id,playerdata);
		findMatch(id);
		return players[id];
	}

	var giveCards = function(){
		var cardDeck = shuffle(cards);
		var handcards = [];
			//common cards for players on the battelfield
		for(var i = 8; i >= 0; i--){
			var randnumber = Math.floor((Math.random()*cardDeck.length));
			handcards.push(cardDeck[randnumber]);
			cardDeck.splice(randnumber,1);
		}
		return {"fieldcards": handcards};
	}

	var removePlayer = function(playerId){
		players.splice(players.indexOf(playerId), 1);
	}

	var getPlayers = function(){return players;}
	var getPlayerById = function(id){return players[id];}

	var getOpponentIdFrom = function(id){
		var opponentId = null;
		matches.forEach(function(match,key){
			if(match[0] == id || match[1] == id){
				opponentId = [match[0],match[1]];
			}
		});
		return opponentId;
	}

	var findMatch = function(id){
		var playerMatched = false;
		var foundMatch = null;
		matches.forEach(function(match,key){
			if(match[1] == null){
				playerMatched = true;
				match[1] = id;
				getPlayerById(id).setPlayerNumber(2);
				if(match['firstTurn'] == 1){getPlayerById(id).isTurn();}else{getPlayerById(id).turnOver();}
				foundMatch = match;
				return false;
			}
		});
		if(!playerMatched)
		{
			var firstTurn = createFirstTurn();
			matches.push({"0": id, "1": null, "firstTurn": firstTurn});
			getPlayerById(id).setPlayerNumber(1);
			if(firstTurn == 0){getPlayerById(id).isTurn();}else{getPlayerById(id).turnOver();}
		}
	}

	var shuffle = function(cards){
		var cardstack = cards;
		var currentIndex = cardstack.length
	    , temporaryValue
	    , randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = cardstack[currentIndex];
			cardstack[currentIndex] = cardstack[randomIndex];
			cardstack[randomIndex] = temporaryValue;
		}
		return cardstack;
	}

	var createFirstTurn = function(){return Math.floor((Math.random()*2));}
	var getFirstTurn = function(match){

	}

		//expose
	return {
		addPlayer: addPlayer
		,getPlayers: getPlayers
		,getPlayerById: getPlayerById
		,removePlayer: removePlayer
		,getOpponentIdFrom: getOpponentIdFrom
		,giveCards: giveCards
		,getFirstTurn: getFirstTurn
	}
}

module.exports = function(){
	var player = null;
	var count = 0;

	var create = function(id,playerdata){
		player = {
			id: id,
			isTurn: null,
			name: playerdata.name,
			avatar: playerdata.avatar,
			health: 120,
			shield: 20,
			weapon: "w_stick",
			playernumber: null

			,setPlayerNumber: function(playernumber){
				this.playernumber = playernumber;
			}
			,getPlayer: function(){
				return this;
			}
			,checkIfTurn: function(){return this.isTurn;}
			,isTurn: function(){this.isTurn = true;}
			,turnOver: function(){this.isTurn = false;}
		};
		return player;
	}

	return {
		create: create
	}
}
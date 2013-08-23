module.exports = function(){
	var player = null;
	var count = 0;

	var create = function(id,playerdata){
		player = {
			id: id,
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
		};
		return player;
	}

	return {
		create: create
	}
}
$('document').ready(function onDocumentReady(){
	var playerdata = null;
	var opponentData = null;
	var tabledata = null;
	var logoninfo = null;
	var socket = io.connect('http://localhost');

	socket.on("loggedin",onUserLoggedIn);
	socket.on("getOpponentData",onGetOpponentData);
	socket.on("getTableData",onGetTableData);

	$('#playerloginButton').click(function clickedLogin(){
		var playername = $('#login_name').val();
		var playeravatar = $('#login_avatar').val();
		if(playername != ""){
			logoninfo = {"name": playername, "avatar": playeravatar};
			socket.emit('login',logoninfo);
		}
	});

	function onUserLoggedIn(player){
		$('.waitingDisplay').show();
		playerdata = player;
		socket.emit("getOpponentData");
	}

	function onGetOpponentData(opponent){opponentData = opponent;}

	function onGetTableData(table){
		$('.waitingDisplay').hide();
		tabledata = table;
			// console.log(tabledata);
			// console.log(playerdata);
			// console.log(opponentData);
		Game.start(tabledata,playerdata,opponentData,socket);
		$('#logon').hide();
	}
});
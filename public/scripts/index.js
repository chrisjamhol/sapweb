$('document').ready(function onDocumentReady(){
	var playerdata = null;
	var opponentData = null;
	var tabledata = null;
	var logoninfo = null;
	var socket = io.connect(sockethost);

	socket.on("disconnected",onDisconnect);
	socket.on("loggedin",onUserLoggedIn);
	socket.on("getOpponentData",onGetOpponentData);
	socket.on("getTableData",onGetTableData);

	$('#logon_form_form').submit(function clickedLogin(event){
		event.preventDefault();
		var playername = $('#login_name').val();
		var playeravatar = $('.logon_form_avatar_chosen').data("avatar");
		if(playername != ""){
			logoninfo = {"name": playername, "avatar": playeravatar};
			socket.emit('login',logoninfo);
			$('.playButton').val('Waiting for Opponent');
		}
	});

	$('.logon_form_avatar').click(function avatarClicked(){
		console.log("clicked avartar");
		$('.logon_form_avatar_chosen').removeClass("logon_form_avatar_chosen");
		$(this).addClass("logon_form_avatar_chosen");
	});

	function onDisconnect(){
		location.reload();
	}

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
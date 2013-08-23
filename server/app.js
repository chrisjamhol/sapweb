var fs = require('fs')
    path = require('path');
var config = JSON.parse(fs.readFileSync("config.json"));

var __modelsPath = path.join(__dirname, '../' , 'models/');
  //create express server
var express = require('express')
    ,app = express()
    ,routes = require('./routes/routes')(app,config.publicPaths)
    ,http = require('http')
    ,server = http.createServer(app)
    ,io = require('socket.io').listen(server).set('log level',2)
    ,gamemaster = require('./gamemaster')(config.cards);
    server.listen(config.server.port,config.server.host);
    console.log("Server started on: "+config.server.host+":"+config.server.port);
configExpress(app);

function init(){
    // Start listening for events
    setEventHandlers();
}

var setEventHandlers = function() {
    // Socket.IO
    io.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client){
    //client.on("disconnect",function(){onClientDisconnect(client.id);});
    client.on("login",onLoginUser);
    client.on("getPlayerData",onGetPlayerData);
    client.on("getOpponentData",onGetOpponentData);
    client.on("getCards",onGetCards);
    client.on("turnOver",onTurnOver);
    client.on("cardsDropped",onCardsDropped);
    client.on("getOpponentCards",onGetOpponentCards);
    client.on("sendPlayerCards",onSendPlayerCards);
}

function onClientDisconnect(playerId){gamemaster.removePlayer(playerId);}

function onLoginUser(playerdata){
    //console.log(playerdata);
    var player = gamemaster.addPlayer(this.id,playerdata);
    this.emit("loggedin",player);
}

function onGetPlayerData(){
    var player = gamemaster.getPlayerById(this.id);
    this.emit("getPlayerData",player);
}

function onGetOpponentData(){
    var opponentIds = gamemaster.getOpponentIdFrom(this.id);
    if(opponentIds[0] && opponentIds[1])
    {
        var fieldCards = gamemaster.giveCards();
        var firstTurn = gamemaster.getFirstTurn();
        console.log(firstTurn);
        var otherPlayerId = (this.id == opponentIds[0]) ? opponentIds[1] : opponentIds[0];
            //send player data
        this.emit("getOpponentData",gamemaster.getPlayerById(otherPlayerId));
        io.sockets.socket(otherPlayerId).emit("getOpponentData",gamemaster.getPlayerById(this.id));
            //send commoun cards
        this.emit("getTableData",fieldCards);
        io.sockets.socket(otherPlayerId).emit("getTableData",fieldCards);
            //send who's turn
        this.emit("getFirstTurn",firstTurn);
        io.sockets.socket(otherPlayerId).emit("getFirstTurn",firstTurn);
    }
}

function onGetOpponentCards(){
    console.log("getOpponentCards from "+this.id);
    var opponentIds = gamemaster.getOpponentIdFrom(this.id);
    var otherPlayerId = (this.id == opponentIds[0]) ? opponentIds[1] : opponentIds[0];
    console.log("sendPlayerCards send to "+otherPlayerId);
    io.sockets.socket(otherPlayerId).emit("sendPlayerCards");
}

function onSendPlayerCards(playerCards){
    console.log("sendPlayerCards from "+this.id);
    var opponentIds = gamemaster.getOpponentIdFrom(this.id);
    var otherPlayerId = (this.id == opponentIds[0]) ? opponentIds[1] : opponentIds[0];
    console.log("this.id: "+this.id);
    console.log("otherPlayerId: "+otherPlayerId);
    io.sockets.socket(otherPlayerId).emit("reciveOpponentCards",playerCards);
    console.log(playerCards);
    console.log("send to "+otherPlayerId);
}

function onGetCards(){
    var cards = gamemaster.giveCards();
    this.emit("getCards",cards);
}

function onTurnOver(){
    //handle card dropp from opponent and handle turn
    gamemaster.turnOver(opponentAction);
}

function onCardsDropped(){

}

function configExpress(app){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(app.router);
    app.use(express.compress());
    app.use(express.static(publicPaths.publicViewPath));
    app.set('views', publicPaths.publicViewPath);
    app.set('view engine','ejs');
    app.set('view options',{open:"<%",close:"%>"});
}

//starting engines :)
init();
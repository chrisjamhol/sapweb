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

//app.use('/public/gamefiles/sprites/cards/cards.png', static('public/gamefiles/sprites/cards/cards.png',3600) );



app.get('/',function(req,res){
        res.render('index',{sockethost: config.server.host});
});

var static = function(dirname, age) {
    return express.static(path.join(__dirname, dirname), { maxAge: age });
}

function init(){
    // Start listening for events
    setEventHandlers();
}

var setEventHandlers = function() {
    // Socket.IO
    io.sockets.on("connection", onSocketConnection);    
};

function onSocketConnection(client){
    client.on("disconnect",function(){onClientDisconnect(client.id);});
    client.on("login",onLoginUser);
    client.on("getPlayerData",onGetPlayerData);
    client.on("getOpponentData",onGetOpponentData);
    client.on("getCards",onGetCards);
    client.on("turnOver",onTurnOver);
    client.on("newRound",onNewRound);
    client.on("recievedOpponentCards",onRecievedOpponentCards);
    client.on("playerFinishedRound", onPlayerFinishedRound);

    client.on("sendPlayerCards",onSendPlayerCards);
    client.on("newHandCards",onNewHandCards);

    client.on("cardDropped",onCardDropped);
    client.on("inflictDamage",onInflictDamage);
    client.on("tookDamage",onTookDamage);
    client.on("hitsTaken",onHitsTaken);

    client.on("lose",onLose);
}

function onClientDisconnect(playerId){
    var opponentIds = gamemaster.getOpponentIdFrom(playerId);
    if(opponentIds != null){
        if(opponentIds[0] && opponentIds[1]){
            var otherPlayerId = (this.id == opponentIds[0]) ? opponentIds[1] : opponentIds[0];       
            gamemaster.removePlayer(otherPlayerId);
        }
        gamemaster.removePlayer(playerId);
        gamemaster.deleteMatch(gamemaster.getPlayersMatch(playerId));
        io.sockets.socket(otherPlayerId).emit("disconnected");
    } 
   
}

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
        var otherPlayerId = (this.id == opponentIds[0]) ? opponentIds[1] : opponentIds[0];
            //send player data
        this.emit("getOpponentData",gamemaster.getPlayerById(otherPlayerId));
        io.sockets.socket(otherPlayerId).emit("getOpponentData",gamemaster.getPlayerById(this.id));
            //send commoun cards
        this.emit("getTableData",fieldCards);
        io.sockets.socket(otherPlayerId).emit("getTableData",fieldCards);
    }
}

function onSendPlayerCards(playerCards){
    io.sockets.socket(getOtherPlayerId(this.id)).emit("reciveOpponentCards",playerCards);       //player has first turn
}

function onRecievedOpponentCards(opponentCards){
    io.sockets.socket(getOtherPlayerId(this.id)).emit("opponentCardsRecived",opponentCards);    //player has first turn
}

function onNewHandCards(handcards){
    io.sockets.socket(getOtherPlayerId(this.id)).emit("newOpponentHandCards",handcards);
}

function onGetCards(){
    var cards = gamemaster.giveCards();
    this.emit("getCards",cards);
}

function onCardDropped(droppData){
    io.sockets.socket(getOtherPlayerId(this.id)).emit("getDroppedCard",droppData);
}

function onInflictDamage(hits){
    io.sockets.socket(getOtherPlayerId(this.id)).emit("takeDamage",hits);
}

function onTookDamage(damage){
    io.sockets.socket(getOtherPlayerId(this.id)).emit("tookDamage",damage);
}

function onHitsTaken(){
     io.sockets.socket(getOtherPlayerId(this.id)).emit("hitsTaken");
}

function onTurnOver(){
    io.sockets.socket(getOtherPlayerId(this.id)).emit("startTurn");
}

function onNewRound(){
    var fieldCards = gamemaster.giveCards();
    this.emit("newRound",fieldCards);
    io.sockets.socket(getOtherPlayerId(this.id)).emit("newRound",fieldCards);
}

function onPlayerFinishedRound(){
    io.sockets.socket(getOtherPlayerId(this.id)).emit("playerFinishedRound");
}

function onLose(){
    io.sockets.socket(getOtherPlayerId(this.id)).emit("won");
}

function getOtherPlayerId(id){
    var opponentIds = gamemaster.getOpponentIdFrom(id);
    var otherPlayerId = (id == opponentIds[0]) ? opponentIds[1] : opponentIds[0];
    return otherPlayerId;
}

function configExpress(app){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(app.router);
    app.use(express.compress());
    
    app.use(express.static(path.join(__dirname, '../../' , publicPaths.publicSpritesPath), { maxAge: 86400000 }));
    //app.use(express.static(publicPaths.publicViewPath));
    app.set('views', publicPaths.publicViewPath);
    app.set('view engine','ejs');
    app.set('view options',{open:"<%",close:"%>"});
}

//starting engines :)
init();
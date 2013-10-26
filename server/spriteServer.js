fs = require('fs');
http = require('http');
url = require('url');


http.createServer(function(req, res){
  var request = url.parse(req.url, true);
  var action = request.pathname;
  console.log("got request");
  if (action == '/sprites/cards/cards.png') {
     var img = fs.readFileSync('../public/gamefiles/sprites/cards/cards.png');
     res.writeHead(200, {'Content-Type': 'image/png' });
     res.end(img, 'binary');
     console.log("send sprite");
  }
}).listen(7000, '0.0.0.0');
console.log("spriteserver running");
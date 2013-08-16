var fs = require('fs'),
    path = require('path');;
var config = JSON.parse(fs.readFileSync("config.json"));
  //setting up static paths
var __publicPaths = {
    publicViewPath : path.join(__dirname, '../' ,'public/views/'),
    publicScriptPath : path.join(__dirname, '../' , 'public/scripts/'),
    publicStylePath : path.join(__dirname, '../' , 'public/styles/'),
    publicSocketPath : path.join(__dirname, '../' , 'public/scripts/websockets/'),
    publicImagePath : path.join(__dirname, '../' , 'public/images/'),
    publicLibaryPath: path.join(__dirname, '../' , 'public/libary/'),
    publicFontPath: path.join(__dirname, '../' , 'public/fonts/'),
    publicGamefilesPath: path.join(__dirname, '../' , 'public/gamefiles/'),
    publicComponentsPath: path.join(__dirname, '../' , 'public/scripts/gamefiles/components/')
}

var __modelsPath = path.join(__dirname, '../' , 'models/');
  //create express server
var express = require('express')
    ,app = express()
    ,http = require('http')
    ,server = http.createServer(app);
    server.listen(config.server.port,config.server.host);
    console.log("Server started on: "+config.server.host+":"+config.server.port);
  //config express server
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(app.router);
app.use(express.compress());
app.use(express.static(__publicPaths.publicViewPath));
app.set('views', __publicPaths.publicViewPath);
app.set('view engine','ejs');
app.set('view options',{open:"<%",close:"%>"});


//-----routes--------

app.get('/',function(req,res){
    res.render('index');
});

//piping css and js
app.get('/htmlmanifest.appcache',function(req,res){res.sendfile('htmlmanifest.appcache');});
app.get('/public/scripts/:scriptName',function(req,res){res.sendfile(__publicPaths.publicScriptPath+req.params['scriptName']);});
app.get('/public/styles/:styleName',function(req,res){res.sendfile(__publicPaths.publicStylePath+req.params['styleName']);});
app.get('/public/sockets/:socketName',function(req,res){res.sendfile(__publicPaths.publicSocketPath+req.params['socketName']);});
app.get('/public/images/:imageName',function(req,res){console.log(req.params['imageName']);res.sendfile(__publicPaths.publicImagePath+req.params['imageName']);});
app.get('/public/libary/*',function(req,res){res.sendfile(__publicPaths.publicLibaryPath+req.params[0]);});
app.get('/public/fonts/*',function(req,res){res.sendfile(__publicPaths.publicFontPath+req.params[0]);});


//piping gamefiles
app.get('/public/components/*',function(req,res){res.sendfile(__publicPaths.publicComponentsPath+req.params[0]);});
app.get('/public/gamefiles/*',function(req,res){
    //console.log(req.params[0]);
    res.sendfile(__publicPaths.publicGamefilesPath+req.params[0]);
});
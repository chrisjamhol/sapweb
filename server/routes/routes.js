publicPaths = null;

module.exports = function(app,publics){
	var path = require('path');
	  //setting up static paths
	publicPaths = {
	    publicViewPath : path.join(__dirname, '../../' ,publics.views),
	    publicScriptPath : path.join(__dirname, '../../' , publics.scripts),
	    publicStylePath : path.join(__dirname, '../../' , publics.styles),
	    publicSocketPath : path.join(__dirname, '../../' , publics.sockets),
	    publicImagePath : path.join(__dirname, '../../' , publics.images),
	    publicLibaryPath: path.join(__dirname, '../../' , publics.libaries),
	    publicFontPath: path.join(__dirname, '../../' , publics.fonts),
	    publicGamefilesPath: path.join(__dirname, '../../' , publics.gamefiles),
	    publicComponentsPath: path.join(__dirname, '../../' , publics.components)
	}

	//-----routes--------
	app.get('/',function(req,res){
	    res.render('index');
	});

	//piping css and js
	app.get('/htmlmanifest.appcache',function(req,res){res.sendfile('htmlmanifest.appcache');});
	app.get('/public/scripts/:scriptName',function(req,res){res.sendfile(publicPaths.publicScriptPath+req.params['scriptName']);});
	app.get('/public/styles/:styleName',function(req,res){res.sendfile(publicPaths.publicStylePath+req.params['styleName']);});
	app.get('/public/sockets/:socketName',function(req,res){res.sendfile(publicPaths.publicSocketPath+req.params['socketName']);});
	app.get('/public/images/:imageName',function(req,res){res.sendfile(publicPaths.publicImagePath+req.params['imageName']);});
	app.get('/public/libary/*',function(req,res){res.sendfile(publicPaths.publicLibaryPath+req.params[0]);});
	app.get('/public/fonts/*',function(req,res){res.sendfile(publicPaths.publicFontPath+req.params[0]);});


	//piping gamefiles
	app.get('/public/components/*',function(req,res){res.sendfile(publicPaths.publicComponentsPath+req.params[0]);});
	app.get('/public/gamefiles/*',function(req,res){res.sendfile(publicPaths.publicGamefilesPath+req.params[0]);});
}

exports.publicPaths;
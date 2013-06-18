/**
 * Module dependencies.
 */
var config = require('./server/lib/config')
  , fs = require('fs')
  , express = require('express')
  , http = require('http')
  , https = require('https')
  , path = require('path')
  , _ = require('underscore')

// APIs
  , dataAPI = require('./server/routes/data')

var app = express();

var adminAuth = express.basicAuth(config.admin.name, config.admin.password);

if (config.ssl) {
  var certData = {
      key: fs.readFileSync(config.ssl.key),
      cert: fs.readFileSync(config.ssl.cert),
  };
}

 function requireHTTPS(req, res, next) {
     if (!(req.secure || req.headers['x-forwarded-proto'] === 'https')) {
         //FYI this should work for local development as well
         var host = req.get('host');
       var colon = host.indexOf(':');
         host = colon > -1 ? host.substring(0, colon + 1) + config.httpsPort : host;
         return res.redirect('https://' + host + req.url);
     }
     next();
 }

app.configure(function(){
  app.set('port', process.env.PORT || config.httpPort);
  app.set('secureport', process.env.HTTPSPORT || config.httpsPort);
  if (!config.allowHTTP) {
    app.use(requireHTTPS); // forces a secure connection in all environments
  }
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compress());
});

var server, secureserver;

app.configure('production', function(){
  app.use(express.static(path.join(__dirname, 'client')));
});

/* On Heroku, we get one port to use. For this reason, we only use the certData code in the development environment. Heroku handles all of the http -> https redirect for us using the http x-forwarded-proto variable in the header. */
app.configure('development', function(){
  app.use(express.errorHandler());
  secureserver = https.createServer({"key":certData.key, "cert":certData.cert}, app);
  secureserver.listen(app.get('secureport'), function(){
      console.log("Express https server listening on port " + app.get('secureport'));
  });
  app.use(express.static(path.join(__dirname, 'client')));
});

server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log("Express http server listening on port " + app.get('port'));
});


/* ****** ROUTES ******* */

// All requests will go through here
app.get('*', function(req, res, next) {
    // You *should* also be able to add the response headers here, although I haven't tried.
    //console.log('Request received', req);
    next();
});

// REST APIs
app.get(config.api, function(req, res, next) {
    res.send('API is running.');
});

dataAPI.init(app, adminAuth);

// For pushState support, always send our index.html
app.use(function(req,res) {
    res.end(fs.readFileSync('./client/index.html'));
});

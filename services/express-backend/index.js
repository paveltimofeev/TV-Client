var fs = require('fs');
var path = require('path');
var express = require('express');
var https = require('https');
var stubs = require('./stubs.js');
var cinema = require('./cinema.js');

var app = express();
var port = process.env.port || 3000;


stubs.registerEndpointStub( app, '/photos/', './stubs/empty.json' );
stubs.registerEndpointStub( app, '/search/*', './stubs/empty.json' );

var request = require('request');
app.get('/music/', function(req, res){
    
    var url = 'http://localhost:8080/method/audio.get?user_id=-1';
    
    console.log('request ' + req.path);
    
    res.set( 'Content-Type', 'text/json' );
    res.set( 'Access-Control-Allow-Origin', '*');    
    request.get( url ).pipe(res); //add caching
});

//
// expect: /download/music/?url=base64_url&title=name
//
app.get('/download/music/', function(req, res){
    
    console.log('request ' + req.path);
    console.log('query.url ' + (req.query.url || 'n/a'));
    console.log('query.title ' + (req.query.title || 'n/a' ));
    
    var url = new Buffer( req.query.url, 'base64' ).toString( 'ascii' );
    var title = (( req.query.title || 'music' ) +'.mp3').replace(/"/gi, "''");
    
    console.log('request for ' + url);
    
    res.set( 'Content-Type', 'text/json' );
    res.set( 'Access-Control-Allow-Origin', '*');    
    res.set( 'Content-Disposition', 'attachment; filename="'+title+'"'); //add size
    request.get( url ).pipe(res);
});


var opts = {
    'dir' : 'C:/Users/Pavel/Desktop/Our Movie Collections/Cinema/',
    'extensions' : '*.avi|*.mp4|*.mkv|*.m4v',
    'download_endpoint' : '/download/cinema/',
    'cinema_endpoint' : '/cinema/'
}
    
cinema.registerEndpoints( app, opts );


var options = {
        key: fs.readFileSync('./.private/ssl.key', 'utf8'),  // privateKey
        cert: fs.readFileSync('./.private/ssl.pem', 'utf8')    // certificate
    };
https.createServer(options, app).listen(port);
console.log('Backend-stub app listening at https://%s:%s', '0.0.0.0', port);

/*
var server = app.listen( port, function() 
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Backend-stub app listening at http://%s:%s', host, port);
});
*/

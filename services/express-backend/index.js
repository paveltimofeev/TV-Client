var fs = require('fs');
var path = require('path');
var express = require('express');
var stubs = require('./stubs.js');
var cinema = require('./cinema.js');

var app = express();
var port = process.env.port || 3000;


stubs.registerEndpointStub( app, '/movies/', './stubs/vkontakte-video.json' );
stubs.registerEndpointStub( app, '/music2/', './stubs/vkontakte-music.json' );
stubs.registerEndpointStub( app, '/photos/', './stubs/empty.json' );
stubs.registerEndpointStub( app, '/search/*', './stubs/empty.json' );

var request = require('request');
app.get('/music/', function(req, res){
    
    var url = 'http://localhost:8080/method/audio.get?user_id=-1';
    
    console.log('request ' + req.path);
    
    res.set( 'Content-Type', 'text/json' );
    res.set( 'Access-Control-Allow-Origin', '*');    
    request.get( url ).pipe(res); //add cache
});

app.get('/download/music/*', function(req, res){
    
    console.log('request ' + req.path);
    
    var urlbase64 = req.path.replace( '/download/music/' ,'' );
    var url = new Buffer( urlbase64, 'base64' ).toString( 'ascii' );
    
    console.log('request for ' + url);
    
    res.set( 'Content-Type', 'text/json' );
    res.set( 'Access-Control-Allow-Origin', '*');    
    res.set( 'Content-Disposition', 'attachment; filename="music.mp3"'); //add filename,size
    request.get( url ).pipe(res);
});


var opts = {
    'dir' : 'C:/Users/Pavel/Desktop/Our Movie Collections/Cinema/',
    'extensions' : '*.avi|*.mp4|*.mkv|*.m4v',
    'download_endpoint' : '/download/cinema/',
    'cinema_endpoint' : '/cinema/'
}
    
cinema.registerEndpoints( app, opts );

var server = app.listen( port, function() 
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Backend-stub app listening at http://%s:%s', host, port);
});

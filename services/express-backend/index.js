var fs = require('fs');
var path = require('path');
var express = require('express');
var https = require('https');
var stubs = require('./stubs.js');
var cinema = require('./cinema.js');
var music = require('./music.js');

var app = express();
var port = process.env.port || 3000;


stubs.registerEndpointStub( app, '/photos/', './stubs/empty.json' );
stubs.registerEndpointStub( app, '/search/*', './stubs/empty.json' );

var opts = {
    'dir' : 'C:/Users/Pavel/Desktop/Our Movie Collections/Cinema/',
    'extensions' : '*.avi|*.mp4|*.mkv|*.m4v',
    'download_endpoint' : '/download/cinema/',
    'cinema_endpoint' : '/cinema/'
}
    
cinema.registerEndpoints( app, opts );

music.registerEndpoints( app );

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

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

var cinema_opts = {
    'dir' : 'C:/Users/Pavel/Desktop/Our Movie Collections/Cinema/',
    'extensions' : '*.avi|*.mp4|*.mkv|*.m4v',
    'endpoint' : '/cinema/',
    'download_endpoint' : '/download/cinema/'
}
    
cinema.registerEndpoints( app, cinema_opts );

var music_opts = {
    'endpoint' : '/music/',
    'download_endpoint' : '/download/music/'
}
music.registerEndpoints( app, music_opts );

var options = {
        key: fs.readFileSync('./.private/ssl.key', 'utf8'), 
        cert: fs.readFileSync('./.private/ssl.pem', 'utf8') 
    };

    https.createServer( options, app ).listen( port );
console.log('Backend-stub app listening at https://%s:%s', '0.0.0.0', port);


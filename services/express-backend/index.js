var express = require('express');
var request = require('request');
var fs = require('fs');
var app = express();
var port = process.env.port || 3000;


function errorResponse( res, type, error, data )
{
    res.redirect( '/error?type=' + type + '&error=' + error + '&data=' + data );
}

function jsonResponse( res, data )
{
        try 
        {
            res.set( 'Content-Type', 'text/json' );
            res.json( JSON.parse( data ) );
        }
        catch( error ) 
        {
            errorResponse( res, 'json convertation', error, data );
        }    
}

function stubResponse(res, fileloc)
{
     fs.readFile( fileloc,  'utf8', function(err, data){
    
        if(err)
            errorResponse( res, 'read file', err, fileloc );
        else
            jsonResponse( res, data );
    });
}

function addStub( uriPattern, fileloc )
{
    app.get( uriPattern , function( req, res ) {

        stubResponse( res, fileloc );
    });    
}


addStub( '/movies/', './stubs/vkontakte-video.json' );
addStub( '/music/', './stubs/vkontakte-music.json' );
addStub( '/photos/', './stubs/empty.json' );
addStub( '/search/*', './stubs/empty.json' );


var server = app.listen( port, function() 
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Backend-stub app listening at http://%s:%s', host, port);
});

var express = require('express');
var request = require('request');
var app = express();


function addService( opts ) {
  
  var cachedToken = null;
  
  app.get( '/', function( req, res ) {
    
    res.set( 'Content-Type', 'text/html' );
    res.send( 'OAuthProxy: Hello World!<br/>'
    + 'OAuthProxy: Services:<br/>'
    + 'OAuthProxy: <a href="/' + opts.serviceName + '">' + opts.serviceName + '</a> <br/>'
    + 'Test: <a href="/' + opts.serviceName + '/q/v1/users/2358246715/media/recent/">/v1/users/2358246715/media/recent/</a><br/>'
    + 'Test: <a href="/' + opts.serviceName + '/q/v1/media/search?lat=48.858844&lng=2.294351">/v1/media/search?lat=48.858844&lng=2.294351</a><br/>' 
    + 'Test: <a href="/' + opts.serviceName + '/q/v1/users/search?q=kassandraurena">/v1/users/search?q=kassandraurena</a>'
    );
    
  } );
  
  app.get( '/' + opts.serviceName + '/', function( req, res ) {
  
    if( isTokenCached( opts.oauthUri ) )
      res.redirect( '/' + opts.serviceName + '/done?token=' + cachedToken );
  } );
  
  app.get( '/' + opts.serviceName + '/callback', function( req, res ) {
    opts.oauthCallback( req, res, 
      function( err, token ){ cachedToken = token; res.redirect('/'); } );
  } );
  
  app.get( '/' + opts.serviceName + '/q/*', function( req, res ) {
    
    if( isTokenCached( opts.oauthUri ) )
      opts.serviceResponse( cachedToken, req, res );
  } );
  
  function isTokenCached( redirectUri ) {
    
    if( !cachedToken ) {
      res.redirect( 302, redirectUri );
      return false; 
    }
    
    return true;
  }
}

function instagram() {
  
  var serviceName  = "instagram";
  var redirectUri  = "http://localhost:3000/instagram/callback";
  var clientId     = "89af5c28e49343919dbd3962375ca724";
  var clientSecret = "f29ed2d9d4f84f8f801310deb34c6392";
  var oauthUri     = "https://api.instagram.com/oauth/authorize/?client_id="+clientId+"&redirect_uri="+redirectUri+"&response_type=code&scope=public_content";
  var oauthCallback = function(req, res, next){
    
    var formData = { form: {
      client_id     : clientId,
      client_secret : clientSecret,
      grant_type    : 'authorization_code',
      redirect_uri  : redirectUri,
      code          : req.query.code
    }};
    
    request.post( 'https://api.instagram.com/oauth/access_token', formData,
      function( err, httpResponse, body ){
        
        next(err, JSON.parse( body ).access_token);
      }
    );
  };
  var serviceResponse = function(token, req, res){
    
    var sub_query = req.originalUrl.substr( req.route.path.length -1 );
    sub_query += ( sub_query[sub_query.length-1] == "/") ? '?' : '&';
    
    var query = 'https://api.instagram.com/' + sub_query + 'access_token=' + token;
    console.log(query);
    
    request.get( query, function(err, response, body){
      
      // var jres = JSON.parse( body );
      // jres.data[0].low_resolution.standard_resolution.url;
      res.send( body );
    });
  };
  
  addService({
      serviceName:serviceName,
      redirectUri:redirectUri,
      clientId:clientId,
      clientSecret:clientSecret,
      oauthUri:oauthUri,
      oauthCallback:oauthCallback,
      serviceResponse:serviceResponse
    });
}

instagram();

var server = app.listen( 3000, function() 
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

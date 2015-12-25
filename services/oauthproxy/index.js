var express = require('express');
var request = require('request');
var app = express();

var serviceName  = "instagram";
var redirectUri  = "http://localhost:3000/instagram/callback";
var clientId     = "89af5c28e49343919dbd3962375ca724";
var clientSecret = "f29ed2d9d4f84f8f801310deb34c6392";
var oauthUri     = "https://api.instagram.com/oauth/authorize/?client_id="+clientId+"&redirect_uri="+redirectUri+"&response_type=code&scope=public_content";
var cachedToken  = null;
var callback = function(req, res){

  var formData = { form: {
                    client_id     : clientId,
                    client_secret : clientSecret,
                    grant_type    : 'authorization_code',
                    redirect_uri  : redirectUri,
                    code          : req.query.code
                  }};

  request.post( 'https://api.instagram.com/oauth/access_token',
                formData,
                function( err, httpResponse, body ){
                  
                  cachedToken = JSON.parse( body ).access_token;
                  res.redirect('/');
                }
              );
};
var serviceResponse = function(token, req, res){
  
  var sub_query = req.originalUrl.substr( req.route.path.length -1 );
  var query = 'https://api.instagram.com/' + sub_query + '?access_token=' + token;
  console.log(query);
  
  request.get( query, function(err, response, body){
    
    // var jres = JSON.parse( body );
    // jres.data[0].low_resolution.standard_resolution.url;
    res.send( body );
  });
};


app.get('/', function (req, res) {

  res.set(  'Content-Type', 'text/html');
  res.send( 'OAuthProxy: Hello World!<br/>'
          + 'OAuthProxy: Services:<br/>'
          + 'OAuthProxy: <a href="/'+serviceName+'">'+serviceName+'</a> | Test: <a href="/'+serviceName+'/q/v1/users/2358246715/media/recent/">/v1/users/2358246715/media/recent/</a><br/>');
   
});

app.get('/'+serviceName+'/', function (req, res) {

  if(!cachedToken)
    res.redirect(302, oauthUri);
  else
    res.redirect('/'+serviceName+'/done?token='+cachedToken );
});

app.get('/'+serviceName+'/callback', function (req, res) {
  callback(req, res);
});

app.get('/'+serviceName+'/q/*', function (req, res) {
  
  if(!cachedToken)
    res.redirect('/');
  else 
    serviceResponse(cachedToken, req, res);
});


var server = app.listen( 3000, function() 
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

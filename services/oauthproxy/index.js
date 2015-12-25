
var express = require('express');
var request = require('request');
var app = express();

var serviceName  = "instagram";
var redirectUri  = "http://localhost:3000/instagram/callback";
var clientId     = "";
var clientSecret = "";
var oauthUri     = "https://api.instagram.com/oauth/authorize/?client_id="+clientId+"&redirect_uri="+redirectUri+"&response_type=code&scope=public_content";
var callback = function(req, res){

  var formData = {
    form: {
      client_id     : clientId,
      client_secret : clientSecret,
      grant_type    : 'authorization_code',
      redirect_uri  : redirectUri,
      code          : req.query.code
    }};

  request.post( 'https://api.instagram.com/oauth/access_token',
                formData,
                function( err, httpResponse, body ){
                  var accessToken = JSON.parse( body ).access_token;
                  res.redirect(302, '/'+serviceName+'/done?token='+accessToken);
                }
              );
}


app.get('/', function (req, res) {

  res.set(  'Content-Type', 'text/html');
  res.send( 'OAuthProxy: Hello World!<br/>'
          + 'OAuthProxy: Services:<br/>'
          + 'OAuthProxy: <a href="/'+serviceName+'">'+serviceName+'</a><br/>');
});

app.get('/'+serviceName+'/', function (req, res) {
  res.redirect(302, oauthUri);
});

app.get('/'+serviceName+'/callback', function (req, res) {
  callback(req, res);
});

app.get('/'+serviceName+'/done', function (req, res) {

  //res.send( req.query.token );
  request.get('https://api.instagram.com/v1/users/juli.annee/media/recent/?access_token='+req.query.token+'&count=100',
              function(err, httpResponse, body ){
                res.send( body );
              });
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

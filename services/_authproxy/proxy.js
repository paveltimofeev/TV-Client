var HOST = 'api.vk.com';
var TOKEN = '';

var auth = require('./auth.js');
var http = require('http');
var https = require('https');

var port = 8080;

var arg1 = process.argv[2];
var arg2 = process.argv[3];

process.env.VK_LOGIN = arg1 || null;
process.env.VK_PASSW = arg2 || null;

auth.GetToken( function(err, token){
  
  if(err) {
    
    console.log( err );
    throw err;
  }
  
  TOKEN = token;
  console.log('Ready')
});

http.createServer( function(req, res){
  
  console.log('--> [' + req.method + '] ' + req.url);
  
  if(req.method != 'GET')
  {
    console.log('DNY [' + req.method + '] ' + req.url);
    
    res.writeHead(401);
    res.write('Only GET allowed');
    res.end();
    return;
  }
  
  var opts =
  {
    hostname: HOST,
    path: req.url + "&access_token=" + TOKEN,
    method: req.method
  };
  
  var back_req = https.request( opts, function(back_res){
    
    back_res.on('data', function(chunk){ res.write(chunk, 'binary'); });
    back_res.on('end', function(){ res.end(); });

    res.writeHead( back_res.statusCode, back_res.headers );
  
    console.log( back_res.statusCode + ' [' + back_res.req.method + '] ' + back_res.req.path);
  });
  
  back_req.on('error', function(err){
    console.log(err);
    res.write(err);
    res.end();
  });
  
  back_req.end();
  
}).listen( port );

console.log( 'Auth proxy started at localhost:' + port );

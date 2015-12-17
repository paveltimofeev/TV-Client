var path = require('path');
var fs = require('fs');

var folder = '.private';
var creds_location = path.join( folder, 'creds.json' );
var tokencache_location = path.join( folder, 'token.cache' );

if( !fs.existsSync(folder))
{
  fs.mkdirSync(folder);
}

if( !fs.existsSync(creds_location)){ fs.writeFileSync(creds_location, "{}", 'utf8'); }
if( !fs.existsSync(tokencache_location)){ fs.writeFileSync(tokencache_location, "", 'utf8'); }

function Auth( config, callback ){

  var vkAuth = require('vk-auth')(config.applicationId, config.scope);
  
  vkAuth.on( 'error', function (err) {
    console.log('auth error ' + JSON.stringify(err));
    callback( err, null );
  });

  vkAuth.on( 'auth', function (token) {
    console.log('authenticated');
    callback( null, token );
  });
  
  vkAuth.authorize( config.login, config.password );
}

function getToken( callback ) {
  
  fs.readFile( tokencache_location, 'utf8', function(err, data) {
    
    if( err ) {
  
      callback( err );
    }
    else {
      
      var TOKEN = null;
  
      console.log( 'read token from cache' );
      var now = (new Date()).getTime() / 1000;
  
      var exp = data.split( '|' )[0];
      if( now < exp ) {
    
        console.log( 'use cached token' );
        TOKEN = data.split( '|' )[1];
        callback( null, TOKEN );
      }
      else {
    
        console.log( 'cached token is expired' );
    
        var config = require( 'jsonfile' ).readFileSync( creds_location );
        
        // override creds from env if exists
        config.login = process.env.VK_LOGIN || config.login;
        config.password = process.env.VK_PASSW || config.password;
        config.scope = process.env.VK_SCOPE || config.scope;
        config.applicationId = process.env.VK_APPID || config.applicationId;
  
        console.log('application id : ' + config.applicationId);
        console.log('scope          : ' + config.scope);
        console.log('login          : ' + config.login);
        console.log('password       : ' + (config.password ? '*' : 'not set'));
        
        Auth( config, function( err, token ) {
      
          console.log( 'get new token' );
          if( err ) {
            
            callback( err );
          }
          else {
            
            console.log( 'got token, expires in ' + ( token.expires_in / 60 / 60 ) + ' hours' );
            console.log( 'caching token' );
            
            var now = Math.round( (new Date()).getTime() / 1000 );
            var exp = now + parseInt( token.expires_in );
            var data = exp.toString() + '|' + token.access_token;
  
            fs.writeFile( './.private/token.cache', data, function( err ) {
              if( err ) console.log( err );
            } );
  
            TOKEN = token.access_token;
            callback( null, TOKEN );
          }
        } );
      }
    }
  });
}

module.exports.GetToken = getToken;

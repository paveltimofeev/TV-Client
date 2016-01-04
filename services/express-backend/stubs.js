var fs = require('fs');

function errorResponse( res, type, error, data )
{
    res.redirect( '/error?type=' + type + '&error=' + error + '&data=' + data );
}

function jsonResponse( res, data )
{
        try 
        {
            res.set( 'Content-Type', 'text/json' );
            res.set( 'Access-Control-Allow-Origin', '*');
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

function registerEndpointStub( app, uriPattern, fileloc )
{
    app.get( uriPattern , function( req, res ) {
        
        console.log( 'request ' + req.path );
        stubResponse( res, fileloc );
    });    
}

module.exports.registerEndpointStub = registerEndpointStub;

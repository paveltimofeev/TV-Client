var request = require( 'request' );
var oauthuri = 'http://localhost:8080';

function registerEndpoints( app )
{
    
    app.get('/music/', function(req, res){
        
        console.log('request ' + req.path);
        
        res.set( 'Content-Type', 'text/json' );
        res.set( 'Access-Control-Allow-Origin', '*');    
        
        var url = oauthuri + '/method/audio.get?user_id=-1';
        request.get( url ).pipe(res); //add caching
    });

    // expect: /download/music/?url=base64_url&title=name
    app.get('/download/music/', function(req, res){
        
        console.log('request ' + req.path);
        console.log('query.url ' + (req.query.url || 'n/a'));
        console.log('query.title ' + (req.query.title || 'n/a' ));
        
        var url = new Buffer( req.query.url, 'base64' ).toString( 'ascii' );
        var title = (( req.query.title || 'music' ) +'.mp3').replace(/"/gi, "''");
        
        console.log('request for ' + url);
        
        res.set( 'Content-Type', 'text/json' );
        res.set( 'Access-Control-Allow-Origin', '*');    
        res.set( 'Content-Disposition', 'attachment; filename="'+title+'"'); //add size
        request.get( url ).pipe(res);
    });
}

module.exports.registerEndpoints = registerEndpoints;

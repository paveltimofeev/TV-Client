var request = require( 'request' );
var oauthuri = 'http://localhost:8080';

function registerEndpoints( app, opts )
{
    app.get( opts.endpoint, function(req, res){
        
        console.log('request ' + req.path);
        
        res.set( 'Content-Type', 'text/json' );
        res.set( 'Access-Control-Allow-Origin', '*');    
        
        var url = oauthuri + '/method/audio.get?user_id=-1';
        request.get( url ).pipe(res); //add caching
    });

    // expect: /download/music/?url=base64_url&title=name
    app.get( opts.download_endpoint, function(req, res){
        
        console.log('request ' + req.path);
        
        var url = new Buffer( req.query.url, 'base64' ).toString( 'ascii' );
        var title = (( req.query.title || 'music' ) +'.mp3').toString( 'ascii' ).replace(/"/gi, "''");

        console.log('requested url ' + url + '. title ' + (req.query.title || 'n/a' ));

        res.set( 'Content-Type', 'audio/mpeg; charset=ascii' );
        res.set( 'Access-Control-Allow-Origin', '*');    
        res.set( 'Content-Disposition', 'attachment; filename="'+title+'"');
        request.get( url ).pipe(res);
    });
}

module.exports.registerEndpoints = registerEndpoints;

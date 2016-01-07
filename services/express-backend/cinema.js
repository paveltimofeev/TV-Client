var glob = require('glob');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var movieTitle = require('movie-title');
var movieInfo = require('movie-info');

function registerEndpoints( app, opts )
{
    // download
    app.get( opts.download_endpoint + ':file' , function( req, res ) {
        
        var filebase64 = req.path.replace( opts.download_endpoint ,'' );
        var file = new Buffer( filebase64, 'base64' ).toString( 'utf8' );
        var loc = path.join( opts.dir, file);

        console.log( 'request ' + req.path );
        console.log( 'request for ' + file );
        
        fs.exists( loc, function( exists ){
            
            if( !exists )
            { 
                res.status(404).send(); 
                console.log( 'File was not found. '+loc );
                return; 
            }
            
            res.status( 206 ).download( loc, function( err ){ console.log( err || 'downloaded: '+loc );});
        });
    });

    // files list
    app.get( opts.endpoint , function( req, res ) {

        console.log( 'request ' + req.path );
        
        res.set( 'Content-Type', 'text/json' );
        res.set( 'Access-Control-Allow-Origin', '*');
        
        glob( '+('+opts.extensions+')', { 'cwd':opts.dir, 'root':opts.dir }, function( err, files ){
            
            var data = { 'response': { 'items':[] }};
                    
            if( err )
            {
                console.error( err );
                res.status( 500 ).json( err );
            }
            else
            {
                files.forEach( function( file ){                    
                    /*
                    var info = Promise.promisify(fs.stat);

                    info( path.join(dir, file) )
                    .then(function(stat){
                        
                        console.log( stat );
                        
                        data.response.items.push( {
                            "title"            : path.basename(file, path.extname(file)),
                            "size"            : stat.size,
                            "description" : JSON.stringify(file),
                            "photo_320" : "../img/stub3.jpg",
                            "uri"              : download_endpoint + (new Buffer(file).toString( 'base64' )),
                            "extension"  : path.extname(file).replace( '.', '' )
                        });
                    });
                    */
                    var stat = fs.statSync( path.join( opts.dir, file ));
                    
                    data.response.items.push({
                        "title"            : path.basename( file, path.extname( file )),
                        "size"            : stat.size,
                        "description" : JSON.stringify( file ),
                        "photo_320" : "../img/stub3.jpg",
                        "uri"              : opts.download_endpoint + ( new Buffer( file ).toString( 'base64' )),
                        "extension"  : path.extname( file ).replace( '.', '' )
                    });
                });
                
                getCinimaInfo( data.response.items[0].title );
                
                res.status( 200 ).json( data );
                console.log( data.response.items.length + ' files' );            
            }
        });
    });
}

function getCinimaInfo( fileName, cb )
{
    
    
    console.log(fileName);
      
    // http://api.themoviedb.org/3/authentication/guest_session/new
    // http://api.themoviedb.org/3/search/movie
    // http://api.themoviedb.org/3/movie/{{id}}/images
    
    var request = require('request');

    request({ 
        method: 'GET', 
        url: 'http://api.themoviedb.org/3/search/movie',
        headers: { 'Accept': 'application/json'
      }}, function (error, response, body) {
      console.log('Status:', response.statusCode);
      console.log('Headers:', JSON.stringify(response.headers));
      console.log('Response:', body);
    });

        //movieInfo( movieTitle( fileName ), function (err, res) { cb(err, res); });
        
        /*
        {
            poster_path : '/8QRqrKmBb4wlhHpcGiwltQYHy2y.jpg',
            adult               : false,
            overview         : 'Less than 24 hours into his parole',
            release_date    : '2001-12-06',
            genre_ids       : [53, 80],
            id                    : 161,
            original_title   : 'Ocean\'s Eleven',
            original_language : 'en',
            title                   : 'Ocean\'s Eleven',
            backdrop_path : '/z2fiN0tgkgOcAFl5gxvQlYXCn3l.jpg',
            popularity          : 4.444228,
            vote_count          : 2171,
            video               : false,
            vote_average : 6.95
        }
        */
}

module.exports.registerEndpoints = registerEndpoints;

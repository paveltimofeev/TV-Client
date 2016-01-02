var express = require('express');
var request = require('request');
var glob = require('glob');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
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

var dir = 'C:/Users/Pavel/Desktop/Our Movie Collections/Cinema/';
    
app.get( '/download/cinema/:file' , function( req, res ) {

    var filebase64 = req.path.replace('/download/cinema/','');
    var file = new Buffer( filebase64, 'base64' ).toString( 'utf8' );
    
    var loc = path.join( dir, file);
    //res.attachment( loc );
    res.status(206).download( loc, function(err){
        
        if(err)
            console.log('Err:' + err + '. Or paused downloading');
        else
            console.log('Downloaded');
    } );
    
    //res.set('Content-Type', '');
    //res.status(206).send( fs.readFileSync(path.join( dir, file))) ;
});

app.get( '/cinema/' , function( req, res ) {

    var opts = { 'cwd':dir, 'root':dir, 'stat':true, 'statCache':true};
    
    glob( '+(*.avi|*.mp4|*.mkv|*.m4v)', opts, function( err, files ){
        
        var data = { 'response': { 'items':[] }};
                
        if(err)
        {
            console.log( err );
            
            res.set( 'Content-Type', 'text/json' );
            res.set( 'Access-Control-Allow-Origin', '*');
            data.err = err;
            res.json( data );
        }
        else
        {
            files.forEach( function( file ){

                var stat = fs.statSync( dir + file);
                    
                if( stat.isFile() )
                {                    
                    /*
                    getCinimaInfo(dir + file, function(err, info){
                       
                        
                        var item = {
                            "title" : path.basename(file, path.extname(file)),
                            "duration" : parseInt(stat.size / 1024/ 1024),
                            "size": stat.size,
                            "description" : JSON.stringify(file),
                            "photo_320" : "../img/stub3.jpg",
                            "player" : '/cinema/' + file,
                            "extension": path.extname(file).replace( '.', '' )
                        };
                        
                        if(!err)
                        {
                            console.log( item.title + ' -> ' + info.title);
                            item.title  = info.title;
                            item.description = info.overview;
                            item.img = info.poster_path;
                            item.rank = info.vote_average;
                        }
                        else
                        {
                            console.log( err );
                        }
                    
                        data.response.items.push( item );
                        
                    });
                    */
                    
                    var item = {
                        "title" :   path.basename(file, path.extname(file)),
                        "duration" : parseInt(stat.size / 1024/ 1024),
                        "size": stat.size,
                        "description" : JSON.stringify(file),
                        "photo_320" : "../img/stub3.jpg",
                        "uri" : '/download/cinema/' + (new Buffer(file).toString( 'base64' )),
                        "extension": path.extname(file).replace( '.', '' )
                    };
                
                    data.response.items.push( item );
                    
                }
            });
            
            console.log( data.response.items.length + ' files' );            
            res.set( 'Content-Type', 'text/json' );
            res.set( 'Access-Control-Allow-Origin', '*');
            res.status(200).json( data );
        }
    });
});


var movieTitle = require('movie-title');
var movieInfo = require('movie-info');
function getCinimaInfo( fileName, cb )
{
        movieInfo( movieTitle( fileName ), function (err, res) { cb(err, res); });
        
        /*
        {
            poster_path : '/8QRqrKmBb4wlhHpcGiwltQYHy2y.jpg',
            adult               : false,
            overview         : 'Less than 24 hours into his parole, charismatic thief Danny Ocean is already rolling out his next plan: In one night, Danny\'s hand-picked crew of specialists will attempt to steal more than $150 million from three Las Vegas casinos. But to score the cash, Danny risks his chances of reconciling with ex-wife, Tess.',
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


var server = app.listen( port, function() 
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Backend-stub app listening at http://%s:%s', host, port);
});

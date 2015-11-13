/**
 * Created by ptimofee on 12.11.2015.
 */
var path = require('path');
var glob = require('glob');
var configReader = require('./configReader');

var _dscLocation = './../_dsc/';
var _dscList = [];


function addDSC( config, modulePath )
{
  var dsc = require( path.join( _dscLocation, modulePath ) );
  dsc.Configure( config );
  
  _dscList.push( dsc );
}

function reloadDSC( done ){

  glob( '**/*_dsc.json', { cwd : _dscLocation }, function( e, list ){
    
    list.forEach( function( configPath ){

      configReader.Read( path.join( _dscLocation, configPath ), function( e, config ){

        addDSC( config, configPath.replace('.json', '.js') );
        done( e );
      } );
      
    });
  });
}

function getList( callback ){
  
  _dscList.forEach( function( dsc ){
    
    dsc.GetList( callback );
  });
}


/*
 ReloadDSC( done )
 done { e: error }
 */
module.exports.ReloadDSC = reloadDSC;

/*
 GetList( callback )
 callback { }
 */
module.exports.GetList = getList;

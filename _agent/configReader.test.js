/**
 * Created by ptimofee on 13.11.2015.
 */
var cr = require('./configReader');

cr.Read('./../_dsc/localfs/localfs_dsc.json', function( e, configs ) {
  
  if( e ) console.error('ERR>>' +  e );
  else {
    
    configs.forEach( function ( config ) {

      console.log( config.type );
    } );
  }
});
/**
 * Created by ptimofee on 12.11.2015.
 */
var worker = require('./worker');

worker.ReloadDSC( function( e ){
  
  if( e )
    console.log( e );
  
  worker.GetList( function( e, list){
    
    list.forEach( function(item){
      console.log( item );
    })
  });
  
});


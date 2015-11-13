/**
 * Created by ptimofee on 12.11.2015.
 */
var localfs = require('./localfs_dsc');


localfs.Configure({ location: 'C:/Temp', mask: '**/*.sh', type: 'shell scripts' });

console.log( localfs.GetType() );

localfs.GetList( function( e, list ){

  console.log('---');
  list.forEach( function( item ){
    
    console.log( item );
  });
  
});

localfs.GetData('test.sh', function( e, content ){

  console.log('---');
  console.log( content );
  console.log( e );
});

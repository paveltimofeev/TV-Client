/**
 * Created by ptimofee on 13.11.2015.
 */
var jsonfile = require('jsonfile');

function read( path, callback ){

  jsonfile.readFile( path, callback );
}


/*
 Read( path : string, callback )
 callback( err, configs[] )
 */
module.exports.Read = read;

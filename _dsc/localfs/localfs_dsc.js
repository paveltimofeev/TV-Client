/**
 * Created by ptimofee on 12.11.2015.
 */
var fs = require('fs');
var glob = require("glob");
var path = require('path');

var _config = [
  {
    location : process.cwd(),
    mask     : '*.*',
    type     : 'any'
  }
];

function configure( config ){

  if( !config )
    new Error('Null config is denied');

  if( !config.location )
    new Error('Config should has location');
  
  if( !config.mask )
    new Error('Config should has mask');
  
  if( !config.type )
    new Error('Config should has type');

  _config = config;
}

function getType(){

  return _config[0].type;
}

function getList( callback ){

  glob( _config[0].mask, { cwd : _config[0].location }, callback );
}

function getData( name, callback ){

  var fullPath = path.join( _config[0].location, name );
  fs.readFile( fullPath, callback );
}


/*
 Configure( config )
 config { type : string, location : string, mask : string }
 
 Setup Local DSC
 */
module.exports.Configure = configure;

/*
 GetType() : string
 Returns type of content
 */
module.exports.GetType = getType;

/*
 GetList( callback )
 callback { e, list : string[] }
 Returns list of content
 */
module.exports.GetList = getList;

/*
 GetData( name, callback )
 callback { err, data : bytes }
 Returns content of item
 */
module.exports.GetData = getData;

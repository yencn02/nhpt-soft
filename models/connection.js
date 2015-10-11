var connection = require('mongoose');

var dbUri = process.env.MONGOLAB_URI;

if( typeof(dbUri) === "undefined" ){
  dbUri = 'mongodb://localhost/nhpt-soft'
}

var db = connection.connect(dbUri);

module.exports = connection;
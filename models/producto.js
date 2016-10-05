var Schema = require('mongoose').Schema;
 
var producto_schema = new Schema({
  nombre        :   String,
  descripcion   :   String,
  precio        :   String
});
 
module.exports = producto_schema;
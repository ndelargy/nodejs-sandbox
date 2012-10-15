var mongoose = require('mongoose')
  , Schema = mongoose.Schema;


var Content = new Schema({
    title     : { type: String, index: true }
  , body      : { type: String, lowercase: true, trim: true }
  , key      : { type: String, index: true }
});

module.exports = mongoose.model('content', Content);
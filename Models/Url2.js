const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlSchema = new Schema({
    slug:{
        type:String,
        
    },
    destination:{
        type:String,
        
    },
    password:{
        type:String
    }

});
const urlModel = mongoose.model('Url',urlSchema);
module.exports = urlModel;
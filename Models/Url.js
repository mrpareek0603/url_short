const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const urlSchema = new Schema({
    slug:{
        type:String,
        
    },
    destination:{
        type:String,
        
    }//,
    // password:{
    //     type:String
    // }

},
// { typeKey: '$type' }
);
const Url = mongoose.model('Url',urlSchema);
module.exports = Url;
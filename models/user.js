const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/renting")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post" 
      }],
    carts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart"  
      
    }],
    item: [{ type: mongoose.Schema.Types.ObjectId, ref: 'item' }],
    profilepic: {
        type: String,
        default: "default.jpeg",
      },
      address:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address"
      }]
      

})

module.exports= mongoose.model("user",userSchema);

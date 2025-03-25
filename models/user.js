const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://210120107008:phhPwCKCibXvawSd@renting.1rkcy.mongodb.net/renting?retryWrites=true&w=majority&tls=true", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Set a timeout
})

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

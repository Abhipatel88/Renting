const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  username:String,
  profile:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    review:String,
    rating:{
        type: String,
      required: true,
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post" 
      },
      date: {
        type: Date,
        default: Date.now
      },
})

module.exports = mongoose.model("review",reviewSchema);
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  username:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:String,
    picture:String,
    description:String,
    price:String,
    
    type: {
      type: String,
      required: true,
      // enum: ['Sofa', 'Chair', 'Table', 'Bed', 'Cabinet', 'Shelf', 'Desk'],
      trim: true
  },
      date: {
        type: Date,
        default: Date.now
      },
      review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review"
      }]
})

module.exports = mongoose.model("post",postSchema);
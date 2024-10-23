const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:String,
    address:String,
    price:String,
    date:{
        type: Date,
        default: Date.now
      },
    postid:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    },
    payment:{
        type:String
    },
    orderid:String,
})

module.exports = mongoose.model("order",orderSchema);
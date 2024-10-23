const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post" 
      },
    Puserid:{
        type:String,
    },
    Auser:String
})

module.exports= mongoose.model("cart",cartSchema);

require('dotenv').config();

const usermodel = require("../models/user");
const postmodel = require("../models/post");
const reviewmodel = require("../models/review");
const cartmodel = require('../models/car');
const addressmodel = require('../models/address');
const ordermodel = require('../models/order');

// Your other code...
const Razorpay = require('razorpay'); 
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const renderProductPage  = async(req,res)=>{

    try {
            let {id} = req.params;

               let user = await usermodel.findOne({email:req.user.email})
            let cart = await cartmodel.findById(id).populate("postid")
            // let address = await addressmodel.find({user:user._id})
            let add= req.body.address;
            let qulitys = req.body.qulity;
            let start=req.body.startDate;
            let end = req.body.endDate;
            let days =req.body.days;
            console.log(user);
        
            res.render("proceed",{cart,add,qulitys,user,start,end,days})   
        // res.render('proceed');

    } catch (error) {
        console.log(error.message);
    }

}

const createOrder = async(req,res)=>{
    try {
        const amount = req.body.amount*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com',

        }
        
        
        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
            ordermodel.create({
            address:req.body.add,
            postid:req.body.pid,
            title:req.body.name,
            price:req.body.amount,
            orderid:order.id,
            user:req.body.user
           })
        }

        
        })
        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:RAZORPAY_ID_KEY,
                        product_name:req.body.name,
                        description:req.body.description,
                        contact:"1234567891",
                        name: "Sandeep Sharma",
                        email: "sandeep@gmail.com",
                        
                    });
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!'});
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}
function isLoggedin(req, res, next) {
    // protected routes
    if (req.cookies.token === "") {
      // res.send(`<script>alert("Pelse login first");</script>`)
      res.redirect("/login");
    } else {
      let data = jwt.verify(req.cookies.token, "dsd"); // it verify the user
      req.user = data; // it;s useful for geeting data when user logged in
      next();
    }
  }

module.exports = {
    renderProductPage,
    createOrder
}
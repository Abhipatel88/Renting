const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt')
const usermodel = require("./models/user");
const postmodel = require("./models/post");
const reviewmodel = require("./models/review");
const cartmodel = require('./models/car');
const addressmodel = require('./models/address');
const ordermodel = require('./models/order');
var http = require('http').Server(app);

const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")
const crypto = require("crypto");
const mongoose = require('mongoose');
const upload = require("./config/multer");
const ejsMate = require("ejs-mate")
const utils = require("./utils/utils");
const car = require('./models/car');
const paymentRoute = require('./routes/paymentRoute');
require("dotenv").config();


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','ejs')
app.use(cookieParser());
app.engine("ejs", ejsMate);

app.get('/', (req, res) => {
 res.render('signup');
        });

app.post("/create",(req,res)=>{
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, async function(err, hash) {
                    let usercreate = await usermodel.create({
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
        
                    })
                    let {email, password}= req.body;
                    let token = jwt.sign({email},"dsd");
                    res.cookie("token",token);
                    res.render("login",{usercreate});
                });
            });
        })
app.get("/login",(req,res)=>{
    res.render('login')
})
app.post("/log",async (req,res)=>{
    let {email , password}=req.body;
    let user = await usermodel.findOne({email});
    if(!user) return res.send("<script>alert('user not found')</script>")
    
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token = jwt.sign({email:email,userid:user._id},"dsd");
            res.cookie("token",token);
            res.redirect("/home")
        }else{
            res.status(500).send("Password is not correct")
        }   
    })
})
app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
  });

app.get("/home",isLoggedin, async (req,res)=>{
    let user= await usermodel.findOne({email:req.user.email}).populate("posts")
    let posts = await postmodel.find().populate("user");



    res.render("index",{user,posts,dater:utils.formatRelativeTime,})
})

app.get("/profile",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    res.render("profile",{user})
})

app.post('/uploadd',isLoggedin, upload.single("image"), async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    user.profilepic = req.file.filename;
    await user.save();
    // console.log(user.profilepic);
    res.redirect("/profile")
})
app.post("/update",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOneAndUpdate({email:req.user.email},{username:req.body.username,email:req.body.email,password:req.body.password},{new:true})
    res.redirect("/home")
})
app.get("/add",isLoggedin, async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let posts = await postmodel.find().populate("user");

    res.render("add",{user,posts,dater:utils.formatRelativeTime,})
})
app.post("/post",isLoggedin,upload.single("image"),async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let post = await postmodel.create({
        username:user.username,
        user: user._id,
        title: req.body.title,
        picture: req.file.filename,
        description: req.body.description,
        price:req.body.price,
        type:req.body.type,
    })
    // const post = new postmodel(req.body);
    //     await post.save();
    user.posts.push(post._id);
    await user.save();
    res.redirect("/item")
    // console.log(user.posts.picture);
})
app.get("/item",isLoggedin,async (req,res)=>{
    const user = await usermodel.findOne({email:req.user.email}).populate("posts");
    let review = await reviewmodel.find().populate("posts");

    const posts = await postmodel.find().populate("user");
    const rate = await postmodel.find().populate("review");
    // console.log(rate);
    let chair= await postmodel.find({ type: "chair" }).populate("user");
    let sofa = await postmodel.find({ type: "sofa" }).populate("user");
    let table = await postmodel.find({ type: "table" }).populate("user");
    let bed = await postmodel.find({ type: "bed" }).populate("user");
    let cabinet = await postmodel.find({ type: "cabinet" }).populate("user");
    let shelf = await postmodel.find({ type: "shelf" }).populate("user");
    res.render("item",{user,rate,posts,review,chair,sofa,table,bed,shelf,cabinet,dater:utils.formatRelativeTime,})
})
app.get("/all",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let posts = await postmodel.find().populate("user");
    res.render("all",{user,posts,dater:utils.formatRelativeTime,})
})

app.get("/almari",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let posts = await postmodel.find({ type: "almari" }).populate("user");
    let cabinet = await postmodel.find({ type: "cabinet" }).populate("user");

    res.render("cabinet",{user,posts,cabinet,dater:utils.formatRelativeTime,})
})
app.get("/sofa",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let posts = await postmodel.find({ type: "sofa" }).populate("user");
    let sofa = await postmodel.find({ type: "sofa" }).populate("user");

    res.render("sofa",{user,posts,sofa,dater:utils.formatRelativeTime,})
})
app.get("/bed",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let posts = await postmodel.find({ type: "bed" }).populate("user");
    let bed = await postmodel.find({ type: "bed" }).populate("user");

    res.render("bed",{user,posts,bed,dater:utils.formatRelativeTime,})
})
app.get("/table",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let posts = await postmodel.find({ type: "table" }).populate("user");
    let table = await postmodel.find({ type: "table" }).populate("user");
    res.render("table",{user,posts,table,dater:utils.formatRelativeTime,})
})
app.get("/chair",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let posts = await postmodel.find({ type: "chair" }).populate("user");
    let chair = await postmodel.find({ type: "chair" }).populate("user");
    res.render("chair",{user,posts,chair,dater:utils.formatRelativeTime,})
})
app.get("/show/:id",isLoggedin,async (req,res)=>{
    let post = await postmodel.findById(req.params.id).populate("user");
    // const posts = await postmodel.find().populate("user");

    let user = await usermodel.findOne({email:req.user.email})
    let review = await reviewmodel.find({posts:req.params.id}).populate("user");
    res.render("show",{post,user,review,dater:utils.formatRelativeTime,})
})
app.post("/show/:id",isLoggedin,async (req,res)=>{
    let post = await postmodel.findById(req.params.id).populate("user");
    let user = await usermodel.findOne({email:req.user.email})
    
    const review = await reviewmodel.create({
        username:user.username,
        profile:user.profilepic,
        user: user._id,
        review: req.body.review,
        rating:req.body.type,
        posts: post._id,
    })
    post.review.push(review._id);
    await post.save();
    res.redirect(`/show/${req.params.id}`)
})
app.get("/history",isLoggedin,async (req,res)=>{
    const user = await usermodel.findOne({email:req.user.email}).populate("posts");

    res.render("history",{user,dater:utils.formatRelativeTime,})
})
app.get("/edit/:id",isLoggedin,async (req,res)=>{
    let post = await postmodel.findById(req.params.id).populate("user");    
    const user = await usermodel.findOne({email:req.user.email}).populate("posts");

    res.render("edit",{post,user})
})

    

app.post("/updatepost/:id",upload.single("image"),isLoggedin,async (req,res)=>{
    let {id} = req.params;
    let post = await postmodel.findByIdAndUpdate(id,req.body,{new:true})
    // console.log(req.params.id);
    post.picture = req.file.filename;
    await post.save();

    res.redirect(`/history`)
})
app.post("/delete/:id",isLoggedin,async (req,res)=>{
    let {id} = req.params;
    const deletedList = await postmodel.findByIdAndDelete(id);
    // console.log(deletedList);
    res.redirect("/history")

})
app.get("/cart/:id",isLoggedin,async (req,res)=>{
    let {id} = req.params;
    let post = await postmodel.findById(id);
    let user = await usermodel.findOne({email:req.user.email});
    // console.log(user);
    let cart = await cartmodel.create({
        postid:post._id,
        Puserid:post.user,  
        Auser:user._id

    })
    user.carts.push(cart._id);
    await user.save();
    // res.render("cart",{user,post})
    res.redirect(`/show/${id}`)

})

app.get("/cart",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email}).populate("carts").populate("posts")
    let cart = await cartmodel.find({Auser:user._id}).populate("postid")
    let address = await addressmodel.find({user:user._id})

    // console.log(cart);
    res.render("cart",{user,cart,address});
})
app.get("/cart/delete/:id",isLoggedin,async (req,res)=>{
    let {id} = req.params;
    const deletecart = await cartmodel.findByIdAndDelete(id);
    // console.log(deletedList);
    res.redirect("/cart")

})
app.get("/address",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let address = await addressmodel.find({user:user._id})
    // console.log(address);
    res.render("adress",{user,address})
})
app.post("/address",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email})
    let adress = await addressmodel.create({
     user:user._id,
     fullName:req.body.name,
     phoneNumber:req.body.number,
     addressLine1:req.body.address1,
     addressLine2:req.body.address2,
     city:req.body.city,
     state:req.body.state,
     zipCode:req.body.zipcode,

    })
    user.address.push(adress._id);
    await user.save();
    res.redirect("/address")
})

// app.post("/proceed/:id",isLoggedin,async (req,res)=>{
//     let {id} = req.params;
//     let user = await usermodel.findOne({email:req.user.email})
//     let post = await postmodel.findById(req.params.id).populate("user");    
//     let cart = await cartmodel.findById(id).populate("postid")
//     let address = await addressmodel.find({user:user._id})
//     let add= req.body.address;
//     let qulitys = req.body.qulity;
//     // console.log(cart);

//     res.render("proceed",{user,post,cart,address,add,qulitys})    
// })



app.use('/',paymentRoute);

app.get("/order",isLoggedin,async (req,res)=>{
    let user = await usermodel.findOne({email:req.user.email});
    let order= await ordermodel.find({user:user._id}).populate("postid");
    // console.log(order);
    res.render("order",{user,order})
})

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
// app.listen(3000)
http.listen(3000, function(){
    console.log('Server is running');
});
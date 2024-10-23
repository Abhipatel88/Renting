const express = require('express');
const payment_route = express();
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({ extended:false }));

const path = require('path');

payment_route.set('view engine','ejs');
payment_route.set('views',path.join(__dirname, '../views'));

const paymentController = require('../controllers/paymentController');

payment_route.post('/proceed/:id',isLoggedin,paymentController.renderProductPage);
payment_route.post('/createOrder', paymentController.createOrder);

module.exports = payment_route;
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

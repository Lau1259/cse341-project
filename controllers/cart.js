const Mongoose = require('mongoose');
const Course = require('../model/courses');

/**********************************************************
 Cart Logic
**********************************************************/
module.exports.getCart = (req, res, next) => {
  items = req.user.cart.items;
  res.render('pages/project/cart', {
    title: "New Course | UpSkill",
    path: "/upskill/newCourse",
    isAuthenticated: req.session.isLoggedIn,
    items: items
  });
};

module.exports.postAddToCart = (req, res, next) => {
  courseId = req.body.courseId;
  Course.findById(courseId)
    .then(course => {
      return req.user.addToCart(course);
    })
    .then(result => {
      console.log(result);
      res.redirect('./courses')
    }).catch(err=>{console.log(err)})
};

module.exports.getPurchaseCart = (req, res, next) => {
  req.user.purchaseCart()
    .then(result => {
      // console.log(result);
      res.redirect('./cart')
    })
};

module.exports.getClearCart = (req, res, next) => {
  req.user.clearCart()
    .then(result => {
      console.log(result);
      res.redirect('./cart')
    })
};

module.exports.postRemoveFromCart = (req, res, next) => {
  itemId = req.body.itemId;
  Course.findById(itemId)
    .then(course => {
      return req.user.removeFromCart(course);
    })
    .then(result => {
      // console.log(result);
      res.redirect('./cart')
    })
};
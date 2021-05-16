const express = require('express');
const router = express.Router();

const path = require('path');
const upskillController = require('../../controllers/upskill');
router.use(express.static(path.join(__dirname, 'public')))
  .get('/newUser', upskillController.getNewUser)
  .get('/cart', upskillController.getCart)
  .get('/purchaseCart', upskillController.getPurchaseCart)
  .post('/removeFromCart', upskillController.postRemoveFromCart)
  .post('/addUser', upskillController.postAddUser)
  .get('/clearCart', upskillController.getClearCart)
  .post('/addToCart', upskillController.postAddToCart)
  .get('/courses', upskillController.getCourses)
  .post('/course', upskillController.getCourse)
  .get('/newCourse', upskillController.getNewCourse)
  .post('/addCourse', upskillController.postAddCourse)
  .post('/editCourse', upskillController.getEditCourse)
  .post('/updateCourse/', upskillController.postUpdateCourse)
  .post('/deleteCourse/', upskillController.postDeleteCourse)
  .use('/', upskillController.getHome)


module.exports = router;
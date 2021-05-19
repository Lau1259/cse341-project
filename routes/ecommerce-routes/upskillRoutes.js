const express = require('express');
const router = express.Router();

const path = require('path');
const isAuth = require('../../middleware/is-auth');

/**********************************************************
 Controllers
**********************************************************/
const authController = require('../../controllers/auth');
const cartController = require('../../controllers/cart');
const courseController = require('../../controllers/course');
const userController = require('../../controllers/user');

/**********************************************************
 Routing
 **********************************************************/
router.use(express.static(path.join(__dirname, 'public')))
  /**********************************************************
   Cart
  **********************************************************/
  .get('/cart', isAuth, cartController.getCart)
  .get('/purchaseCart', isAuth, cartController.getPurchaseCart)
  .post('/removeFromCart', isAuth, cartController.postRemoveFromCart)
  .get('/clearCart', isAuth, cartController.getClearCart)
  .post('/addToCart', isAuth, cartController.postAddToCart)
  /**********************************************************
   Courses
  **********************************************************/
  .get('/courses', courseController.getCourses)
  .post('/course', courseController.getCourse)
  .get('/newCourse', isAuth, courseController.getNewCourse)
  .post('/addCourse', isAuth, courseController.postAddCourse)
  .post('/editCourse', isAuth, courseController.getEditCourse)
  .post('/updateCourse/', isAuth, courseController.postUpdateCourse)
  .post('/deleteCourse/', isAuth, courseController.postDeleteCourse)
  /**********************************************************
   Users
  **********************************************************/
  .post('/addUser', userController.postAddUser)
  .get('/newUser', userController.getNewUser)
  /**********************************************************
   Authentication
  **********************************************************/
  .get('/login', authController.getLogin)
  .post('/login', authController.postLogin)
  .get('/register', authController.getRegister)
  .post('/register', authController.postRegister)
  .post('/logout', authController.postLogout)
  /**********************************************************
   Misc
  **********************************************************/
  .use('/', courseController.getHome);


module.exports = router;
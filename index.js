/*******************************************************************************
 * Feel free to remove this comment block and all other comments after pulling.
 * They're for information purposes only.
 *
 * This layout is provided to you for an easy and quick setup to either pull
 * or use to correct yours after working at least 1 hour on Team Activity 02.
 * Throughout the course, we'll be using Express.js for our view engines.
 * However, feel free to use pug or handlebars ('with extension hbs'). You will
 * need to make sure you install them beforehand according to the reading from
 * Udemy course.
 * IMPORTANT: Make sure to run "npm install" in your root before "npm start"
 *******************************************************************************/
// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 3000; // So we can run on heroku || (OR) localhost:5000
const cors = require('cors')
const mongoose = require('mongoose');
const app = express();
const User = require('./model/users');

// Cors set up
const corsOptions = {
  origin: "https://cse341-lc-prove02.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://testUser:test1234@cluster0.3llkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


// Route setup. You can implement more in the future!
const routes = require('./routes/master-routes');

app.use(express.static(path.join(__dirname, 'public')))
  .use((req, res, next) => {
    User.findById("609f44d9b317c42158360bd7")
      .populate({
        path: "cart",
        populate: {
          path: "items",
          populate:{
            path: "courseId"
          }
        }
      })
      .then(user => {
        req.user = user;
        // user.save()
        next();
      })
      .catch(err => console.log(err));
  })
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser({
    extended: false
  }))
  .use(routes)
  .get('/', (req, res, next) => {
    // This is the primary index, always handled last.
    res.render('pages/index', {
      title: 'Welcome to my CSE341 repo',
      path: '/'
    });
  })
  .use((req, res, next) => {
    // 404 page
    res.render('pages/404', {
      title: '404 - Page Not Found',
      path: req.url
    })
  });

mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          firstName: "Demo",
          lastName: "User",
          userName: "Demo001",
          email: "De@mo.mail",
          password: "$ecret",
          privilege: 3,
          cart: {
            items: []
          },
          courseList: {
            items: []
          }
        });
        user.save();
      }
    })
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
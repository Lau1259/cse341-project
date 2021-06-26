/**********************************************************
 imports
**********************************************************/
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();
const User = require('./model/users');
const routes = require('./routes/master-routes');

/**********************************************************
 Variables
**********************************************************/
const PORT = process.env.PORT || 3000;
// Cors set up
const corsOptions = {
  origin: "https://cse341-lc-prove02.herokuapp.com/",
  optionsSuccessStatus: 200
};

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://testUser:test1234@cluster0.3llkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});

const csrfProtection = csrf();

/**********************************************************
 Route Set Up
**********************************************************/

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.use(session({
  secret: '$3cretCodes',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .populate({
      path: "cart",
      populate: {
        path: "items",
        populate: {
          path: "courseId"
        }
      }
    })
    .populate({
      path: 'courseList',
      populate: {
        path: 'items',
        populate: {
          path: 'courseId'
        }
      }
    })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
})
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
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
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
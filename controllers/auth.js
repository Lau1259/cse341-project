/**********************************************************
 Authentication Logic
**********************************************************/
const bcrypt = require('bcryptjs');

const User = require('../model/users');

module.exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('pages/project/login', {
    path: '/login',
    title: 'Login',
    isAuthenticated: req.session.isLoggedIn
  })
};

module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
      email: email
    })
    .then(user => {
      if (!user) {
        return res.redirect('./login');
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('./');
            });
          }
          res.redirect('./login');
        }).catch(err => {
          console.log(err);
          return res.redirect('./login');
        })

    })
    .catch(err => console.log(err));
};

module.exports.getRegister = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render('pages/project/register', {
    path: '/register',
    title: 'Sign Up',
    isAuthenticated: req.session.isLoggedIn
  })
};

module.exports.postRegister = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({
      email: email
    })
    .then(userDoc => {
      if (userDoc || password !== confirmPassword) {
        return res.redirect('./register');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            cart: {
              items: []
            },
            courseList: {
              items: []
            }
          });
          return newUser.save();
        })
        .then(result => {
          res.redirect('./login');
        })
    })
    .catch(err => {
      console.log(err)
    });
};

module.exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('./');
  });
};
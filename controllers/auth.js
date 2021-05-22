/**********************************************************
 Authentication Logic
**********************************************************/
const bcrypt = require('bcryptjs');

const User = require('../model/users');

module.exports.getLogin = (req, res, next) => {
  res.render('pages/project/login', {
    path: '/login',
    title: 'Login',
    message: req.flash('message'),
    msgType: req.flash('msgType'),
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
        req.flash('message', 'There are no users registered with that email.');
        req.flash('msgType', 'error');
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
          req.flash('message', 'The password you entered is incorrect.');
          req.flash('msgType', 'error');
          res.redirect('./login');
        }).catch(err => {
          console.log(err);
          return res.redirect('./login');
        })

    })
    .catch(err => console.log(err));
};

module.exports.getRegister = (req, res, next) => {
  res.render('pages/project/register', {
    path: '/register',
    title: 'Sign Up',
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
        req.flash('message', 'Passwords must match');
        req.flash('msgType', 'error');
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
          req.flash('message', 'You have successfully created an account, please log in to continue.');
        req.flash('msgType', 'success');
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
/**********************************************************
 Authentication Logic
**********************************************************/
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_KEY
  }
}));


const User = require('../model/users');
const {
  validationResult
} = require('express-validator/check')

/**********************************************************
 Login Logic
**********************************************************/

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
          console.log(`The passwords match = ${doMatch}`);
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
          req.flash('message', 'An error ocurred.');
          req.flash('msgType', 'error');
          return res.redirect('./login');
        })

    })
    .catch(err => console.log(err));
};

/**********************************************************
 Registration logic
**********************************************************/
module.exports.getRegister = (req, res, next) => {
  res.render('pages/project/register', {
    path: '/register',
    title: 'Sign Up',
    message: req.flash('message'),
    msgType: req.flash('msgType'),
  })
};

module.exports.postRegister = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('message', errors.array()[0].msg);
    req.flash('msgType', 'error');
    return res.status(422).render('pages/project/register', {
      path: '/register',
      title: 'Sign Up',
      message: req.flash('message'),
      msgType: req.flash('msgType'),
    });
  }
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

/**********************************************************
 Logout Logic
**********************************************************/
module.exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('./');
  });
};

/**********************************************************
 Password Reset Logic
**********************************************************/
module.exports.getResetPassword = (req, res, next) => {
  res.render('pages/project/reset-password', {
    path: '/reset',
    title: 'Reset Password',
    message: req.flash('message'),
    msgType: req.flash('msgType'),
  })
};

module.exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('./reset');
    }
    const token = buffer.toString('hex');
    console.log(`Token created!`);
    const email = req.body.email;
    User.findOne({
        email: email
      })
      .then(user => {
        if (!user) {
          console.log('No user found');
          req.flash('message', 'No user is registered with that email.');
          req.flash('msgType', 'error');
          return res.redirect('./reset')
        }
        console.log('User found');
        user.resetToken = token;
        user.resetTokenExp = Date.now() + 3600000;
        return user.save();
      }).then(result => {
        res.redirect('./');
        transporter.sendMail({
          //THE HREF MUST CHANGE FOR FINAL VERSION. RIGHT NOW IT LINKS TO LOCALHOST
          to: email,
          from: 'lautaro.cuevas.rodas@gmail.com',
          subject: 'Password Reset',
          html: `<h1>Password Reset Request</h1>
  <p>Hello ${email}, you've requested to change your password. Click <a href="http://localhost:3000/upskill/reset/${token}">here</a> to set a new password: </p>
  <p>If this was unintentional please ignore this message.</p>
  <p>As always, thank you for taking the time to browse our courses to grow with us.</p>
  <h2>Ready to continue learning?</h2>
  <a href="cse341-lc-prove02.herokuapp.com/upskill/courses">Continue Learning</a>`
        });
      }).catch(err => {
        console.log(err);
      })
  });
}

module.exports.getUpdatePassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
      resetToken: token,
      resetTokenExp: {
        $gt: Date.now()
      }
    })
    .then(user => {
      res.render('pages/project/reset-form', {
        path: '/updatePassword',
        title: 'New Password',
        message: req.flash('message'),
        msgType: req.flash('msgType'),
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => {
      console.log(err);
      res.redirect('../')
    });
};

module.exports.postUpdatePassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
      resetToken: passwordToken,
      resetTokenExp: {
        $gt: Date.now()
      },
      _id: userId
    })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExp = undefined;
      return resetUser.save()
    })
    .then(result => {
      res.redirect('./login');
    })
    .catch(err => {
      console.log(err);
      res.redirect('./')
    })
};
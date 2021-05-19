const Mongoose = require('mongoose');
const Course = require('../model/courses');

/**********************************************************
 User Logic
**********************************************************/

module.exports.getNewUser = (req, res, next) => {
  res.render('pages/project/newUser', {
    title: "New User | UpSkill",
    path: "/upskill/newUser",
    isAuthenticated: req.session.isLoggedIn
  });
};

module.exports.getEditUser = (req, res, next) => {
  res.render('pages/project/editUser', {
    title: "Edit User | UpSkill",
    path: "/upskill/editUser",
    isAuthenticated: req.session.isLoggedIn
  });
};

module.exports.postAddUser = (req, res, next) => {
  res.render('pages/project/newUser', {
    title: "New Course | UpSkill",
    path: "/upskill/newUser",
    isAuthenticated: req.session.isLoggedIn
  });
};

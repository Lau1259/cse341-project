const Mongoose = require('mongoose');
const User = require('../model/users');


/**********************************************************
 User Logic
**********************************************************/
module.exports.getUserInfo = (req, res, next) => {
  let user = req.user;
  res.render('pages/project/userInfo', {
    title: `${req.user.firstName} ${req.user.lastName} | UpSkill`,
    path: "/upskill/userInfor",
    action: "./updateUser",
    currentUser: user,
    courses: user.courseList.items
  });
};
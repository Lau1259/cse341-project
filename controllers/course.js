const Mongoose = require('mongoose');
const Course = require('../model/courses');

/**********************************************************
 Home Logic
**********************************************************/
module.exports.getHome = (req, res, next) => {
  console.log(req.session.user)
  res.render('pages/project/home', {
    title: "Welcome to UpSkill",
    path: "/upskill/home",
  });
};


/**********************************************************
 Course Logic
**********************************************************/

module.exports.getNewCourse = (req, res, next) => {
  res.render('pages/project/courseForm', {
    title: "New Course | UpSkill",
    path: "/upskill/newCourse",
    action: "./addCourse",
    actionText: "Add Course",
    course: {}
  });
};

module.exports.postAddCourse = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const desc = req.body.description;
  const imgUrl = req.body.imgUrl;
  const instructor = req.user._id;
  const newCourse = new Course({
    title: title,
    price: price,
    description: desc,
    imgUrl: imgUrl,
    instructor: instructor,
  });
  newCourse
    .save()
    .then(result => {
      console.log('Created Product');
      res.redirect("courses");
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.getEditCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  Course.findById(courseId)
    .then(course => {
      console.log(course);
      res.render('pages/project/courseForm', {
        title: course.title,
        path: "/upskill/newCourse",
        action: "../updateCourse",
        actionText: "Save Changes",
        course: course
      });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.postDeleteCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  Course.findByIdAndRemove(courseId)
    .then(() => {
      console.log('Course Deleted');
      res.redirect("/upskill/courses");
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.postUpdateCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  const newTitle = req.body.title;
  const newPrice = req.body.price;
  const newDesc = req.body.description;
  const newImgUrl = req.body.imgUrl;
  const newInstructor = req.user._id;
  Course.findById(courseId)
    .then(c => {
      c.title = newTitle;
      c.price = newPrice;
      c.desc = newDesc;
      c.imgUrl = newImgUrl;
      c.instructor = newInstructor;
      return c.save();
    })
    .then(result => {
      console.log('Updated Product');
      res.redirect("courses");
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.getCourses = (req, res, next) => {
  Course.find()
    .populate('instructor', '_id firstName lastName')
    .then(courses => {
      res.render('pages/project/courses', {
        title: "Courses | UpSkill",
        path: "/upskill/home",
        courses: courses,
        currentUser: req.session.user,
      });
    });
};

module.exports.getCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  const owned = req.body.owned ? req.body.owned : false;
  Course.findById(courseId)
  .populate('instructor', '_id firstName lastName')
    .then(course => {
      res.render('pages/project/course-details', {
        title: course.title,
        path: "/upskill/course",
        c: course,
        currentUser: req.session.user,
        owned: owned
      });
    })
};
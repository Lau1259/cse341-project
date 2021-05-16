const Mongoose = require('mongoose');
const Course = require('../model/courses');

/**********************************************************
 Home Logic
**********************************************************/
module.exports.getHome = (req, res, next) => {
  res.render('pages/project/home', {
    title: "Welcome to UpSkill",
    path: "/upskill/home",
  });
};


/**********************************************************
 User Logic
**********************************************************/

module.exports.getNewUser = (req, res, next) => {
  res.render('pages/project/newUser', {
    title: "New User | UpSkill",
    path: "/upskill/newUser",
  });
};

module.exports.getEditUser = (req, res, next) => {
  res.render('pages/project/editUser', {
    title: "Edit User | UpSkill",
    path: "/upskill/editUser",
  });
};

module.exports.postAddUser = (req, res, next) => {
  res.render('pages/project/newUser', {
    title: "New Course | UpSkill",
    path: "/upskill/newUser",
  });
};

/**********************************************************
 Cart Logic
**********************************************************/
module.exports.getCart = (req, res, next) => {
  items = req.user.cart.items;
  res.render('pages/project/cart', {
    title: "New Course | UpSkill",
    path: "/upskill/newCourse",
    items: items
  });
};

module.exports.postAddToCart = (req, res, next) => {
  courseId = req.body.courseId;
  Course.findById(courseId)
    .then(course => {
      return req.user.addToCart(course);
    })
    .then(result => {
      console.log(result);
      res.redirect('./courses')
    })
};

module.exports.getClearCart = (req, res, next) => {
  req.user.clearCart()
    .then(result => {
      console.log(result);
      res.redirect('./cart')
    })
};
module.exports.postRemoveFromCart = (req, res, next) => {
  itemId = req.body.itemId;
  Course.findById(itemId)
    .then(course => {
      return req.user.removeFromCart(course);
    })
    .then(result => {
      // console.log(result);
      res.redirect('./cart')
    })
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
  const instructor = req.body.instructor;
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
  const newInstructor = req.body.instructor;
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
    .then(courses => {
      res.render('pages/project/courses', {
        title: "Courses | UpSkill",
        path: "/upskill/home",
        courses: courses,
        currentUser: req.user
      });
    });
};

module.exports.getCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  Course.findById(courseId)
    .then(course => {
      res.render('pages/project/course-details', {
        path: "/upskill/newCourse",
        title: course.title,
        course: course,
        currentUser: req.user
      });
    })
};
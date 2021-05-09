const data = require('../model/upskill');
const courses = data.getData();


module.exports.getHome = (req, res, next) => {
  res.render('pages/project/home', {
    title: "UpSkill | Become Greater",
    path: "/upskill/home"
  })
};

module.exports.getCourses = (req, res, next) => {
  res.render('pages/project/courses', {
    title: "Courses | UpSkill",
    path: "/upskill/courses",
    courses: courses
  })
};

module.exports.getCourseDetails = (req, res, next) => {
  let course = data.details(req.params.courseId, courses);
  res.render('pages/project/course-details', {
    title: `${course.title} | UpSkill`,
    path: "/upskill/courses",
    course: course
  })
};
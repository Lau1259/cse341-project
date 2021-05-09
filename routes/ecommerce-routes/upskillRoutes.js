const express = require('express');
const router = express.Router();

const path = require('path');
const upskillController = require('../../controllers/upskill');

router.use(express.static(path.join(__dirname, 'public')))
.get('/courses', upskillController.getCourses)
.get('/course-details/:courseId', upskillController.getCourseDetails)
.use('/', upskillController.getHome)


module.exports = router;

//TA04 PLACEHOLDER
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('pages/team/ta04', {
      title: 'Team Activity 04',
      path: '/ta04', // For pug, EJS
      activeTA04: true, // For HBS
      contentCSS: true, // For HBS
    });
  })
  .get('/change-style', (req, res, next) => {

  })
  .post('/counter', (req, res, next) => {

  })
  .get('/reset', (req, res, next) => {

  });

module.exports = router;
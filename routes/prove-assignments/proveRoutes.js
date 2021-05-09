const express = require('express');
const router = express.Router();

const prove01 =  require('./prove01-routes');

router.get('/', (req, res, next) => {
  res.render('pages/prove/prove-list', {
    title: 'WDD 330 Prove Assignments',
    path: '/',
  });
});

router.use('/01', prove01);

module.exports = router;
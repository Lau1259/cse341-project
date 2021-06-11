const express = require('express');
const router = express.Router();

const prove01 =  require('./prove01-routes');
const prove08 =  require('./prove08-routes');

router.get('/', (req, res, next) => {
  res.render('pages/prove/prove-list', {
    title: 'WDD 330 Prove Assignments',
    path: '/',
  });
});

router.use('/01', prove01);
router.use('/08', prove08);

module.exports = router;
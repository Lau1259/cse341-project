const express = require('express');
const router = express.Router();

const prove01 =  require('./prove01-routes');
const prove08 =  require('./prove08-routes');
const prove09 =  require('./prove09-routes');
const prove10 =  require('./prove10-routes');
const prove11 =  require('./prove11-routes');

router.get('/', (req, res, next) => {
  res.render('pages/prove/prove-list', {
    title: 'WDD 330 Prove Assignments',
    path: '/',
  });
});

router.use('/01', prove01);
router.use('/08', prove08);
router.use('/09', prove09);
router.use('/10', prove10);
router.use('/11', prove11);

module.exports = router;
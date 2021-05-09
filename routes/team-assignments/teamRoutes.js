const express = require('express');
const router = express.Router();

const ta01Routes = require('./ta01');
const ta02Routes = require('./ta02');
const ta03Routes = require('./ta03');
const ta04Routes = require('./ta04');

router.get('/', (req, res, next) => {
  res.render('pages/team/team-list', {
    title: 'WDD 330 Team Assignments',
    path: '/',
  });
});
router.use('/01', ta01Routes);
router.use('/02', ta02Routes);
router.use('/03', ta03Routes);
router.use('/04', ta04Routes);
module.exports = router;
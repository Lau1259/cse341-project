//TA02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself!
const express = require('express');
const router = express.Router();
const names = ['Lautaro', 'Joel', 'Nic', 'Delfina'];
let message = '';

router.get('/', (req, res, next) => {
  res.render('pages/team/ta02.ejs', {
    title: 'Team Activity 02',
    path: '/',
    message,
    names
  });
});

router.post('/addUser', (req, res, next) => {
  let first = req.body.firstName;
  // console.log("returns: " + checkName(first));
  if (checkName(first) === -1) {
    names.push(first);
    message = '';
  } else {
    message = 'Sorry that name is already in the list';
  }
  res.redirect('./ta02');
});
router.post('/removeUser', (req, res, next) => {
  let first = req.body.firstName;
  let delIndex = checkName(first);
  // console.log("returns: " + checkName(first));
  if (delIndex === -1) {
    message = 'Sorry, that name isn\'t in the list';
  } else {
    names.splice(delIndex, 1);
    message = '';
  }
  res.redirect('./ta02');
});

module.exports = router;

function checkName(firstName) {
  for (i = 0; i < names.length; i++) {
    // console.log(firstName, names[i]);
    if (firstName === names[i]) {
      return i;
    }
  }
  return -1;
}
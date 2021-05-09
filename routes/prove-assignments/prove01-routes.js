const express = require('express');
const helpers = require('../../public/scripts/example');
const router = express.Router();


const users = [{
    username: "ZakAttack96",
    firstName: "Zak",
    lastName: "Shaik",
    email: "zakS@byui.edu"
  },
  {
    username: "jShongwe",
    firstName: "Jared",
    lastName: "Shongwe",
    email: "@byui.edu"
  },
  {
    username: "Cami90210",
    firstName: "Camila",
    lastName: "Davis",
    email: "camiDavis@byui.edu"
  }
];

router.get('/', (req, res, next) => {
  let message = req.query.message;
  console.log(message);
  res.render('pages/prove/prove01a', {
    title: 'Prove 01 - Create User',
    path: '/01/create',
  });
});

router.all('/users', (req, res, next) => {
  res.render('pages/prove/prove01b', {
    title: 'Prove 01 - Users',
    path: '/01/users',
    users: users,
  });
});

router.post('/create-user', (req, res, next) => {
  let username = req.body.username;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  if (isEmpty(username) ||
    isEmpty(firstName) ||
    isEmpty(lastName) ||
    isEmpty(email)
  ) {
    console.log('Please make sure to fill in all fields.')
    res.redirect('/?message=01');
  } else {
    let newUser = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
    };
    users.push(newUser);
    console.log(`${newUser['firstName']} ${newUser['lastName']} was created successfully. A confirmation email was sent to ${newUser['email']}.`);
    res.redirect('./users');
  }
});


function isEmpty(string) {
  if (string === "" ||
    string === null ||
    string === undefined) {
    return true
  } else {
    return false
  }
}

module.exports = router;
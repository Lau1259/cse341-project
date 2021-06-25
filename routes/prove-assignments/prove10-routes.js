const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require('../../data/ta10-data.json')

router.get('/fetchAll', (req, res, next) => {
  res.json(dummyData)
})

router.post('/insert', (req, res, next) => {
  /************************************************
   * INSERT YOUR WEB ENDPOINT CODE HERE
   ************************************************/
  // Typically you should do some sort of filtering and error checking. This is minimal, and makes sure we're not accepting empty values
  if (req.body.newName !== undefined) {
    const newName = req.body.newName
    const realName = req.body.realName
    const heroStyle = req.body.heroStyle
    const heroId = req.body.heroId

    // Make our submissions somewhat unique.
    if (!dummyData.avengers.some(a => a.name === newName)) {
      dummyData.avengers.push({
        name: newName,
        secret_identity: realName,
        class: heroStyle,
        id: heroId
      }) // Push new object into the dummyData
      res.sendStatus(200)
    }
  } else {
    res.sendStatus(400) // Bad request error code
  }
});

router.post('/delete', (req, res, next) => {
  /************************************************
   * INSERT YOUR WEB ENDPOINT CODE HERE
   ************************************************/
  // Typically you should do some sort of filtering and error checking. This is minimal, and makes sure we're not accepting empty values
  if (req.body.heroId !== undefined) {
    dummyData.avengers = dummyData.avengers.filter(hero => {
      return hero.id !== req.body.heroId;
    });
    // console.log(dummyData.avengers);
    res.sendStatus(200)
  } else {
    res.sendStatus(400) // Bad request error code
  }
});

router.get('/', (req, res, next) => {
  let url = 'http://localhost:3000/prove/10/fetchall';
  console.log(url);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const heroes = data.avengers;
      res.render('pages/prove/prove10', {
        title: 'Team Activity 10',
        path: '/teamActivities/10',
        heroes: heroes
      });
    });
});

module.exports = router;
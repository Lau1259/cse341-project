const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const fetch = require('node-fetch');

// Path to your JSON file, although it can be hardcoded in this file.
const dataPath = path.join(__dirname, "..", "..", "data", "heroList.json");
let dummyData = fs.readFileSync(dataPath, "utf-8");

let heroes;
if(!heroes) heroes = JSON.parse(dummyData);


router.get('/fetchAll', (req, res, next) => {
  res.json(heroes)
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
    if (!heroes.avengers.some(a => a.name === newName)) {
      heroes.avengers.push({
        name: newName,
        secret_identity: realName,
        class: heroStyle,
        id: heroId
      })
      // console.log(heroes.avengers);
      res.sendStatus(200)
    }
  } else {
    res.sendStatus(400) // Bad request error code
  }
});

router.post('/delete', (req, res, next) => {
  if (req.body.heroId !== undefined) {
    heroes.avengers = heroes.avengers.filter(hero => {
      return hero.id !== req.body.heroId;
    });
    // console.log(heroes.avengers);
    res.sendStatus(200)
  } else {
    res.sendStatus(400) // Bad request error code
  }
});

router.post('/info', (req, res, next) => {
  if (req.body.heroId !== undefined) {
    let details = heroes.avengers.filter(hero => {
      return hero.id === req.body.heroId;
    })[0];
    // console.log(details)
    res.json(details);
  } else {
    res.sendStatus(400) // Bad request error code
  }
});

router.get('/', (req, res, next) => {
  let url = `http://${req.headers.host}/prove/11/fetchall`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const heroes = data.avengers;
      res.render('pages/prove/prove11', {
        title: 'Prove 11',
        path: '/prove/11',
        heroes: heroes
      });
    });
});

module.exports = router;
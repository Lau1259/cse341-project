const express = require('express');
const router = express.Router();
const cont09 = require('../../controllers/prove09');

router.get('/pokemon/:page', (req, res, next) => {
  console.log("Starting pokemon page")
  const page = req.params.page;
  cont09.getPokemon(page, (pokemon) => {
    res.render('pages/prove/prove09b', {
      path: "09",
      pokemonList: pokemon,
      page: page
    });
  });
})
.get('/', cont09.getPokemonWelcome)
module.exports = router;
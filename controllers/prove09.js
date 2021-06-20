/**********************************************************
 Prove 09 Controller
**********************************************************/
const model = require('../model/pokemonModel');

exports.getPokemon = (pageNum, callback) => {
  // Page 1 will have an offset of 0
  const offset = 10 * (pageNum - 1);
  model.getPokemon(offset, (data) => {
    callback(data);
  });
}

exports.getPokemonWelcome = (req, res, next) => {
  res.render('pages/prove/prove09', {
    path: "09/welcome"
  });
}
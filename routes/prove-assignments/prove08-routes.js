const express = require('express');
const router = express.Router();
const cont08 = require('../../controllers/prove08');

router.get('/', cont08.processJson)
  .post('/', cont08.getIndex);

module.exports = router;
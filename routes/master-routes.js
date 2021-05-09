const express = require('express');
const router = express.Router();

const proveRoutes = require('./prove-assignments/proveRoutes');
const teamRoutes = require('./team-assignments/teamRoutes');
const upskillRoutes = require('./ecommerce-routes/upskillRoutes');

router.use('/prove', proveRoutes)
.use('/team', teamRoutes)
.use('/upskill', upskillRoutes)

module.exports = router;

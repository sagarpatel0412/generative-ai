const express = require('express');
const router = express.Router();
const userRoutes = require('./users/user.routes')

router.use('/v1',userRoutes)

module.exports = router 
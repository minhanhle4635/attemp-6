const express = require('express')
const router = express.Router();

const indexRoute = require('./authenticate.controller');

router.use('/', indexRoute);

router.use('/heath', (req,res) => {res.json({status: 'ok'})});
module.exports = router;

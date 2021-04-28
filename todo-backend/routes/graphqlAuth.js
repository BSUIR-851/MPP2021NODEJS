const express = require('express');
const controller = require('../controllers/graphqlAuth.js');

const router = express.Router();

router.post('/', controller);

module.exports = router;
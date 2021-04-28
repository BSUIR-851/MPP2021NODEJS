const express = require('express');
const passport = require('passport');
const router = express.Router();

const controller = require('../controllers/graphqlTask.js');
const upload = require('../middleware/upload.js');

router.post('/', passport.authenticate('jwt', {session: false}), upload.any(), controller);

module.exports = router;
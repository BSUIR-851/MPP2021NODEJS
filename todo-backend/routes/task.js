const express = require('express');
const passport = require('passport');
const router = express.Router();

const controller = require('../controllers/task.js');
const upload = require('../middleware/upload.js');

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);

router.get('/complete/:id', passport.authenticate('jwt', {session: false}), controller.complete);
router.get('/active', passport.authenticate('jwt', {session: false}), controller.getAllActive);
router.get('/completed', passport.authenticate('jwt', {session: false}), controller.getAllCompleted);

router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.remove);
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('file'), controller.create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('file'), controller.update);


module.exports = router;
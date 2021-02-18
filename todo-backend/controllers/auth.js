const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');
const keys = require('../config/keys.js');
const errorHandler = require('../utils/errorHandler.js');

module.exports.login = async function(req, res) {
	const candidate = await User.findOne({email: req.body.email});

	if (candidate) {
		// check pass
		const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
		if (passwordResult) {
			// generate authorization token
			const token = jwt.sign({
				email: candidate.email,
				userId: candidate._id,
			}, keys.jwt, {expiresIn: 60 * 60 * 24});

			res.status(200).json({
				token: `Bearer ${token}`,
			});

		} else {
			// password is incorrect
			res.status(401).json({
				message: 'Password is incorrect.',
			});
		}

	} else {
		// unknown email => send error
		res.status(404).json({
			message: 'User with this email is not found.',
		});
	}
};

module.exports.register = async function(req, res) {
	const candidate = await User.findOne({email: req.body.email});

	if (candidate) {
		// candidate exists => send error
		res.status(409).json({
			message: 'This email already exists. Try something else.',
		});
	} else {
		// create user
		const salt = bcrypt.genSaltSync(10);
		const password = req.body.password;
		const user = new User({
			email: req.body.email,
			password: bcrypt.hashSync(password, salt),
		});
		try {
			await user.save();
			res.status(201).json(user);
		} catch (e) {
			errorHandler(res, e);
		}
	}
};
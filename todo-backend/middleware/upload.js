const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads/');
	},

	filename(req, file, cb) {
		const date = moment().format('DDMMYYYY-HHmmss_SSS');
		cb(null, `${date}-${file.originalname}`);
	}
});

const fileFilter = (req, file, cb) => {
	cb(null, true);
};

const limits = {
	fileSize: 1024 * 1024 * 50,
};

module.exports = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: limits,
});
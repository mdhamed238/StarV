const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const mongoURI = process.env.MONGO_URI;

const conn = mongoose.createConnection(mongoURI);

// Create storage engine
const storage = new GridFsStorage({
	url: mongoURI,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename =
					buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					filename: filename,
					originalname: file.originalname,
					bucketName: 'videos',
				};
				resolve(fileInfo);
			});
		});
	},
});

// const store = multer.st

const uploadVideo = multer({ storage: multer.memoryStorage() });

module.exports = {
	uploadVideo,
};

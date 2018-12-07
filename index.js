const debug = require('debug')('Uttori.UploadProvider');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

class UploadProvider {
  constructor(config = {}) {
    debug('Contructing...');
    this.config = {
      uploads_dir: '',
      ...config,
    };
    debug('Uploads Directory:', this.config.uploads_dir);

    try {
      fs.mkdirSync(this.config.uploads_dir);
    } catch (e) {}

    /* istanbul ignore next */
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.config.uploads_dir);
      },
      filename(req, file, cb) {
        const filename = `${file.originalname.substr(0, file.originalname.lastIndexOf('.'))}-${Date.now()}${file.originalname.substr(file.originalname.lastIndexOf('.'))}`;
        cb(null, filename);
      },
    });

    this.uploadImageHandler = multer({ storage }).single('file');
  }

  all() {
    return fs.readdirSync(this.config.uploads_dir);
  }

  deleteFile(fileName) {
    debug('Deleting File:', fileName);
    const filePath = path.join(this.config.uploads_dir, fileName);
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      debug('Error Deleting File:', fileName, e);
    }
  }

  readFile(fileName) {
    debug('Reading File:', fileName);
    const filePath = path.join(this.config.uploads_dir, fileName);
    let fileContent = null;
    try {
      fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      debug('Error Readomg File:', fileName, e);
    }

    return fileContent;
  }

  storeFile(req, res, callback) {
    debug('Saving File');
    return this.uploadImageHandler(req, res, callback);
  }
}

module.exports = UploadProvider;

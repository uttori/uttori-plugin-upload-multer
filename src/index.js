const debug = require('debug')('Uttori.UploadProvider');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

class UploadProvider {
  constructor(config = {}) {
    debug('Contructing...');
    this.config = {
      directory: '',
      ...config,
    };
    if (!this.config.directory) {
      debug('No uploads directory provided.');
      throw new Error('No uploads directory provided.');
    }
    debug('Uploads Directory:', this.config.directory);

    try {
      fs.mkdirSync(this.config.directory);
    } catch (error) {}

    /* istanbul ignore next */
    const storage = multer.diskStorage({
      destination: (request, file, callback) => {
        callback(null, this.config.directory);
      },
      filename(request, file, callback) {
        const filename = `${file.originalname.substr(0, file.originalname.lastIndexOf('.'))}-${Date.now()}${file.originalname.substr(file.originalname.lastIndexOf('.'))}`;
        callback(null, filename);
      },
    });

    this.uploadImageHandler = multer({ storage }).single('file');
  }

  all() {
    return fs.readdirSync(this.config.directory);
  }

  deleteFile(fileName) {
    debug('Deleting File:', fileName);
    const filePath = path.join(this.config.directory, fileName);
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      debug('Error Deleting File:', fileName, error);
    }
  }

  readFile(fileName) {
    debug('Reading File:', fileName);
    const filePath = path.join(this.config.directory, fileName);
    let fileContent = null;
    try {
      fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      debug('Error Readomg File:', fileName, error);
    }

    return fileContent;
  }

  storeFile(request, response, callback) {
    debug('Saving File');
    return this.uploadImageHandler(request, response, callback);
  }
}

module.exports = UploadProvider;

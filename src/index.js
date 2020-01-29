const express = require('express');
const debug = require('debug')('Uttori.PLugin.MulterUpload');
const { FileUtility } = require('uttori-utilities');
const multer = require('multer');

/**
 * Uttori Multer Upload
 * @example <caption>MulterUpload</caption>
 * const content = MulterUpload.storeFile(request);
 * @class
 */
class MulterUpload {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   * @return {String} The configuration key.
   * @example <caption>MulterUpload.configKey</caption>
   * const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-upload-multer';
  }

  /**
   * The default configuration.
   * @return {Object} The configuration.
   * @example <caption>MulterUpload.defaultConfig()</caption>
   * const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
   * @static
   */
  static defaultConfig() {
    return {
      // Directory files will be uploaded to.
      directory: 'uploads',

      // Server route to POST uploads to.
      route: '/upload',
    };
  }

  /**
   * Validates the provided configuration for required entries.
   * @param {Object} config - A configuration object.
   * @param {Object} config[MulterUpload.configKey] - A configuration object specifically for this plugin.
   * @example <caption>MulterUpload.validateConfig(config, _context)</caption>
   * MulterUpload.validateConfig({ ... });
   * @static
   */
  static validateConfig(config, _context) {
    debug('Validating config...');
    if (!config || !config[MulterUpload.configKey]) {
      const error = `Config Error: '${MulterUpload.configKey}' configuration key is missing.`;
      debug(error);
      throw new Error(error);
    }
    if (typeof config[MulterUpload.configKey].directory !== 'string') {
      const error = 'Config Error: `directory` should be a string path to where files should be stored.';
      debug(error);
      throw new Error(error);
    }
    if (typeof config[MulterUpload.configKey].route !== 'string') {
      const error = 'Config Error: `route` should be a string server route to where files should be POSTed to.';
      debug(error);
      throw new Error(error);
    }
    debug('Validated config.');
  }

  /**
   * Register the plugin with a provided set of events on a provided Hook system.
   * @param {Object} context - A Uttori-like context.
   * @param {Object} context.hooks - An event system / hook system to use.
   * @param {Function} context.hooks.on - An event registration function.
   * @param {Object} context.config - A provided configuration to use.
   * @param {Object} context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
   * @example <caption>MulterUpload.register(context)</caption>
   * const context = {
   *   hooks: {
   *     on: (event, callback) => { ... },
   *   },
   *   config: {
   *     [MulterUpload.configKey]: {
   *       ...,
   *       events: {
   *         bindRoutes: ['bind-routes'],
   *       },
   *     },
   *   },
   * };
   * MulterUpload.register(context);
   * @static
   */
  static register(context) {
    debug('register');
    if (!context || !context.hooks || typeof context.hooks.on !== 'function') {
      throw new Error("Missing event dispatcher in 'context.hooks.on(event, callback)' format.");
    }
    const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
    if (!config.events) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }
    Object.keys(config.events).forEach((method) => {
      config.events[method].forEach((event) => context.hooks.on(event, MulterUpload[method]));
    });
  }

  /**
   * Add the upload route to the server object.
   * @param {Object} server - An Express server instance.
   * @param {Function} server.post - Function to register route.
   * @param {Function} server.use - Function to register middleware.
   * @param {Object} context - A Uttori-like context.
   * @param {Object} context.config - A provided configuration to use.
   * @param {String} context.config.directory - The file path to save files into.
   * @param {String} context.config.route - The URL to POST files to.
   * @example <caption>MulterUpload.bindRoutes(server, context)</caption>
   * const context = {
   *   config: {
   *     [MulterUpload.configKey]: {
   *       directory: 'uploads',
   *       route: '/upload',
   *     },
   *   },
   * };
   * MulterUpload.bindRoutes(server, context);
   * @static
   */
  static bindRoutes(server, context) {
    debug('bindRoutes');
    const { directory, route } = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
    server.use(route, express.static(directory));
    server.post(route, MulterUpload.upload(context));
  }

  /**
   * The Express route method to process the upload request and provide a response.
   * @param {Object} request - An Express request object.
   * @param {Object} request.file - The uploaded file.
   * @param {String} request.file.filename - The uploaded file's filename.
   * @param {Object} response - An Express response object.
   * @param {Object} next - An Express next function.
   * @example <caption>MulterUpload.upload(request, response, _next)</caption>
   * server.post('/upload', MulterUpload.upload);
   * @static
   */
  static upload(context) {
    return (request, response, _next) => {
      debug('upload');
      const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };

      // Ensure the directory exists.
      /* istanbul ignore next */
      try {
        FileUtility.ensureDirectorySync(config.directory);
      } catch (error) {
        debug('Error creating directory:', error);
      }

      const storage = multer.diskStorage({
        destination: (_request, _file, callback) => {
          callback(null, config.directory);
        },
        filename(_request, file, callback) {
          const name = file.originalname.slice(0, file.originalname.lastIndexOf('.'));
          const extension = file.originalname.slice(file.originalname.lastIndexOf('.'));
          const filename = `${name}-${Date.now()}${extension}`;
          callback(null, filename);
        },
      });

      // Create Multer handler and run.
      const handler = multer({ storage }).single('file');
      handler(request, response, (error) => {
        let status = 200;
        let send = request.file.filename;
        /* istanbul ignore next */
        if (error) {
          debug('Upload Error:', error);
          status = 422;
          send = error;
        }
        return response.status(status).send(send);
      });
    };
  }
}

module.exports = MulterUpload;

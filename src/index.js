const express = require('express');
const { RequestHandler } = require('express');
const debug = require('debug')('Uttori.Plugin.MulterUpload');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

/**
 * @typedef MulterUploadConfig
 * @type {object}
 * @property {object} [events] Events to bind to.
 * @property {string} directory Directory files will be uploaded to.
 * @property {string} route Server route to POST uploads to.
 * @property {string} publicRoute Server route to GET uploads from.
 * @property {RequestHandler[]} middleware Custom Middleware for the Upload route
 */

/**
 * Uttori Multer Upload
 * @example <caption>MulterUpload</caption>
 * const content = MulterUpload.storeFile(request);
 * @class
 */
class MulterUpload {
  /**
   * The configuration key for plugin to look for in the provided configuration.
   * @type {string}
   * @returns {string} The configuration key.
   * @example <caption>MulterUpload.configKey</caption>
   * const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
   * @static
   */
  static get configKey() {
    return 'uttori-plugin-upload-multer';
  }

  /**
   * The default configuration.
   * @returns {MulterUploadConfig} The configuration.
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

      // Server route to GET uploads from.
      publicRoute: '/uploads',

      // Custom Middleware for the Upload route
      middleware: [],
    };
  }

  /**
   * Validates the provided configuration for required entries.
   * @param {object} config A configuration object.
   * @param {object} _context Unused.
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
    if (typeof config[MulterUpload.configKey].publicRoute !== 'string') {
      const error = 'Config Error: `publicRoute` should be a string server route to where files should be GET from.';
      debug(error);
      throw new Error(error);
    }
    if (!Array.isArray(config[MulterUpload.configKey].middleware)) {
      const error = 'Config Error: `middleware` should be an array of middleware.';
      debug(error);
      throw new Error(error);
    }
    debug('Validated config.');
  }

  /**
   * Register the plugin with a provided set of events on a provided Hook system.
   * @param {object} context A Uttori-like context.
   * @param {object} context.hooks An event system / hook system to use.
   * @param {Function} context.hooks.on An event registration function.
   * @param {object} context.config A provided configuration to use.
   * @param {object} context.config.events An object whose keys correspong to methods, and contents are events to listen for.
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
    /** @type {MulterUploadConfig} */
    const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
    if (!config.events) {
      throw new Error("Missing events to listen to for in 'config.events'.");
    }
    Object.keys(config.events).forEach((method) => {
      config.events[method].forEach((event) => {
        if (typeof MulterUpload[method] !== 'function') {
          debug(`Missing function "${method}" for key "${event}"`);
          return;
        }
        context.hooks.on(event, MulterUpload[method]);
      });
    });
  }

  /**
   * Add the upload route to the server object.
   * @param {object} server An Express server instance.
   * @param {Function} server.post Function to register route.
   * @param {Function} server.use Function to register middleware.
   * @param {object} context A Uttori-like context.
   * @param {object} context.config A provided configuration to use.
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
    /** @type {MulterUploadConfig} */
    const { directory, route, publicRoute, middleware } = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
    debug('bindRoutes route:', route);
    debug('bindRoutes directory:', directory);
    server.use(publicRoute, express.static(directory));
    server.post(route, ...middleware, MulterUpload.upload(context));
  }

  /**
   * The Express route method to process the upload request and provide a response.
   * @param {object} context A Uttori-like context.
   * @param {object} context.config A provided configuration to use.
   * @returns {RequestHandler} The function to pass to Express.
   * @example <caption>MulterUpload.upload(context)(request, response, _next)</caption>
   * server.post('/upload', MulterUpload.upload);
   * @static
   */
  static upload(context) {
    return (request, response, _next) => {
      debug('upload');
      /** @type {MulterUploadConfig} */
      const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };

      // Ensure the directory exists.
      /* istanbul ignore next */
      try {
        if (!fs.existsSync(config.directory)) {
          debug('Directory missing, creating:', config.directory);
          fs.mkdirSync(config.directory, { recursive: true });
        }
      } catch (error) {
        debug('Error creating directory:', error);
      }

      const storage = multer.diskStorage({
        destination: (destinationRequest, _file, callback) => {
          // Check for subdirectories ignoring any malicious or weird paths.
          if (destinationRequest.body.fullPath && !destinationRequest.body.fullPath.includes('..') && !destinationRequest.body.fullPath.includes('\0')) {
            try {
              // Extract the subdirectory from the fullPath.
              const subdirectory = path.dirname(destinationRequest.body.fullPath);
              const fullPath = path.join(config.directory, subdirectory);
              // Create the subdirectory if it doesn't exist.
              /* istanbul ignore next */
              if (!fs.existsSync(fullPath)) {
                debug('Subdirectory missing, creating:', fullPath);
                fs.mkdirSync(fullPath, { recursive: true });
              }
              callback(null, fullPath);
              return;
            } catch (error) {
              /* istanbul ignore next */
              debug('Error creating subdirectory:', error);
            }
          }

          // No subdirectory, just the file.
          callback(null, config.directory);
        },
        filename(_request, file, callback) {
          const { name, ext } = path.parse(file.originalname);
          const filename = `${name}-${Date.now()}${ext}`;
          callback(null, filename);
        },
      });

      // Create Multer handler and run.
      const handler = multer({ storage }).single('file');
      handler(request, response, (error) => {
        let status = 200;
        // Respond with the relatize path to the file.
        let send = request.file?.path.replace(config.directory, config.publicRoute);
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

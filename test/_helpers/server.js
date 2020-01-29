/* eslint-disable no-console */
// Server
const express = require('express');
// const ejs = require('ejs');
// const layouts = require('express-ejs-layouts');
// const bodyParser = require('body-parser');
// const path = require('path');

// const StorageProvider = require('uttori-storage-provider-json-file');
// const StorageProvider = require('./../__stubs/StorageProvider.js');
// const SearchProvider = require('./../__stubs/SearchProvider.js');
// const defaultConfig = require('../../src/config.default.js');

const serverSetup = () => {
  // Server Setup
  const server = express();
  server.set('port', process.env.PORT || 8123);
  server.set('ip', process.env.IP || '127.0.0.1');

  // server.set('views', path.join(config.theme_dir, config.theme_name, 'templates'));
  // server.use(layouts);
  // server.set('layout extractScripts', true);
  // server.set('layout extractStyles', true);
  // server.set('view engine', 'html');
  // server.enable('view cache');
  // server.engine('html', ejs.renderFile);

  // Setup Express
  // server.use(express.static(config.public_dir));
  // server.use(bodyParser.json({ limit: '50mb' }));
  // server.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

  // process.title (for stopping after)
  if (process.argv[2] && process.argv[2] !== 'undefined') {
    console.log('Setting process.title:', typeof process.argv[2], process.argv[2]);
    // eslint-disable-next-line prefer-destructuring
    process.title = process.argv[2];
  }

  // Is this a require()?
  if (require.main === module) {
    console.log('Starting test server...');
    server.listen(server.get('port'), server.get('ip'));
  }

  return server;
};

module.exports = { serverSetup };

[![view on npm](https://img.shields.io/npm/v/uttori-plugin-upload-multer.svg)](https://www.npmjs.org/package/uttori-plugin-upload-multer)
[![npm module downloads](https://img.shields.io/npm/dt/uttori-plugin-upload-multer.svg)](https://www.npmjs.org/package/uttori-plugin-upload-multer)
[![Build Status](https://travis-ci.com/uttori/uttori-plugin-upload-multer.svg?branch=master)](https://travis-ci.com/uttori/uttori-plugin-upload-multer)
[![Dependency Status](https://david-dm.org/uttori/uttori-plugin-upload-multer.svg)](https://david-dm.org/uttori/uttori-plugin-upload-multer)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-plugin-upload-multer/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-plugin-upload-multer?branch=master)

# Uttori Plugin - Multer Upload

A plugin to add file uploading using Multer.

## Install

```bash
npm install --save uttori-plugin-upload-multer
```

## Config

```js
{
  // Registration Events
  events: {
    bindRoutes: ['bind-routes'],
  },

  // Directory files will be uploaded to.
  directory: 'uploads',

  // Server route to POST uploads to.
  route: '/upload',

  // Server route to GET uploads from.
  publicRoute: '/uploads',
}
```

* * *

## API Reference

<a name="MulterUpload"></a>

## MulterUpload
Uttori Multer Upload

**Kind**: global class  

* [MulterUpload](#MulterUpload)
    * [.configKey](#MulterUpload.configKey) ⇒ <code>string</code>
    * [.defaultConfig()](#MulterUpload.defaultConfig) ⇒ <code>object</code>
    * [.validateConfig(config, _context)](#MulterUpload.validateConfig)
    * [.register(context)](#MulterUpload.register)
    * [.bindRoutes(server, context)](#MulterUpload.bindRoutes)
    * [.upload(context)](#MulterUpload.upload) ⇒ <code>function</code>

<a name="MulterUpload.configKey"></a>

### MulterUpload.configKey ⇒ <code>string</code>
The configuration key for plugin to look for in the provided configuration.

**Kind**: static property of [<code>MulterUpload</code>](#MulterUpload)  
**Returns**: <code>string</code> - The configuration key.  
**Example** *(MulterUpload.configKey)*  
```js
const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
```
<a name="MulterUpload.defaultConfig"></a>

### MulterUpload.defaultConfig() ⇒ <code>object</code>
The default configuration.

**Kind**: static method of [<code>MulterUpload</code>](#MulterUpload)  
**Returns**: <code>object</code> - The configuration.  
**Example** *(MulterUpload.defaultConfig())*  
```js
const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
```
<a name="MulterUpload.validateConfig"></a>

### MulterUpload.validateConfig(config, _context)
Validates the provided configuration for required entries.

**Kind**: static method of [<code>MulterUpload</code>](#MulterUpload)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object. |
| config.configKey | <code>object</code> | A configuration object specifically for this plugin. |
| _context | <code>object</code> | Unused. |

**Example** *(MulterUpload.validateConfig(config, _context))*  
```js
MulterUpload.validateConfig({ ... });
```
<a name="MulterUpload.register"></a>

### MulterUpload.register(context)
Register the plugin with a provided set of events on a provided Hook system.

**Kind**: static method of [<code>MulterUpload</code>](#MulterUpload)  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | A Uttori-like context. |
| context.hooks | <code>object</code> | An event system / hook system to use. |
| context.hooks.on | <code>function</code> | An event registration function. |
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.events | <code>object</code> | An object whose keys correspong to methods, and contents are events to listen for. |

**Example** *(MulterUpload.register(context))*  
```js
const context = {
  hooks: {
    on: (event, callback) => { ... },
  },
  config: {
    [MulterUpload.configKey]: {
      ...,
      events: {
        bindRoutes: ['bind-routes'],
      },
    },
  },
};
MulterUpload.register(context);
```
<a name="MulterUpload.bindRoutes"></a>

### MulterUpload.bindRoutes(server, context)
Add the upload route to the server object.

**Kind**: static method of [<code>MulterUpload</code>](#MulterUpload)  

| Param | Type | Description |
| --- | --- | --- |
| server | <code>object</code> | An Express server instance. |
| server.post | <code>function</code> | Function to register route. |
| server.use | <code>function</code> | Function to register middleware. |
| context | <code>object</code> | A Uttori-like context. |
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.directory | <code>string</code> | The file path to save files into. |
| context.config.route | <code>string</code> | The URL to POST files to. |

**Example** *(MulterUpload.bindRoutes(server, context))*  
```js
const context = {
  config: {
    [MulterUpload.configKey]: {
      directory: 'uploads',
      route: '/upload',
    },
  },
};
MulterUpload.bindRoutes(server, context);
```
<a name="MulterUpload.upload"></a>

### MulterUpload.upload(context) ⇒ <code>function</code>
The Express route method to process the upload request and provide a response.

**Kind**: static method of [<code>MulterUpload</code>](#MulterUpload)  
**Returns**: <code>function</code> - - The function to pass to Express.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | A Uttori-like context. |
| context.config | <code>object</code> | A provided configuration to use. |
| context.config.directory | <code>string</code> | The file path to save files into. |
| context.config.route | <code>string</code> | The URL to POST files to. |

**Example** *(MulterUpload.upload(context)(request, response, _next))*  
```js
server.post('/upload', MulterUpload.upload);
```

* * *

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
npm install
npm test
DEBUG=Uttori* npm test
```

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)

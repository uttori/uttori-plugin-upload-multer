[![view on npm](https://img.shields.io/npm/v/@uttori/plugin-upload-multer.svg)](https://www.npmjs.com/package/@uttori/plugin-upload-multer)
[![npm module downloads](https://img.shields.io/npm/dt/@uttori/plugin-upload-multer.svg)](https://www.npmjs.com/package/@uttori/plugin-upload-multer)
[![Build Status](https://travis-ci.com/uttori/uttori-plugin-upload-multer.svg?branch=master)](https://travis-ci.com/uttori/uttori-plugin-upload-multer)
[![Coverage Status](https://coveralls.io/repos/github/uttori/uttori-plugin-upload-multer/badge.svg?branch=master)](https://coveralls.io/github/uttori/uttori-plugin-upload-multer?branch=master)
![dependency status](https://img.shields.io/librariesio/release/npm/@uttori/plugin-upload-multer)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@uttori/plugin-upload-multer?label=Minified%20%2B%20GZip)

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

  // Custom Middleware for the Upload route
  middleware: [],
}
```

### Nested Uploads

When supplised with a `fullPath` key, nested uploads will retain their paths on upload:

```js
  // File Uploads
  try {
    // https://docs.dropzone.dev/configuration/basics/configuration-options
    Dropzone.options.fileupload = {
      paramName: 'file',
      withCredentials: true,
      init: function init() {
        // Allow dropping a folder to upload all files.
        this.hiddenFileInput.setAttribute('webkitdirectory', true);
      },
    };

    const dropzone = new Dropzone('.dropzone');

    // Add more information to the file uploads.
    dropzone.on('sending', (file, _xhr, formData) => {
      formData.append('fullPath', file.fullPath || '');
      formData.append('filesize', file.size || 0);
      formData.append('lastModified', file.lastModified || Date.now());
    });

    // Read the upload path from the elements data-upload attribute and escape any text sent back from the server.
    dropzone.on('success', (file, responseText) => {
      // Create the correct type of Markdown link.
      let linkToUploadedFile = `[${file.name}](${encodeURI(responseText)})`;
      if (file.type.startsWith('image/')) {
        linkToUploadedFile = `![${file.name}](${encodeURI(responseText)})`;
      } else if (file.type.startsWith('video/')) {
        linkToUploadedFile = `<video controls playsinline muted src="${responseText}"></video>`;
      }

      // Copy to clipboard.
      navigator.clipboard.writeText(linkToUploadedFile).then(() => {
        console.log('Async: Copying to clipboard was successful!');
      }, (error) => {
        console.error('Async: Could not copy text: ', error);
      });

      // Append to the content.
      /** @type {HTMLTextAreaElement | null} */
      const textarea = document.querySelector('textarea#editing');
      if (textarea) {
        textarea.value = `${textarea.value}\n${linkToUploadedFile}\n`;
        textarea.dispatchEvent(new Event('input'));
      }
    });
  } catch (error) {
    console.error('Dropzone Error:', error);
  }
```

* * *

## API Reference

## Classes

<dl>
<dt><a href="#MulterUpload">MulterUpload</a></dt>
<dd><p>Uttori Multer Upload</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#MulterUploadConfig">MulterUploadConfig</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="MulterUpload"></a>

## MulterUpload
Uttori Multer Upload

**Kind**: global class  

* [MulterUpload](#MulterUpload)
    * [.configKey](#MulterUpload.configKey) ⇒ <code>string</code>
    * [.defaultConfig()](#MulterUpload.defaultConfig) ⇒ [<code>MulterUploadConfig</code>](#MulterUploadConfig)
    * [.validateConfig(config, _context)](#MulterUpload.validateConfig)
    * [.register(context)](#MulterUpload.register)
    * [.bindRoutes(server, context)](#MulterUpload.bindRoutes)
    * [.upload(context)](#MulterUpload.upload) ⇒ <code>RequestHandler</code>

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

### MulterUpload.defaultConfig() ⇒ [<code>MulterUploadConfig</code>](#MulterUploadConfig)
The default configuration.

**Kind**: static method of [<code>MulterUpload</code>](#MulterUpload)  
**Returns**: [<code>MulterUploadConfig</code>](#MulterUploadConfig) - The configuration.  
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

### MulterUpload.upload(context) ⇒ <code>RequestHandler</code>
The Express route method to process the upload request and provide a response.

**Kind**: static method of [<code>MulterUpload</code>](#MulterUpload)  
**Returns**: <code>RequestHandler</code> - The function to pass to Express.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>object</code> | A Uttori-like context. |
| context.config | <code>object</code> | A provided configuration to use. |

**Example** *(MulterUpload.upload(context)(request, response, _next))*  
```js
server.post('/upload', MulterUpload.upload);
```
<a name="MulterUploadConfig"></a>

## MulterUploadConfig : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [events] | <code>object</code> | Events to bind to. |
| directory | <code>string</code> | Directory files will be uploaded to. |
| route | <code>string</code> | Server route to POST uploads to. |
| publicRoute | <code>string</code> | Server route to GET uploads from. |
| middleware | <code>Array.&lt;RequestHandler&gt;</code> | Custom Middleware for the Upload route |


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

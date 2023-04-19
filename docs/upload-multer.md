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


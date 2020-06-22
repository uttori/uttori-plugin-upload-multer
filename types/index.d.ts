/**
 * Uttori Multer Upload
 * @example
 * <caption>MulterUpload</caption>
 * const content = MulterUpload.storeFile(request);
 */
declare class MulterUpload {
    /**
     * The configuration key for plugin to look for in the provided configuration.
     * @example
     * <caption>MulterUpload.configKey</caption>
     * const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
     */
    static configKey: string;
    /**
     * The default configuration.
     * @example
     * <caption>MulterUpload.defaultConfig()</caption>
     * const config = { ...MulterUpload.defaultConfig(), ...context.config[MulterUpload.configKey] };
     * @returns The configuration.
     */
    static defaultConfig(): any;
    /**
     * Validates the provided configuration for required entries.
     * @example
     * <caption>MulterUpload.validateConfig(config, _context)</caption>
     * MulterUpload.validateConfig({ ... });
     * @param config - A configuration object.
     * @param config.configKey - A configuration object specifically for this plugin.
     * @param _context - Unused.
     */
    static validateConfig(config: {
        configKey: any;
    }, _context: any): void;
    /**
     * Register the plugin with a provided set of events on a provided Hook system.
     * @example
     * <caption>MulterUpload.register(context)</caption>
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
     * @param context - A Uttori-like context.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     */
    static register(context: {
        hooks: {
            on: (...params: any[]) => any;
        };
        config: {
            events: any;
        };
    }): void;
    /**
     * Add the upload route to the server object.
     * @example
     * <caption>MulterUpload.bindRoutes(server, context)</caption>
     * const context = {
     *   config: {
     *     [MulterUpload.configKey]: {
     *       directory: 'uploads',
     *       route: '/upload',
     *     },
     *   },
     * };
     * MulterUpload.bindRoutes(server, context);
     * @param server - An Express server instance.
     * @param server.post - Function to register route.
     * @param server.use - Function to register middleware.
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.directory - The file path to save files into.
     * @param context.config.route - The URL to POST files to.
     */
    static bindRoutes(server: {
        post: (...params: any[]) => any;
        use: (...params: any[]) => any;
    }, context: {
        config: {
            directory: string;
            route: string;
        };
    }): void;
    /**
     * The Express route method to process the upload request and provide a response.
     * @example
     * <caption>MulterUpload.upload(context)(request, response, _next)</caption>
     * server.post('/upload', MulterUpload.upload);
     * @param context - A Uttori-like context.
     * @param context.config - A provided configuration to use.
     * @param context.config.directory - The file path to save files into.
     * @param context.config.route - The URL to POST files to.
     * @returns - The function to pass to Express.
     */
    static upload(context: {
        config: {
            directory: string;
            route: string;
        };
    }): (...params: any[]) => any;
}


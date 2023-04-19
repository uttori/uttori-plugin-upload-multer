import express = require('express');

declare module '@uttori/plugin-upload-multer';

export class MulterUpload {
  static get configKey(): string;

  static defaultConfig(): MulterUploadConfig;

  static validateConfig(config: {
        configKey: MulterUploadConfig;
    }, _context: object): void;

  static register(context: {
        hooks: {
            on: Function;
        };
        config: {
            events: object;
        };
    }): void;

  static bindRoutes(server: {
        post: Function;
        use: Function;
    }, context: {
        config: {
            directory: string;
            route: string;
        };
    }): void;

  static upload(context: {
        config: {
            directory: string;
            route: string;
        };
    }): express.RequestHandler;
}

export type MulterUploadConfig = {
    events?: object;
    directory: string;
    route: string;
    publicRoute: string;
    middleware: express.RequestHandler[];
};

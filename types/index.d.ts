declare module '@uttori/plugin-upload-multer';

declare module "index" {
    export = MulterUpload;
    class MulterUpload {
        static get configKey(): string;
        static defaultConfig(): object;
        static validateConfig(config: {
            configKey: object;
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
        }): Function;
    }
}

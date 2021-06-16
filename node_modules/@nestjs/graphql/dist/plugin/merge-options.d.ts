export interface PluginOptions {
    typeFileNameSuffix?: string | string[];
    introspectComments?: boolean;
}
export declare const mergePluginOptions: (options?: Record<string, any>) => PluginOptions;

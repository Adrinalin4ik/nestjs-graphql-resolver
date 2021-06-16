import { ArgsParamMetadata } from '../metadata';
export declare class CannotDetermineArgTypeError extends Error {
    constructor(hostType: string, param: ArgsParamMetadata);
}

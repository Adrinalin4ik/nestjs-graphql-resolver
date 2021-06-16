import { EnumMetadataValuesMap } from '../schema-builder/metadata';
export interface EnumOptions<T extends object = any> {
    name: string;
    description?: string;
    valuesMap?: EnumMetadataValuesMap<T>;
}
export declare function registerEnumType<T extends object = any>(enumRef: T, options: EnumOptions<T>): void;

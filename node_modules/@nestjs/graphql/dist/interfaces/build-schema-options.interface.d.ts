import { GraphQLDirective, GraphQLScalarType } from 'graphql';
import { FieldMiddleware } from './field-middleware.interface';
export declare type DateScalarMode = 'isoDate' | 'timestamp';
export declare type NumberScalarMode = 'float' | 'integer';
export interface ScalarsTypeMap {
    type: Function;
    scalar: GraphQLScalarType;
}
export interface BuildSchemaOptions {
    dateScalarMode?: DateScalarMode;
    numberScalarMode?: NumberScalarMode;
    scalarsMap?: ScalarsTypeMap[];
    orphanedTypes?: Function[];
    skipCheck?: boolean;
    directives?: GraphQLDirective[];
    schemaDirectives?: Record<string, any>;
    fieldMiddleware?: FieldMiddleware[];
}

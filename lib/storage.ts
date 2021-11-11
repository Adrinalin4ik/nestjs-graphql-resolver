import { BaseEntity } from "typeorm";
import { IPolymorphicRelationParams } from "./decorators/polymorphic.decorator";

const storage: IStorage = {
  objectTypes: [],
  relations:[],
  polymorphicRelations: [],
  config: {},
  fields: []
};

export default storage;

interface IConfig {
  scoping?: {
    headerName?: string;
    urlParamName?: string;
  }
}

interface IStorage {
  relations: IRelation[];
  objectTypes: IObjectType[];
  polymorphicRelations: (IPolymorphicRelation & IPolymorphicRelationParams)[];
  config: IConfig;
  fields: IObjectField[];
}

interface IRelation {
  propertyName: string;
  fromTable: typeof BaseEntity; 
  toTable: typeof BaseEntity; 
  joinPropertyName: string;
}

interface IObjectType {
  graphqlName: string;
  tableName: string;
  objectName: string;
  extendedObjectName?: string;
}

interface IPolymorphicRelation {
  objectName: string;
  propertyName: string;
}

interface IObjectField {
  propertyName: string | symbol;
  propertyType: any;
  objectName: string;
}
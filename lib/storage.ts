import { BaseEntity } from "typeorm";
import { IPolymorphicRelationParams } from "./decorators/polymorphic.decorator";

const storage: IStorage = {
  objectTypes: [],
  relations:[],
  polymorphicRelations: [],
  config: {}
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
}

interface IRelation {
  fromTable: typeof BaseEntity, 
  toTable: typeof BaseEntity, 
  joinPropertyName: string
}

interface IObjectType {
  graphqlName: string,
  tableName: string,
  objectName: string
}

interface IPolymorphicRelation {
  objectName: string;
  propertyName: string;
}
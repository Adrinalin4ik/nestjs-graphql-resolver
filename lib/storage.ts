import { BaseEntity } from "typeorm";
import { IPolymorphicRelationParams } from "./decorators/polymorphic.decorator";

const storage: IStorage = {
  objectTypes: [],
  relations:[],
  polymorphicRelations: [],
};

export default storage;


interface IStorage {
  relations: IRelation[];
  objectTypes: IObjectType[];
  polymorphicRelations: (IPolymorphicRelation & IPolymorphicRelationParams)[];
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
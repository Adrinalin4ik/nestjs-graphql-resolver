import { BaseEntity } from 'typeorm';
import storage from '../storage';

export interface IPolymorphicRelationParams {
  typePropertyName: string;
  idPropertyName: string;
}

export const PolymorphicRelation = ({
  typePropertyName,
  idPropertyName,
}: IPolymorphicRelationParams) => {
  return (obj, propertyName) => {
    storage.polymorphicRelations.push({
      objectName: obj.constructor.name,
      propertyName,
      typePropertyName,
      idPropertyName,
    })
  };
};

import { BaseEntity } from 'typeorm';
import storage from '../storage';

export interface IPolymorphicRelationParams {
  typePropertyName: string;
  idPropertyName: string;
  resolveType: (type: string) => typeof BaseEntity;
}

export const PolymorphicRelation = ({
  typePropertyName,
  idPropertyName,
  resolveType
}: IPolymorphicRelationParams) => {
  return (obj, propertyName) => {
    storage.polymorphicRelations.push({
      objectName: obj.constructor.name,
      propertyName,
      typePropertyName,
      idPropertyName,
      resolveType
    })
  };
};

import { BaseEntity } from 'typeorm';
import storage from '../storage';

export const JoinColumnField = (fromTable: typeof BaseEntity, toTable: typeof BaseEntity, joinPropertyName: string) => {
  return (_dto, propertyName) => {
    storage.relations.push({
      propertyName, fromTable, toTable, joinPropertyName
    })
  };
};

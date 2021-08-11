import { BaseEntity } from 'typeorm';
import storage from '../storage';

export const JoinColumnField = (fromTable: typeof BaseEntity, toTable: typeof BaseEntity, joinPropertyName: string) => {
  return (...args) => {
    storage.relations.push({
      fromTable, toTable, joinPropertyName
    })
  };
};

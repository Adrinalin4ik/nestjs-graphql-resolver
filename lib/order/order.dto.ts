import { registerEnumType, InputType } from '@nestjs/graphql';
import { getMetadataArgsStorage } from 'typeorm';
import { decorateField } from '../helpers/decorators';
import { camelCase } from 'change-case';
import { capitalize } from '../helpers/string.helper';
import * as pluralize from 'pluralize';
import { AggregationEnum } from '../aggregations/aggregations.dto';
import storage from '../storage';

export enum OrderTypeEnum {
  desc = 'desc',
  desc_null_first = 'desc_null_first',
  desc_null_last = 'desc_null_last',
  asc = 'asc',
  asc_null_first = 'asc_null_first',
  asc_null_last = 'asc_null_last',
}

registerEnumType(OrderTypeEnum, {
  name: 'OrderTypeEnum',
});


const inputTypes = new Map();

export const generateOrderInputType = (propName: string) => {
  const entityName = capitalize(camelCase(pluralize.singular(propName)));
  const existType = inputTypes.get(entityName);
  if (existType) {
    return existType;
  }

  const entityMeta = getMetadataArgsStorage();
  function EntityOrderInputType() {}

  const table = entityMeta.tables.find(x => x.target['name'].toLowerCase() === entityName.toLowerCase())
  const extendedTableName = table?.target['__proto__'].name;

  const relations = entityMeta.relations.filter(
    (x) => [extendedTableName?.toLowerCase(), entityName.toLowerCase()].includes(x.target['name'].toLowerCase()),
  );

  relations.forEach(rel => {
    const propertyName = capitalize(camelCase(pluralize.singular(rel.propertyName)));
    const relationMeta = storage.relations.find(x => x.fromTable === rel.target && x.toTable === (rel.type as any)());
    const relationTable =  capitalize(camelCase(pluralize.singular((relationMeta?.toTable.name.toLowerCase() || propertyName))));
    
    decorateField(EntityOrderInputType, rel.propertyName, () => inputTypes.get(relationTable));
  });

  const colums = entityMeta.columns.filter(
    (x) => [extendedTableName?.toLowerCase(), entityName.toLowerCase()].includes(x.target['name'].toLowerCase()),
  );

  colums.forEach(col => {
    decorateField(EntityOrderInputType, col.propertyName, () => OrderTypeEnum);
  })
  

  Object.values(AggregationEnum).forEach(op => {
    decorateField(EntityOrderInputType, op, () => EntityOrderInputType)
  })

  Object.defineProperty(EntityOrderInputType, 'name', {
    value: `${entityName}EntityOrderInputType`,
  });

  InputType()(EntityOrderInputType);
  

  inputTypes.set(entityName, EntityOrderInputType)
  return EntityOrderInputType;
}
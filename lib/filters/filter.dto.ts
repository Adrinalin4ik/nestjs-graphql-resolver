import { InputType } from '@nestjs/graphql';
import { camelCase } from 'change-case';
import * as pluralize from 'pluralize';
import { getMetadataArgsStorage } from 'typeorm';
import { AggregationEnum } from '../aggregations/aggregations.dto';
import { builtInPremitiveGQLType } from '../dto/entity-helper.dto';
import { decorateField } from '../helpers/decorators';
import { capitalize } from '../helpers/string.helper';
import storage from '../storage';
export enum OperatorQuery {
  and = 'and',
  or = 'or',
}

export enum OperationQuery {
  eq = '=',
  neq = '!=',
  gt = '>',
  gte = '>=',
  lt = '<',
  lte = '<=',
  in = 'IN',
  ilike = 'ILIKE',
  notilike = 'not ILIKE',
  between = 'BETWEEN',
  notbetween = 'NOT BETWEEN',
  null = 'IS NULL',
  notnull = 'IS NOT NULL',
}

const arrayLikeOperations = new Set([OperationQuery.between, OperationQuery.notbetween, OperationQuery.in]);

const inputTypes = new Map();
const propertyTypes = new Map()

const generatePropertyType = (type) => {
  const key = `${type.name}_property_filter_type`;

  const propType = propertyTypes.get(key);
  if (propType) return propType;

  function PropertyFilter() {}

  Object.keys(OperationQuery).forEach(operationName => {
    decorateField(PropertyFilter, operationName, () => {
      if (arrayLikeOperations.has(OperationQuery[operationName])) {
        return [type];
      } if ([OperationQuery.null, OperationQuery.notnull].includes(OperationQuery[operationName])) {
        return Boolean;
      } else {
        return type;
      }
    }, {
      nullable: true
    });
  })

  InputType(key)(PropertyFilter);
  propertyTypes.set(key, PropertyFilter)
  return PropertyFilter;
}

export const generateFilterInputType = (propName: string) => {
  const entityName = capitalize(camelCase(pluralize.singular(propName)));
  const existType = inputTypes.get(entityName);
  if (existType) {
    return existType;
  }

  const entityMeta = getMetadataArgsStorage();
  function EntityFilterInputType() {}

  const table = entityMeta.tables.find(x => x.target['name'].toLowerCase() === entityName.toLowerCase())
  const extendedTableName = table?.target['__proto__'].name;
  const dtoObjectMeta = storage.objectTypes.find(x => x.tableName === entityName);

  const relations = entityMeta.relations.filter(
    (x) => [extendedTableName?.toLowerCase(), entityName.toLowerCase()].includes(x.target['name'].toLowerCase()),
  );

  relations.forEach(rel => {
    const propertyName = capitalize(camelCase(pluralize.singular(rel.propertyName)));
    const relationMeta = storage.relations.find(x => x.fromTable === rel.target && x.toTable === (rel?.type as any)() && x.propertyName === rel.propertyName);
    const relationTable =  capitalize(camelCase(pluralize.singular((relationMeta?.toTable.name || propertyName))));
    
    decorateField(EntityFilterInputType, rel.propertyName, () => inputTypes.get(relationTable));
  });

  const colums = entityMeta.columns.filter(
    (x) => [extendedTableName?.toLowerCase(), entityName.toLowerCase()].includes(x.target['name'].toLowerCase()),
  );
  
  colums.forEach(col => {
    let objType;
    const gqlPropType = storage.fields.find(x => x.propertyName === col.propertyName && (x.objectName === dtoObjectMeta?.objectName || x.objectName === dtoObjectMeta?.extendedObjectName));
    if (gqlPropType) {
      objType = gqlPropType.propertyType;
    } else if (builtInPremitiveGQLType.has(col.options?.type?.['prototype']?.constructor?.name?.toLowerCase())) {
      objType = col.options?.type;
    } else {
      switch(col.options?.type) {
        case 'uuid':
          objType = String;
          break;
        default: objType = String;
      }
    }


      const propType = generatePropertyType(objType)
      decorateField(EntityFilterInputType, col.propertyName, () => propType);
  })
  

  Object.values(OperatorQuery).forEach(op => {
    decorateField(EntityFilterInputType, op, () => [EntityFilterInputType])
  })

  Object.values(AggregationEnum).forEach(op => {
    decorateField(EntityFilterInputType, op, () => EntityFilterInputType)
  })

  Object.defineProperty(EntityFilterInputType, 'name', {
    value: `${entityName}EntityFilterInputType`,
  });

  InputType()(EntityFilterInputType);
  

  inputTypes.set(entityName, EntityFilterInputType)
  return EntityFilterInputType;
}
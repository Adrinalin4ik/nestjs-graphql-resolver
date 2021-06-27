import { registerEnumType, InputType, Field, IntersectionType, PartialType, TypeMetadataStorage, GraphQLISODateTime } from '@nestjs/graphql';
import { GqlType } from '../helpers/classes';
import { Competency } from 'src/entities/competency/competency.entity';
import { BaseEntity, getMetadataArgsStorage } from 'typeorm';
import { builtInPremitiveGQLType, getEntityNameEnum } from '../dto/entity-helper.dto';
import { decorateField } from '../helpers/decorators';
import { camelCase } from 'change-case';
import { capitalize } from '../helpers/string.helper';
import * as pluralize from 'pluralize';
import { AggregationEnum } from '../aggregations/aggregations.dto';


export enum OperatorQuery {
  and = 'and',
  or = 'or',
}

// registerEnumType(OperatorQuery1, {
//   name: 'Operator1',
// });

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

export const generateFilterInputType = (entityName: string) => {
  const existType = inputTypes.get(entityName);
  if (existType) {
    return existType;
  }

  const entityMeta = getMetadataArgsStorage();
  function EntityFilterInputType() {}

  const relations = entityMeta.relations.filter(
    (x) => x.target['name'].toLowerCase() == entityName.toLowerCase(),
  );

  relations.forEach(rel => {
    const propName = capitalize(camelCase(pluralize.singular(rel.propertyName)));
    decorateField(EntityFilterInputType, rel.propertyName, () => inputTypes.get(propName));
  });

  const colums = entityMeta.columns.filter(
    (x) => x.target['name'].toLowerCase() == entityName.toLowerCase(),
  );

  colums.forEach(col => {
    const objType = builtInPremitiveGQLType.has(
      col.options?.type?.['prototype']?.constructor?.name?.toLowerCase(),
    )
      ? col.options?.type
      : GraphQLISODateTime;

      const propType = generatePropertyType(objType)
      decorateField(EntityFilterInputType, col.propertyName, () => propType);
  })
  

  Object.values(OperatorQuery).forEach(op => {
    decorateField(EntityFilterInputType, op, () => [EntityFilterInputType])
  })

  // Object.values(AggregationEnum).forEach(op => {
  //   decorateField(EntityFilterInputType, op, () => [EntityFilterInputType])
  // })

  Object.defineProperty(EntityFilterInputType, 'name', {
    value: `${entityName}EntityFilterInputType`,
  });

  InputType()(EntityFilterInputType);
  

  inputTypes.set(entityName, EntityFilterInputType)
  return EntityFilterInputType;
}
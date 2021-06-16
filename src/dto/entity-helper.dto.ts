import {
  GraphQLISODateTime,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BaseEntity, getMetadataArgsStorage } from 'typeorm';
import { decorateField } from '../helpers/decorators';

const builtInPremitiveGQLType = new Set(['string', 'number', 'boolean']);

export let EntityNameEnum;
export const EntityAggregationParametersEnum = new Map();
export const EntityAggregationParametersType = new Map();

const generateEntityAggregationParametersType = (entity: BaseEntity) => {
  const entityName = entity['constructor']['name'];
  const entityMeta = getMetadataArgsStorage();

  if (!EntityAggregationParametersEnum.has(entityName)) {
    enum EntityPrimitiveFieldEnum {}
    class EntityPrimitiveFieldType {}
    const columns = entityMeta.columns.filter(
      (x) => x.target['name'] == entityName,
    );
    // const columns = entityMeta.columns.filter((x) => {
    //   const type = x.options?.type
    //     ? typeof x.options?.type?.toString()
    //     : x.mode;
    //   return (
    //     ['createDate', 'string', 'number', 'boolean'].includes(type) &&
    //     x.target['name'] == entityName
    //   );
    // });

    for (const col of columns) {
      const key = col.propertyName.toLowerCase();
      EntityPrimitiveFieldEnum[key] = key;

      registerEnumType(EntityPrimitiveFieldEnum, {
        name: `${entityName}PrimitiveEnum`,
      });

      decorateField(
        EntityPrimitiveFieldType,
        col.propertyName.toLowerCase(),
        builtInPremitiveGQLType.has(
          col.options?.type?.['prototype']?.constructor?.name?.toLowerCase(),
        )
          ? col.options?.type
          : GraphQLISODateTime,
      );
    }

    EntityAggregationParametersEnum.set(entityName, EntityPrimitiveFieldEnum);

    ObjectType()(EntityPrimitiveFieldType);

    Object.defineProperty(EntityPrimitiveFieldType, 'name', {
      value: `${entityName}PrimitiveFieldType`,
    });

    EntityAggregationParametersType.set(entityName, EntityPrimitiveFieldType);

    return EntityPrimitiveFieldEnum;
  } else {
    return EntityAggregationParametersEnum.get(entityName);
  }
};

export const getEntityPrimitiveEnum = (entity: BaseEntity) => {
  if (!EntityAggregationParametersEnum.has(entity['name'])) {
    generateEntityAggregationParametersType(entity['prototype']);
  }
  return EntityAggregationParametersEnum.get(entity['name']);
};

export const getEntityPrimitiveType = (entity: BaseEntity) => {
  if (!EntityAggregationParametersType.has(entity['name'])) {
    generateEntityAggregationParametersType(entity['prototype']);
  }

  return EntityAggregationParametersType.get(entity['name']);
};

export const getEntityNameEnum = () => {
  if (!EntityNameEnum) {
    enum EntityName {}
    setTimeout(() => {
      const entityMeta = getMetadataArgsStorage();
      const tablesNames = entityMeta.tables.reduce((acc, t) => {
        if (t.target['prototype'] instanceof BaseEntity) {
          acc.add(t.target['name']);
        }
        return acc;
      }, new Set<string>());

      tablesNames.forEach((name) => {
        EntityName[name] = name;
      });

      // EntityName['test'] = 'test';

      registerEnumType(EntityName, {
        name: 'EntityName',
      });
    })

    EntityNameEnum = EntityName;
  }
  return EntityNameEnum;
};

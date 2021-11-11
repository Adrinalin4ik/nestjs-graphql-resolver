import {
  ObjectType,
  registerEnumType
} from '@nestjs/graphql';
import { BaseEntity, getMetadataArgsStorage } from 'typeorm';
import { GqlType } from '../helpers/classes';
import { decorateField } from '../helpers/decorators';
import storage from '../storage';

export const builtInPremitiveGQLType = new Set(['string', 'number', 'boolean']);

export let EntityNameEnum;
export const EntityAggregationParametersEnum = new Map();
export const EntityAggregationParametersType = new Map();

const generateEntityAggregationParametersType = (entity: GqlType) => {
  const entityName = entity.graphqlName;
  const entityMeta = getMetadataArgsStorage();
  const dtoObjectMeta = storage.objectTypes.find(x => x.tableName === entityName);

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

      let objType;
      const gqlPropType = storage.fields.find(x => x.propertyName === col.propertyName && x.objectName === dtoObjectMeta.objectName );

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

      registerEnumType(EntityPrimitiveFieldEnum, {
        name: `${entityName}PrimitiveEnum`,
      });
      
      decorateField(
        EntityPrimitiveFieldType,
        col.propertyName.toLowerCase(),
        () => objType);
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

export const getEntityPrimitiveEnum = (entity: GqlType) => {
  if (!EntityAggregationParametersEnum.has(entity.graphqlName)) {
    generateEntityAggregationParametersType(entity);
  }
  return EntityAggregationParametersEnum.get(entity.graphqlName);
};

export const getEntityPrimitiveType = (entity: GqlType) => {
  if (!EntityAggregationParametersType.has(entity.graphqlName)) {
    generateEntityAggregationParametersType(entity);
  }

  return EntityAggregationParametersType.get(entity.graphqlName);
};

export const getEntityNameEnum = () => {
  if (!EntityNameEnum) {
    enum EntityName {}
    // костыль!!!
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
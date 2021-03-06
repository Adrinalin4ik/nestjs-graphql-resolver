import { Field, ObjectType, ObjectTypeOptions } from '@nestjs/graphql';
import { getMetadataArgsStorage } from 'typeorm';
import { generateGroupAggType } from '../aggregations/aggregations.dto';
import { GqlType } from '../helpers/classes';
import { addDecoratedMethodToClass } from '../helpers/decorators';
import { ESubscriberType, generateSubscriberName, getDecoratorByOperationType } from '../helpers/subscribers';
import { pubsub } from '../pubsub';
import storage from '../storage';
interface ObjectTypeOptionsExtended extends ObjectTypeOptions {
  name?: string;
  tableName?: string;
  subscribers?: ESubscriberType[];
  autoSubscriptionEnabled?: boolean;
}


export const EntityObjectTypes = new Map();

export const EntityObjectType = (options?: ObjectTypeOptionsExtended) => {
  return (dto) => {
    const typeName = options?.name || dto['name'];

    Object.defineProperty(dto, 'graphqlName', {
      value: typeName,
    });

    Object.defineProperty(dto, 'tableName', {
      value: typeName,
    });

    storage.objectTypes.push({
      graphqlName: typeName,
      tableName: typeName,
      objectName: dto.name,
      extendedObjectName: dto?.['__proto__']?.name
    })
    
    if (options?.autoSubscriptionEnabled) {
      addSubscribers(typeName, options?.subscribers);
    }
    // To avoid n+1 I have to create a field inside a model
    addGroupAggField(dto);

    const type = ObjectType(typeName, options)(dto);
    EntityObjectTypes.set(typeName, type);
    return type;
  };
};

const addGroupAggField = (dto: GqlType) => {
  const groupAggType = generateGroupAggType(dto);
  dto['prototype']['groupAgg'] = Field(() => [groupAggType], {
    nullable: true,
  })(dto['prototype'], 'groupAgg');
}

const addSubscribers = (typeName: string, options?: any) => {
  for (const subType of Object.values(ESubscriberType)) {
    if (!options?.subscribers || options?.subscribers?.includes(subType)) {
      const subscriberName = generateSubscriberName(typeName, subType);;
      
      const entityMeta = getMetadataArgsStorage();
      const entity = entityMeta.tables.find(x => x.target['name'] === typeName);

      addDecoratedMethodToClass({
        methodName: subscriberName,
        methodDecorators: [getDecoratorByOperationType(subType)()],
        resolverClass: entity.target,
        callback: function() {
          pubsub.publish(subscriberName, {
            [subscriberName]: this,
          });
        }
      });
    }
  }
}
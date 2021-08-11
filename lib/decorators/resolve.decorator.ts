import {
  GraphQLExecutionContext,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { getMetadataArgsStorage } from 'typeorm';
import * as plularize from 'pluralize';
import { Loader } from '../loaders/query-exctractor.decorator';
import { Paginate } from '../pagination/pagination.decorator';
import { addDecoratedMethodToClass } from '../helpers/decorators';
import { Filters } from '../filters/filtrable-field.decorator';
import { GqlType } from '../helpers/classes';
import { Order } from '../order/order.decorator';
import { ESubscriberType, generateSubscriberName } from '../helpers/subscribers';
import { pubsub } from '../pubsub';
import storage from '../storage';

export interface IAutoResolverOptions {
  subscribers?: ESubscriberType[]
}

export const AutoResolver = (entity: GqlType, options?: IAutoResolverOptions): any => {
  return (baseResolverClass) => {
    const entityMeta = getMetadataArgsStorage();
    const relations = entityMeta.relations.filter(
      (x) => x.target['name'] == entity.graphqlName,
    );

    const extend = (base) => {
      @Resolver(() => entity)
      class Extended extends base {
        constructor() {
          super();
          relations.forEach((r) => {
            if (Extended.prototype[r.propertyName]) return;

            const relationMeta = storage.relations.find(x => x.fromTable === r.target && x.toTable === (r.type as any)());

            if (r.relationType === 'many-to-one') {
              // Many to one. Example: competencies => seniority
              const methodName = r.propertyName;
              const relationTable = relationMeta?.toTable.name.toLowerCase() || 
                methodName;
              const relationField = relationMeta?.joinPropertyName || `${relationTable + '_id'}`
                methodName;

              if (!Extended.prototype[methodName]) {
                addDecoratedMethodToClass({
                  resolverClass: Extended,
                  methodName,
                  methodDecorators: [
                    ResolveField(() => entity, { name: methodName }),
                  ],
                  paramDecorators: [
                    Loader(relationTable),
                    Parent(),
                    Filters(r.propertyName),
                    Order(r.propertyName),
                  ],
                  callback: (loader: GraphQLExecutionContext, parent) => {
                    return loader[relationTable].load(parent[relationField]);
                  },
                });
              }
            }

            if (r.relationType === 'one-to-many') {
              // One to many. Example: seniority => competencies
              const relationField = 
                relationMeta?.joinPropertyName || `${entity.graphqlName}_id`;
              const methodName = r.propertyName;
              if (!Extended.prototype[methodName]) {
                addDecoratedMethodToClass({
                  resolverClass: Extended,
                  methodName,
                  methodDecorators: [
                    ResolveField(() => entity, { name: methodName }),
                  ],
                  paramDecorators: [
                    Loader([methodName, relationField.toLowerCase()]),
                    Parent(),
                    Filters(r.propertyName),
                    Order(r.propertyName),
                  ],
                  callback: (loader: GraphQLExecutionContext, parent) => {
                    return loader[methodName].load(parent['id']);
                  },
                });
              }
            }
          });

          // many
          {
            const methodName = plularize(entity.graphqlName).toLowerCase();
            if (!Extended.prototype[methodName]) {
              // loadMany for root queries
              console.log(methodName)
              addDecoratedMethodToClass({
                resolverClass: Extended,
                methodName,
                methodDecorators: [Query(() => [entity], { name: methodName })],
                paramDecorators: [
                  Loader(entity),
                  Filters(entity.graphqlName),
                  Order(entity.graphqlName),
                  Paginate(),
                ],
                callback: (loader: GraphQLExecutionContext) => {
                  return loader;
                },
              });
            }
          }

          // subscriptions
          for (const subType of Object.values(ESubscriberType)) {
            if (!options?.subscribers || options?.subscribers?.includes(subType)) {
              const subscriberName = generateSubscriberName(entity.graphqlName, subType);
              addDecoratedMethodToClass({
                resolverClass: Extended,
                methodDecorators: [
                  Subscription(() => entity)
                ],
                paramDecorators: [],
                methodName: subscriberName,
                callback: () => {
                  return pubsub.asyncIterator(subscriberName);
                }
              })
            }
          }
        }
      }

      Object.defineProperty(Extended, 'name', {
        value: entity.graphqlName,
      });
      return Extended;
    };

    return extend(baseResolverClass);
  };
};

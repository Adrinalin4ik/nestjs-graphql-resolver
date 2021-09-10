import {
  Context,
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
import * as pluralize from 'pluralize';
export interface IAutoResolverOptions {
  subscribers?: ESubscriberType[]
}

export const AutoResolver = (entity: GqlType, options?: IAutoResolverOptions): any => {
  return (BaseResolverClass) => {
    const entityMeta = getMetadataArgsStorage();
    const relations = entityMeta.relations.filter(
      (x) => x.target['name'] == entity.graphqlName,
    );

      relations.forEach((r) => {
        if (BaseResolverClass.prototype[r.propertyName]) return;

        const relationMeta = storage.relations.find(x => x.fromTable === r.target && x.toTable === (r.type as any)());

        if (r.relationType === 'many-to-one') {
          // Many to one. Example: competencies => seniority
          const methodName = r.propertyName;
          const relationTable = relationMeta?.toTable.name.toLowerCase() || 
            methodName;
          const relationField = relationMeta?.joinPropertyName || `${relationTable + '_id'}`
            methodName;

          if (!BaseResolverClass.prototype[methodName]) {
            addDecoratedMethodToClass({
              resolverClass: BaseResolverClass,
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
                if (parent[relationField]) {
                  return loader[relationTable].load(parent[relationField]);
                }
              },
            });
          }
        }

        if (r.relationType === 'one-to-many') {
          // One to many. Example: seniority => competencies
          const methodName = r.propertyName;
          const relationField = 
            relationMeta?.joinPropertyName || `${entity.graphqlName}_id`;
          const relationTable =  pluralize(relationMeta?.toTable.name.toLowerCase() || 
          methodName);

          if (!BaseResolverClass.prototype[methodName]) {
            addDecoratedMethodToClass({
              resolverClass: BaseResolverClass,
              methodName,
              methodDecorators: [
                ResolveField(() => entity, { name: methodName }),
              ],
              paramDecorators: [
                Loader([relationTable, relationField.toLowerCase()]),
                Parent(),
                Filters(relationTable),
                Order(relationTable),
                Context()
              ],
              callback: (loader: GraphQLExecutionContext, parent, a, b, ctx) => {
                return loader[loader['alias'] || relationTable].load(parent['id']);
              },
            });
          }
        }
      });

      // many
      {
        const methodName = plularize(entity.graphqlName).toLowerCase();
        if (!BaseResolverClass.prototype[methodName]) {
          // loadMany for root queries
          // console.log(methodName)
          addDecoratedMethodToClass({
            resolverClass: BaseResolverClass,
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
            resolverClass: BaseResolverClass,
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

      Object.defineProperty(BaseResolverClass, 'name', {
        value: entity.graphqlName,
      });

    return BaseResolverClass;
  };
};

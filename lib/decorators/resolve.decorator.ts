import {
  Context,
  GraphQLExecutionContext,
  Parent,
  Query,
  ResolveField,
  Subscription
} from '@nestjs/graphql';
import * as plularize from 'pluralize';
import * as pluralize from 'pluralize';
import { getMetadataArgsStorage } from 'typeorm';
import { Filters } from '../filters/filtrable-field.decorator';
import { GqlType } from '../helpers/classes';
import { addDecoratedMethodToClass } from '../helpers/decorators';
import { unifyEntityName } from '../helpers/string.helper';
import { ESubscriberType, generateSubscriberName } from '../helpers/subscribers';
import { ELoaderType, Loader } from '../loaders/query-exctractor.decorator';
import { Order } from '../order/order.decorator';
import { Paginate } from '../pagination/pagination.decorator';
import { pubsub } from '../pubsub';
import storage from '../storage';
export interface IAutoResolverOptions {
  subscribers?: ESubscriberType[]
}

export const AutoResolver = (entity: GqlType, options?: IAutoResolverOptions): any => {
  return (BaseResolverClass) => {
    const typeormMeta = getMetadataArgsStorage();
    const relations = typeormMeta.relations.filter(
      (x) => x.target['name'] == entity.graphqlName,
    );

    storage.polymorphicRelations.forEach(r => {
      if (BaseResolverClass.prototype[r.propertyName]) return;

      const methodName = r.propertyName;

      addDecoratedMethodToClass({
        resolverClass: BaseResolverClass,
        methodName,
        methodDecorators: [ResolveField(() => entity, { name: methodName })],
        paramDecorators: [
          Loader({
            type: ELoaderType.Polymorphic,
            data: r
          }),
          Parent(),
          // Filters(entity.graphqlName),
          // Order(entity.graphqlName),
          // Paginate(),
        ],
        callback: (loader: GraphQLExecutionContext, parent) => {
          const loaderName = parent[r.typePropertyName];
          return loader[loaderName].load(parent[r.idPropertyName]);
        },
      });

    });

    relations.forEach((r) => {
      if (BaseResolverClass.prototype[r.propertyName]) return;
      const entityMeta = typeormMeta.tables.find(x => x.target['name'] === entity.tableName);
      const relationMeta = storage.relations.find(x => x.fromTable === r.target && x.toTable === (r.type as any)() && x.propertyName === r.propertyName);

      if (r.relationType === 'many-to-one') {
        // Many to one. Example: competencies => seniority
        const methodName = r.propertyName;
        const relationTable = unifyEntityName(relationMeta?.toTable.name || 
          methodName);
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
              Loader({
                type: ELoaderType.ManyToOne,
                data: relationTable
              }),
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
        const relationTable =  unifyEntityName(pluralize(relationMeta?.toTable.name || 
        methodName));

        if (!BaseResolverClass.prototype[methodName]) {
          addDecoratedMethodToClass({
            resolverClass: BaseResolverClass,
            methodName,
            methodDecorators: [
              ResolveField(() => entity, { name: methodName }),
            ],
            paramDecorators: [
              Loader({
                type: ELoaderType.OneToMany,
                data: [
                  relationTable, relationField.toLowerCase()
                ]
              }),
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
      const methodName = plularize(unifyEntityName(entity.graphqlName));
      if (!BaseResolverClass.prototype[methodName]) {
        // loadMany for root queries
        addDecoratedMethodToClass({
          resolverClass: BaseResolverClass,
          methodName,
          methodDecorators: [Query(() => [entity], { name: methodName })],
          paramDecorators: [
            Loader({
              type: ELoaderType.Many,
              data: entity
            }),
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

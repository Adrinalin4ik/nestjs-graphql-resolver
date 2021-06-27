import {
  GraphQLExecutionContext,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { getMetadataArgsStorage } from 'typeorm';
import * as plularize from 'pluralize';
import { Loader } from '../loaders/query-exctractor.decorator';
import { Paginate } from '../pagination/pagination.decorator';
import { addMethodToResolverClass } from '../helpers/decorators';
import { Filters } from '../filters/filtrable-field.decorator';
import { GqlType } from '../helpers/classes';
import { Order } from '../order/order.decorator';

export const AutoResolver = (entity: GqlType): any => {
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

            if (r.relationType === 'many-to-one') {
              // Many to one. Example: competencies => seniority
              const methodName = r.propertyName;
              if (!Extended.prototype[methodName]) {
                addMethodToResolverClass({
                  resolverClass: Extended,
                  methodName,
                  methodDecorators: [
                    ResolveField(() => entity, { name: methodName }),
                  ],
                  paramDecorators: [
                    Loader(methodName),
                    Parent(),
                    Filters(r.propertyName),
                    Order(r.propertyName),
                  ],
                  callback: (loader: GraphQLExecutionContext, parent) => {
                    return loader[methodName].load(parent[methodName + '_id']);
                  },
                });
              }
            }

            if (r.relationType === 'one-to-many') {
              // One to many. Example: seniority => competencies
              const methodName = r.propertyName;
              if (!Extended.prototype[methodName]) {
                addMethodToResolverClass({
                  resolverClass: Extended,
                  methodName,
                  methodDecorators: [
                    ResolveField(() => entity, { name: methodName }),
                  ],
                  paramDecorators: [
                    Loader([methodName, `${entity.graphqlName}_id`.toLowerCase()]),
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
          {
            const methodName = plularize(entity.graphqlName).toLowerCase();
            if (!Extended.prototype[methodName]) {
              // loadMany for root queries
              console.log(methodName)
              addMethodToResolverClass({
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

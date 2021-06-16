import {
  GraphQLExecutionContext,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { getMetadataArgsStorage } from 'typeorm';
import * as plularize from 'pluralize';
import { Filters } from '../filters/filtrable-field.decorator';
import { Loader } from '../loaders/query-exctractor.decorator';
import { Sorting } from '../sorting/sort.decorator';
import { Joins } from '../joins/join.decorator';
import { Paginate } from '../pagination/pagination.decorator';
import { addMethodToResolverClass } from '../helpers/decorators';
import { Having } from '../aggregations/having/having.decorator';
import { generateGroupAggType } from '../aggregations/aggregations.dto';

export const AutoResolver = (entity): any => {
  return (t) => {
    const entityMeta = getMetadataArgsStorage();
    const relations = entityMeta.relations.filter(
      (x) => x.target['name'] == entity.name,
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
              addMethodToResolverClass({
                resolverClass: Extended,
                methodName,
                methodDecorators: [
                  ResolveField(() => entity, { name: methodName }),
                ],
                paramDecorators: [
                  Loader(methodName),
                  Parent(),
                  Filters(),
                  Having(),
                  Sorting(entity),
                  Joins(),
                ],
                entity,
                callback: (loader: GraphQLExecutionContext, parent) => {
                  return loader[methodName].load(parent[methodName + '_id']);
                },
              });
            }

            if (r.relationType === 'one-to-many') {
              // One to many. Example: seniority => competencies
              const methodName = r.propertyName;
              addMethodToResolverClass({
                resolverClass: Extended,
                methodName,
                methodDecorators: [
                  ResolveField(() => entity, { name: methodName }),
                ],
                paramDecorators: [
                  Loader([methodName, `${entity.name}_id`.toLowerCase()]),
                  Parent(),
                  Filters(),
                  Having(),
                  Sorting(entity),
                  Joins(),
                ],
                entity,
                callback: (loader: GraphQLExecutionContext, parent) => {
                  return loader[methodName].load(parent['id']);
                },
              });
            }
          });

          if (!Extended.prototype[plularize(entity.name).toLowerCase()]) {
            // loadMany for root queries

            const methodName = plularize(entity.name).toLowerCase();
            addMethodToResolverClass({
              resolverClass: Extended,
              methodName,
              methodDecorators: [Query(() => [entity], { name: methodName })],
              paramDecorators: [
                Loader(entity),
                Filters(),
                Having(),
                Sorting(entity),
                Paginate(),
                Joins(),
              ],
              entity,
              callback: (loader: GraphQLExecutionContext) => {
                return loader;
              },
            });
          }
        }
      }

      Object.defineProperty(Extended, 'name', {
        value: entity.name,
      });
      return Extended;
    };

    return extend(t as any);
  };
};

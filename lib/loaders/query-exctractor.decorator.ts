import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GraphQLExecutionContext } from '@nestjs/graphql';
import {
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  SelectionNode,
} from 'graphql';
import * as pluralize from 'pluralize';
import { getMetadataArgsStorage } from 'typeorm';
import { HavingInputType } from '../aggregations/having/having.dto';
import { FiltersExpressionInputType } from '../filters/filter.dto';
import { JoinItemQuery } from '../joins/join.dto';
import { PaginationInputType } from '../pagination/pagination.dto';
import { SortingType } from '../sorting/sort.dto';

import { oneToManyLoader, manyToOneLoader, getMany } from './base.loader';

export const Loader = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    // const [root, args, gctx, info] = ctx.getArgs();
    const args = ctx.getArgs();
    const gargs: any = args[1];
    const gctx: GraphQLExecutionContext = args[2];
    const info: GraphQLResolveInfo = args[3];
    const filters: FiltersExpressionInputType = gargs.filters;
    const sorting: SortingType[] = gargs.sort;
    const joins: JoinItemQuery[] = gargs.joins;
    const pagination: PaginationInputType = gargs.paginate;
    const having: HavingInputType = gargs.having;

    const is_entity =
      data.prototype &&
      getMetadataArgsStorage().tables.some((table) => table.target === data);

    if (is_entity) {
      // Если лоудер не нужен
      const entityName: string = pluralize(data.name).toLowerCase();

      const fields = Array.from(
        resolverRecursive(info.fieldNodes, entityName, info.fragments),
      ).map((field) => pluralize.singular(entityName) + '.' + field);

      return getMany(
        fields,
        data.name,
        filters,
        sorting,
        joins,
        pagination,
        having,
        info,
      );
    } else if (typeof data === 'string') {
      const fields = Array.from(
        resolverRecursive(info.fieldNodes, data, info.fragments),
      ).map((field) => data + '.' + field);

      gctx[data] = manyToOneLoader(
        fields,
        data,
        filters,
        sorting,
        joins,
        pagination,
        info,
      );
    } else {
      const entityName: string = data[0];
      const entityKey: string = data[1];

      if (!gctx[entityName]) {
        const fields = Array.from(
          resolverRecursive(info.fieldNodes, entityName, info.fragments),
        ).map((field) => pluralize.singular(entityName) + '.' + field);

        gctx[entityName] = oneToManyLoader(
          fields,
          entityName,
          entityKey,
          filters,
          sorting,
          joins,
          pagination,
          info,
        );
      }
    }

    return gctx;
  },
);

function resolverRecursive(
  resolvers: ReadonlyArray<SelectionNode>,
  field: string,
  fragments: { [key: string]: FragmentDefinitionNode },
  from_fragment = false,
): Set<string> {
  let results = new Set(['id']);

  if (from_fragment) {
    for (const resolver of resolvers) {
      if (resolver.kind === 'Field' && !resolver.selectionSet) {
        results.add(resolver.name.value);
      } else if (resolver.kind === 'FragmentSpread') {
        const fragment = fragments[resolver.name.value];

        if (fragment?.selectionSet) {
          results = new Set([
            ...results,
            ...resolverRecursive(
              fragment.selectionSet.selections,
              field,
              fragments,
              true,
            ),
          ]);
        }
      }
    }

    return results;
  }

  for (const resolver of resolvers) {
    if (resolver.kind === 'Field' && resolver.selectionSet) {
      if (resolver.name.value === field) {
        resolver.selectionSet.selections.forEach((item) => {
          if (item.kind === 'Field' && !item.selectionSet) {
            results.add(item.name.value);
          } else if (
            item.kind === 'Field' &&
            item.selectionSet &&
            item.name.value !== 'groupAgg'
          ) {
            if (pluralize.isSingular(item.name.value)) {
              results.add(item.name.value + '_id');
            }
          } else if (item.kind === 'FragmentSpread') {
            const fragment = fragments[item.name.value];

            if (fragment?.selectionSet) {
              results = new Set([
                ...results,
                ...resolverRecursive(
                  fragment.selectionSet.selections,
                  field,
                  fragments,
                  true,
                ),
              ]);
            }
          } else if (item.kind === 'InlineFragment' && item.selectionSet) {
            results = new Set([
              ...results,
              ...resolverRecursive(
                item.selectionSet.selections,
                field,
                fragments,
                true,
              ),
            ]);
          }
        });

        return results;
      } else {
        return resolverRecursive(
          resolver.selectionSet.selections,
          field,
          fragments,
          false,
        );
      }
    }
  }

  return results;
}

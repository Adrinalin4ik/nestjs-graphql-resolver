import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GraphQLExecutionContext } from '@nestjs/graphql';
import {
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  SelectionNode,
} from 'graphql';
import * as pluralize from 'pluralize';
import { PaginationInputType } from '../pagination/pagination.dto';

import { oneToManyLoader, manyToOneLoader, getMany } from './base.loader';
import storage from '../storage';

export enum ELoaderType {
  Polymorphic = 'Polymorphic',
  ManyToOne = 'ManyToOne',
  OneToMany = 'OneToMany',
  Many = 'Many',
}

interface LoaderData {
  type: ELoaderType,
  data: any;
}

export const Loader = createParamDecorator(
  (payload: LoaderData, ctx: ExecutionContext) => {
    // const [root, args, gctx, info] = ctx.getArgs();
    const args = ctx.getArgs();
    const parent = args[0]
    const gargs: any = args[1];
    const gctx: GraphQLExecutionContext = args[2];
    const info: GraphQLResolveInfo = args[3];
    const filters: any = gargs.where;
    const pagination: PaginationInputType = gargs.paginate;
    const order_by: any = gargs.order_by;


    const alias = info.fieldNodes[0]?.alias?.value;

    switch (payload.type) {
      case ELoaderType.ManyToOne: {
        if (!gctx[payload.data]) {
          const fields = Array.from(
            resolverRecursive(info.fieldNodes, payload.data, info.fragments),
          ).map((field) => payload.data + '.' + field);
    
          gctx[payload.data] = manyToOneLoader(
            fields,
            payload.data,
            filters,
            order_by,
            pagination,
            info,
          );
        }
        break;
      }
      case ELoaderType.OneToMany: {
        const entityName: string = payload.data[0];
        const entityKey: string = payload.data[1];
        if (!gctx[alias || entityName]) {
          const fields = Array.from(
            resolverRecursive(info.fieldNodes, info.fieldName, info.fragments),
          ).map((field) => pluralize.singular(entityName) + '.' + field);

          gctx[alias || entityName] = oneToManyLoader(
            fields,
            entityName,
            entityKey,
            filters,
            order_by,
            pagination,
            info,
          );
        }
        break;
      }
      case ELoaderType.Polymorphic: {
        const entityName: string = parent[payload.data.typePropertyName].toLowerCase();
        if (!gctx[entityName]) {
          const fields = Array.from(
            resolverRecursive(info.fieldNodes, entityName, info.fragments),
          ).map((field) => entityName + '.' + field);
    
          gctx[entityName] = manyToOneLoader(
            fields,
            entityName,
            filters,
            order_by,
            pagination,
            info,
          );
        }

        break;
      }
      default: {
        // Если лоудер не нужен
        const entityName: string = pluralize(payload.data.graphqlName).toLowerCase();

        const fields = Array.from(
          resolverRecursive(info.fieldNodes, entityName, info.fragments),
        ).map((field) => pluralize.singular(entityName) + '.' + field);

        return getMany(
          fields,
          payload.data.graphqlName,
          filters,
          order_by,
          pagination,
          info,
        );
        break;
      }
    }

    return {...gctx, alias};
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
      if (resolver.kind === 'Field') {
        if (resolver?.name.value === '__typename') {
          return;
        }
      }
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
          if (item.kind === 'Field') {
            if (item?.name.value === '__typename') {
              return;
            }
          }
          if (item.kind === 'Field' && !item.selectionSet) {
            results.add(item.name.value);
          } else if (
            item.kind === 'Field' &&
            item.selectionSet &&
            item.name.value !== 'groupAgg'
          ) {
            if (pluralize.isSingular(item.name.value) && !storage.polymorphicRelations.find(x => x.propertyName === item.name.value)) {
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

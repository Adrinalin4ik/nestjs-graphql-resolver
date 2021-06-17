import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';
import { groupBy } from 'lodash';
import * as pluralize from 'pluralize';
import { AggregationsBuilder } from '../aggregations/aggregation.builder';
import { GraphQLResolveInfo } from 'graphql';

import { SortBuilder } from '../sorting/sort.builder';
import { JoinBuilder } from '../joins/join.builder';
import { JoinItemQuery } from '../joins/join.dto';
import { FilterBuilder } from '../filters/filter.builder';
import { FiltersExpressionInputType } from '../filters/filter.dto';
import { SortingType } from '../sorting/sort.dto';
import { PaginationBuilder } from '../pagination/pagination.builder';
import { PaginationInputType } from '../pagination/pagination.dto';
import { HavingBuilder } from '../aggregations/having/having.builder';
import { HavingInputType } from '../aggregations/having/having.dto';

export const oneToManyLoader = (
  select: string[],
  tableName: string,
  foreignKey: string,
  filters: FiltersExpressionInputType,
  sorting: SortingType[],
  joins: JoinItemQuery[],
  pagination: PaginationInputType,
  info: GraphQLResolveInfo,
) => {
  return new Dataloader(async (keys: number[]) => {
    tableName = pluralize.singular(tableName);
    select.push(tableName + '.' + foreignKey);
    select.push(tableName + '.id');
    const qb = getRepository(tableName).createQueryBuilder(
      tableName.toLowerCase(),
    );
    qb.select(select);
    // const entity = repo.target;
    const fqb = new FilterBuilder(qb, filters);
    fqb.build();

    const joinb = new JoinBuilder(qb, joins);
    joinb.build();

    const aggb = new AggregationsBuilder(qb, info, sorting, select);
    aggb.build();

    const paginationb = new PaginationBuilder(qb, pagination);
    paginationb.build();

    qb.andWhere(foreignKey + ' IN (:...keys)', { keys });

    let res;

    if (aggb.isGroupping) {
      res = await qb.getRawMany();

      res = aggb.responseObject(res);

      const gs = groupBy(res[0].groupAgg, (item) => {
        return item.fields[0][foreignKey];
      });
      return keys.map((k) => [{ groupAgg: gs[k] || [] }]);
    } else {
      const sortb = new SortBuilder(qb, sorting);
      sortb.build();

      res = await qb.getMany();
      const gs = groupBy(res, foreignKey);
      return keys.map((k) => gs[k] || []);
    }
  });
};

export const getMany = async (
  select: string[],
  tableName: string,
  filters: FiltersExpressionInputType,
  sorting: SortingType[],
  joins: JoinItemQuery[],
  pagination: PaginationInputType,
  having: HavingInputType,
  info: GraphQLResolveInfo,
) => {
  const qb = getRepository(tableName).createQueryBuilder(
    tableName.toLowerCase(),
  );

  qb.select(select);

  const havingb = new HavingBuilder(qb, having, select);
  havingb.build();

  const fqb = new FilterBuilder(qb, filters);
  fqb.build();

  const joinb = new JoinBuilder(qb, joins);
  joinb.build();

  const aggb = new AggregationsBuilder(qb, info, sorting);
  aggb.build();

  const paginationb = new PaginationBuilder(qb, pagination);
  paginationb.build();

  let res;

  if (aggb.isGroupping) {
    res = await qb.getRawMany();

    res = aggb.responseObject(res);
  } else if (!aggb.isGroupping && having) {
    res = await qb.getRawMany();
    res = res.map((x) => x.fields[0]);
  } else {
    const sortb = new SortBuilder(qb, sorting);
    sortb.build();
    res = qb.getMany();
  }
  return res;
};

export const manyToOneLoader = (
  select: string[],
  tableName: string,
  filters: FiltersExpressionInputType,
  sorting: SortingType[],
  joins: JoinItemQuery[],
  pagination: PaginationInputType,
  info: GraphQLResolveInfo,
) =>
  new Dataloader(async (keys: number[]) => {
    select.push(tableName + '.id');
    const qb = getRepository(tableName).createQueryBuilder(
      tableName.toLowerCase(),
    );

    const fqb = new FilterBuilder(qb, filters);
    fqb.build();

    const joinb = new JoinBuilder(qb, joins);
    joinb.build();

    const aggb = new AggregationsBuilder(qb, info, sorting, select);
    aggb.build();

    const paginationb = new PaginationBuilder(qb, pagination);
    paginationb.build();

    qb.andWhere('id IN (:...keys)', { keys });
    let res;

    if (aggb.isGroupping) {
      res = await qb.getRawMany();

      res = aggb.responseObject(res);

      const test = keys.map((k) => ({
        groupAgg: [
          res[0].groupAgg.find((obj) => obj.fields.some((x) => x['id'] === k)),
        ],
      }));
      return test;
    } else {
      const sortb = new SortBuilder(qb, sorting);
      sortb.build();

      res = await qb.addSelect(select).getMany();
      return keys.map((k) => res.find((obj) => obj['id'] === k));
    }
  });

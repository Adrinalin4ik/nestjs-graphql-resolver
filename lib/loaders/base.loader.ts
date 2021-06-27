import * as Dataloader from 'dataloader';
import { getRepository } from 'typeorm';
import { groupBy } from 'lodash';
import * as pluralize from 'pluralize';
import { AggregationsBuilder } from '../aggregations/aggregation.builder';
import { GraphQLResolveInfo } from 'graphql';

import { PaginationBuilder } from '../pagination/pagination.builder';
import { PaginationInputType } from '../pagination/pagination.dto';
import { JoinBuilder } from '../joins/join.builder';
import { FilterBuilder } from '../filters/filter.builder';
import { OrderBuilder } from '../order/order.builder';

export const oneToManyLoader = (
  select: string[],
  tableName: string,
  foreignKey: string,
  filters: any,
  ordering: any,
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

    const joinb = new JoinBuilder(qb);

    const fqb = new FilterBuilder(qb, joinb, filters, select);
    fqb.build();

    const aggb = new AggregationsBuilder(qb, info, null, select);
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
      const orderb = new OrderBuilder(qb, joinb, ordering);
      orderb.build();
      
      if (fqb.hasAggregations) {
        res = await qb.getRawMany();
        res = res.flatMap(x => x.fields);
      } else {
        res = await qb.getMany();
      }
      const gs = groupBy(res, foreignKey);
      return keys.map((k) => gs[k] || []);
    }
  });
};

export const getMany = async (
  select: string[],
  tableName: string,
  filters: any,
  ordering: any,
  pagination: PaginationInputType,
  info: GraphQLResolveInfo,
) => {
  const qb = getRepository(tableName).createQueryBuilder(
    tableName.toLowerCase(),
  );

  qb.select(select);

  const joinb = new JoinBuilder(qb);

  const fqb = new FilterBuilder(qb, joinb, filters, select);
  fqb.build();

  const aggb = new AggregationsBuilder(qb, info);
  aggb.build();

  const paginationb = new PaginationBuilder(qb, pagination);
  paginationb.build();
  
  let res;

  if (aggb.isGroupping) {
    res = await qb.getRawMany();

    res = aggb.responseObject(res);
  } 
  // else if (!aggb.isGroupping) {
  //   res = await qb.getRawMany();
  //   res = res.map((x) => x.fields[0]);
  // } 
  else {
    const orderb = new OrderBuilder(qb, joinb, ordering);
    orderb.build();
    if (fqb.hasAggregations) {
      res = await qb.getRawMany();
      res = res.flatMap(x => x.fields);
    } else {
      res = await qb.getMany();
    }
  }
  return res;
};

export const manyToOneLoader = (
  select: string[],
  tableName: string,
  filters: any,
  ordering: any,
  pagination: PaginationInputType,
  info: GraphQLResolveInfo,
) =>
  new Dataloader(async (keys: number[]) => {
    select.push(tableName + '.id');
    const qb = getRepository(tableName).createQueryBuilder(
      tableName.toLowerCase(),
    );

    const joinb = new JoinBuilder(qb);

    const fqb = new FilterBuilder(qb, joinb, filters, select);
    fqb.build();

    const aggb = new AggregationsBuilder(qb, info, null, select);
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
      const orderb = new OrderBuilder(qb, joinb, ordering);
      orderb.build();

      qb.addSelect(select);

      if (fqb.hasAggregations) {
        res = await qb.getRawMany();
        res = res.flatMap(x => x.fields);
      } else {
        res = await qb.getMany();
      }

      return keys.map((k) => res.find((obj) => obj['id'] === k));
    }
  });

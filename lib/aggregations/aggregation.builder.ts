import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { FieldNode, GraphQLResolveInfo } from 'graphql';
import { AggregationEnum, AggregationValueArray } from './aggregations.dto';
import { sanitizeSqlValue } from '../helpers/sanitizer';
export class AggregationsBuilder<Entity> {
  public groupByEntityAttribute: string;
  public isGroupping = false;
  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private readonly info: GraphQLResolveInfo,
    private readonly additionalSelection?: string[],
  ) {}

  build() {
    const jsonAggFields = new Set([`id`]);
    const selectFields = new Set();

    const entityName = this.qb.alias;

    const groupByField = (
      this.info.fieldNodes[0].selectionSet.selections as FieldNode[]
    ).find((x) => x.name.value === 'groupAgg');

    if (groupByField) {
      this.isGroupping = true;
      for (const attributeField of groupByField.selectionSet
        .selections as FieldNode[]) {
        const aggName = attributeField.name.value;
        if (
          Object.values(AggregationEnum).includes(aggName as AggregationEnum)
        ) {
          if (!attributeField.selectionSet?.selections) {
            selectFields.add(`${aggName}(*) as count`); // for count
          } else {
            for (const aggField of attributeField.selectionSet
              .selections as FieldNode[]) {
              selectFields.add(
                `${aggName}(${aggField.name.value}) as ${aggName}_${aggField.name.value}`,
              );
            }
          }
        }
        if (aggName === 'by') {
          const groupField = (
            attributeField.selectionSet.selections as FieldNode[]
          )[0].name.value;
          this.groupByEntityAttribute = groupField;
          this.qb.groupBy(`"${entityName}"."${groupField}"`);
          selectFields.add(`"${entityName}"."${groupField}"`);
        } else if (aggName === 'fields') {
          for (const field of attributeField.selectionSet
            .selections as FieldNode[]) {
            if (!field.selectionSet?.selections) {
              const fieldName = sanitizeSqlValue(field.name.value);
              jsonAggFields.add(`${fieldName}`);
            }
          }
        }
      }

      if (this.additionalSelection) {
        this.additionalSelection.forEach((select) => jsonAggFields.add(select));
      }

      const json_agg_query = Array.from(jsonAggFields.values())
        .map((field) => {
          if (field.includes('.')) {
            const fieldName = field.split('.')[1];
            return `'${fieldName}', "${entityName}"."${fieldName}"`;
          } else {
            return `'${field}', "${entityName}"."${field}"`;
          }
        })
        .join(',');

      const select_query = Array.from(selectFields)
        .map((s: string) => {
          if (s.includes('.')) {
            return `${s} as ${s.split('.')[1]}`;
          } else if (s.includes('as')) {
            return s;
          }
        })
        .join(', ');

      // const order_query =
      //   this.sorting
      //     ?.map(
      //       (s) =>
      //         `ORDER BY ${s.table || this.qb.alias}.${s.field} ${s.type} ${
      //           s.nulls
      //         }`,
      //     )
      //     .join(' ') || '';

      // this.qb.select(
      //   `${select_query}, jsonb_agg(jsonb_build_object(${json_agg_query}) ${order_query}) as fields`,
      // );
      this.qb.select(
        `${select_query}, jsonb_agg(jsonb_build_object(${json_agg_query})) as fields`,
      );
    }

    return this.qb;
  }

  responseObject(typeormRes) {
    return [
      {
        groupAgg: typeormRes.map((x) => {
          const mapping = {
            by: {
              [this.groupByEntityAttribute]: x[this.groupByEntityAttribute],
            },
            fields: x.fields,
            count: x.count,
            ...Object.entries(x).reduce((acc, [k, v]) => {
              const agg_k = k.split('_')[0];
              const agg_v = k.split(`${agg_k}_`)[1];
              if (
                AggregationValueArray.indexOf(agg_k) !== -1 &&
                agg_k !== AggregationEnum.count
              ) {
                acc[agg_k] = { [agg_v]: v };
              }
              return acc;
            }, {}),
          };
          return mapping;
        }),
      },
    ];
  }
}

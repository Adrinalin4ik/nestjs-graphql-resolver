import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { sanitizeSqlValue } from '../helpers/sanitizer';
import { castValueType, toSnakeCase } from '../helpers/string.helper';
import {
  FilterItemInputType,
  FiltersExpressionGroupInputType,
  FiltersExpressionInputType,
  OperationQuery,
} from './filter.dto';

type ParamValue = string | number | boolean | Array<string | number | boolean>;

export class FilterBuilder<Entity> {
  private params: Record<string, ParamValue> = {};
  private paramsCount = 0;

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private filtersExpression?: FiltersExpressionInputType,
  ) {}

  build() {
    if (!this.filtersExpression) return;

    const whereSql = this.buildExpressionRec(this.filtersExpression);
    this.qb.andWhere(whereSql, this.params);
  }

  private buildExpressionRec(fe: FiltersExpressionInputType): string {
    let expressions: string[];
    if (fe.groups?.length) {
      expressions = fe.groups.map((group, i) => {
        const operator = i === 0 ? '' : group.operator;

        const filtersSQL = this.buildGroup(group);

        return `${operator} ${filtersSQL}`.trim();
      });
    } else {
      expressions = fe.filters.map((filter, i) => this.buildFilter(filter, i));
    }
    return expressions.join(' ');
  }

  private buildGroup(group: FiltersExpressionGroupInputType) {
    const filters = group.filters.map((filter, i) =>
      this.buildFilter(filter, i),
    );
    return filters.join(' ').trim();
  }

  private buildFilter(filter: FilterItemInputType, index: number): string {
    const table = toSnakeCase(filter.table || this.qb.alias);
    const field = `"${table}"."${sanitizeSqlValue(filter.field)}"`;

    const operator = index === 0 ? '' : filter.operator;
    const paramName = `${filter.field}_filter_${++this.paramsCount}`;
    if (filter.values) {
      this.params[paramName] = filter.values[0];
    }
    if (Object.values(OperationQuery).some((op) => op === filter.operation)) {
      switch (filter.operation) {
        case OperationQuery.NOTBETWEEN:
        case OperationQuery.BETWEEN:
          const paramName2 = `${filter.field}_having_${++this.paramsCount}`;
          this.params[paramName2] = castValueType(filter.values[1]);
          return `${operator} (${field} ${filter.operation} :${paramName} and :${paramName2})`;
        case OperationQuery.IN:
          const values = filter.values.map((value) => {
            const paramName = `${filter.field}_having_${++this.paramsCount}`;
            this.params[paramName] = castValueType(value);
            return `:${paramName}`;
          });

          return `${operator} (${field} ${filter.operation} (${values.join(
            ', ',
          )}))`;
        case OperationQuery.NULL:
        case OperationQuery.NOTNULL:
          return `${operator} (${field} ${filter.operation})`;
        default:
          return `${operator} (${field} ${filter.operation} :${paramName})`;
      }
      // if (filter.values) {
      //   return `${operator} (${field} ${filter.operation} :${paramName})`;
      // } else {
      //   return `${operator} (${field} ${filter.operation})`;
      // }
    } else {
      throw new Error(`Unknown filter operation: ${filter.operation}`);
    }
  }
}

import { OperationQuery, OperatorQuery } from 'src/utils/filters/filter.dto';
import { castValueType } from 'src/utils/helpers/string.helper';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { sanitizeSqlValue } from '../../helpers/sanitizer';
import {
  HavingFilterItem,
  HavingGroupInputType,
  HavingInputType,
} from './having.dto';

type ParamValue = string | number | boolean | Array<string | number | boolean>;

export class HavingBuilder<Entity> {
  private params: Record<string, ParamValue> = {};
  private paramsCount = 0;
  private selectionSet = new Set();

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private having: HavingInputType,
    private readonly jsonAggSelection?: string[],
  ) {}

  build() {
    if (!this.having) return;

    const havignSQL = this.buildExpressionRec(this.having);
    this.qb.having(havignSQL, this.params);

    this.qb.select(Array.from(this.selectionSet).join(', '));

    const json_agg_query = this.jsonAggSelection
      .map((field) => {
        if (field.includes('.')) {
          const fieldName = field.split('.')[1];
          return `'${fieldName}', "${this.qb.alias}"."${fieldName}"`;
        } else {
          return `'${field}', "${this.qb.alias}"."${field}"`;
        }
      })
      .join(',');

    this.qb.addSelect(
      `jsonb_agg(DISTINCT jsonb_build_object(${json_agg_query})) as fields`,
    );
  }

  private buildExpressionRec(having: HavingInputType): string {
    let expressions: string[];
    if (having.groups?.length) {
      expressions = having.groups.map((group, i) => {
        const operator = i === 0 ? '' : group.operator;

        const filtersSQL = this.buildGroup(group);

        return `${operator} ${filtersSQL}`.trim();
      });
    } else {
      expressions = having.filters.map((filter, i) =>
        this.buildFilter(filter, i),
      );
    }
    return expressions.join(' ');
  }

  private buildGroup(group: HavingGroupInputType) {
    const filters = group.filters.map((filter, i) =>
      this.buildFilter(filter, i),
    );
    return filters.join(' ').trim();
  }

  private buildFilter(filter: HavingFilterItem, index: number): string {
    const table = (filter.table || this.qb.alias).toLowerCase();
    const fieldName = `"${table}"."${sanitizeSqlValue(filter.field)}"`;
    let field: string;
    if (filter.aggregator) {
      field = `${filter.aggregator}(${fieldName})`;
    } else {
      field = fieldName;
    }

    this.selectionSet.add(fieldName);
    this.qb.addGroupBy(fieldName);

    const operator = index === 0 ? '' : filter.operator;
    const paramName = `${filter.field}_having_${++this.paramsCount}`;
    if (filter.values) {
      this.params[paramName] = castValueType(filter.values[0]);
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
    } else {
      throw new Error(`Unknown filter operation: ${filter.operation}`);
    }
  }
}

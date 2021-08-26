import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { castValueType } from '../helpers/string.helper';
import {
  OperationQuery, OperatorQuery,
} from './filter.dto';
import { JoinBuilder } from '../joins/join.builder';
import { getMetadataArgsStorage } from 'typeorm';
import * as pluralize from 'pluralize';
import { AggregationEnum } from '../aggregations/aggregations.dto';
import { JoinTypeQuery } from '../joins/join.interface';

type ParamValue = string | number | boolean | Array<string | number | boolean>;

export class FilterBuilder<Entity> {
  private params: Record<string, ParamValue> = {};
  private paramsCount = 0;
  private entityMeta = getMetadataArgsStorage();
  private joinSet = new Set<[string, string]>();
  public hasAggregations: boolean = false;

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private jb: JoinBuilder<Entity>,
    private filtersExpression?: any,
    private readonly jsonAggSelection?: string[],
  ) {}

  build() {
    if (!this.filtersExpression) return;

    const sql = this.buildExpressionRec(this.filtersExpression);

    this.joinSet.forEach(([from, to]) => {
      this.jb.addJoin(from, to, this.hasAggregations ? JoinTypeQuery.Left: JoinTypeQuery.Inner);
    });

    if (this.hasAggregations) {
      this.qb.having(sql, this.params);
  
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

      this.qb.select(
        `jsonb_agg(DISTINCT jsonb_build_object(${json_agg_query})) as fields`,
      );

    } else {
      this.qb.andWhere(sql, this.params);
    }

  }

  private buildExpressionRec(fe: any): string {
    const expressions = this.findFields(this.qb.alias, this.qb.alias, fe, null, null);

    return expressions.join(' ');
  }

  private findFields(prevProp, currEntity, obj, outerOperator: OperatorQuery, outerAggOperator: AggregationEnum) {
    const result = [];
    Object.entries(obj).forEach(([k,v], i) => {
      const isEntity = this.entityMeta.tables.some(x => x.name === pluralize.singular(k))
      const operator = Object.values(OperatorQuery).find(x => x === k);
      const aggOperation = Object.values(AggregationEnum).find(x => x === k);
      if (operator || aggOperation) {
        // condition
        const groups = v instanceof Array ? v : [v] as any;
        const res = groups.reduce((acc, group) => {
          const expressions = this.findFields(prevProp, currEntity, group, operator, aggOperation);
          acc.push(expressions);

          return acc;
        }, []).join(` ${k} `)
        result.push(`(${res})`)
      } else if (!isEntity) {
        // operation
        result.push(this.buildFilter(currEntity, k,v, outerOperator, outerAggOperator, i))
      } else {
        // relation
        // this.jb.addJoin(prevProp, k);
        this.joinSet.add([prevProp, k])
        result.push(this.findFields(k, k, v, outerOperator, outerAggOperator))
      }
    })
    return result;
  }

  private buildFilter(table: string, field: string, operationObj, op:OperatorQuery, aggOp: AggregationEnum, index: number) {
    const operationObjArr = Object.entries(operationObj) as [[string, (string | string[])]];
    const operation = OperationQuery[operationObjArr[0][0]];
    const value = operationObjArr[0][1];

    const operator = index === 0 ? '' : op || OperatorQuery.and;

    let fieldName = `"${table}"."${field}"`;
    if (aggOp) {
      this.hasAggregations = true;
      // this.selectionSet.add(fieldName);
      this.qb.addGroupBy(fieldName);
      // this.qb.addSelect(fieldName, field)
      fieldName = `${AggregationEnum[aggOp]}(${fieldName})`;
    }

    const paramName = `${field}_filter_${++this.paramsCount}`;
    if (!(value instanceof Array)) {
      this.params[paramName] = value;
    }
    
    switch (operation) {
      case OperationQuery.notbetween:
      case OperationQuery.between:
        if (value instanceof Array) {
          const inParamsName1 = `${field}_filter_${++this.paramsCount}`;
          this.params[inParamsName1] = value[0];
          const inParamsName2 = `${field}_filter_${++this.paramsCount}`;
          this.params[inParamsName2] = value[1];
          return `${operator} (${fieldName} ${operation} :${inParamsName1} and :${inParamsName2})`;
        } else {
          throw `"${operation}" value must be an array`
        }
      case OperationQuery.in:
        if (value instanceof Array) {
          const values = value.map((value) => {
            const paramName = `${field}_filter_${++this.paramsCount}`;
            this.params[paramName] = castValueType(value);
            return `:${paramName}`;
          });

          return `${operator} (${fieldName} ${operation} (${values.join(
            ', ',
          )}))`;
        } else {
          throw `"In" value must be an array`
        }
      case OperationQuery.null:
      case OperationQuery.notnull:
        return `${operator} (${fieldName} ${operation})`;
      default:
        return `${operator} (${fieldName} ${operation} :${paramName})`;
    }
  }
}

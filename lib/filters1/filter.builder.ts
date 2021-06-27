import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { castValueType } from '../helpers/string.helper';
import {
  OperationQuery, OperatorQuery,
} from './filter.dto';
import { JoinBuilder1 } from '../joins/join.builder1';
import { getMetadataArgsStorage } from 'typeorm';
import * as pluralize from 'pluralize';

type ParamValue = string | number | boolean | Array<string | number | boolean>;

export class FilterBuilder1<Entity> {
  private params: Record<string, ParamValue> = {};
  private paramsCount = 0;
  private entityMeta = getMetadataArgsStorage();
  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private jb: JoinBuilder1<Entity>,
    private filtersExpression?: any,
  ) {}

  build() {
    if (!this.filtersExpression) return;

    const whereSql = this.buildExpressionRec(this.filtersExpression);
    this.qb.andWhere(whereSql, this.params);
  }

  private buildExpressionRec(fe: any): string {
    const expressions = this.findFields(this.qb.alias, this.qb.alias, fe);

    return expressions.join(' ');
  }

  findFields(prevProp, currEntity, obj, outerOperator?: OperatorQuery) {
    const result = [];
    Object.entries(obj).forEach(([k,v], i) => {
      const isEntity = this.entityMeta.tables.some(x => x.name === pluralize.singular(k))
      const operator = Object.values(OperatorQuery).find(x => x === k);
      if (operator) {
        // condition
        const groups = v as any;
        const res = groups.reduce((acc, group) => {
          const expressions = this.findFields(prevProp, currEntity, group, operator);
          acc.push(expressions);

          return acc;
        }, []).join(` ${k} `)
        result.push(`(${res})`)
      } else if (!isEntity) {
        // operation
        result.push(this.buildFilter(currEntity, k,v, outerOperator, i))
      } else {
        // relation
        this.jb.addJoin(prevProp, k);
        result.push(this.findFields(k, k, v, outerOperator))
      }
    })
    return result;
  }

  private buildFilter(table: string, field: string, operationObj, op:OperatorQuery, index: number) {
    const operationObjArr = Object.entries(operationObj) as [[string, (string | string[])]];
    const operation = OperationQuery[operationObjArr[0][0]];
    const value = operationObjArr[0][1];

    const operator = index === 0 ? '' : op;

    const fieldName = `"${table}"."${field}"`
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

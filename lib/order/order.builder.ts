import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { getMetadataArgsStorage } from 'typeorm';
import { JoinBuilder } from '../joins/join.builder';
import { AggregationEnum } from '../aggregations/aggregations.dto';
import { JoinTypeQuery } from '../joins/join.interface';
import { OperatorQuery } from '../filters/filter.dto';
import * as pluralize from 'pluralize';
import { OrderTypeEnum } from './order.dto';

export class OrderBuilder<Entity> {
  // public groupByEntityAttribute: string;
  public hasAggregations: boolean = false;
  private entityMeta = getMetadataArgsStorage();
  private joinSet = new Set<[string, string]>();

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private jb: JoinBuilder<Entity>,
    private readonly ordering: any,
  ) {}

  build() {
    if (!this.ordering) return;

    const sql = this.buildExpressionRec(this.ordering);

    this.joinSet.forEach(([from, to]) => {
      this.jb.addJoin(from, to, this.hasAggregations ? JoinTypeQuery.Left: JoinTypeQuery.Inner);
    });
  }

  private buildExpressionRec(fe: any): string {
    const expressions = this.findFields(this.qb.alias, this.qb.alias, fe, null, null);

    return expressions.join(' ');
  }

  private findFields(prevProp, currEntity, obj, outerOperator: OperatorQuery, outerAggOperator: AggregationEnum) {
    const result = [];
    Object.entries(obj).forEach(([k,v]) => {
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
        result.push(this.buildFilter(currEntity, k,v as string, outerOperator, outerAggOperator))
      } else {
        // relation
        // this.jb.addJoin(prevProp, k);
        this.joinSet.add([prevProp, k])
        result.push(this.findFields(k, k, v, outerOperator, outerAggOperator))
      }
    })
    return result;
  }

  private buildFilter(table: string, field: string, operation: string, op:OperatorQuery, aggOp: AggregationEnum) {
    let fieldName = `"${table}"."${field}"`;

    if (aggOp) {
      this.hasAggregations = true;
      this.qb.addGroupBy(fieldName);
      fieldName = `${AggregationEnum[aggOp]}(${fieldName})`;
    }

    this.qb.addSelect(fieldName, field)

    const t = OrderTypeEnum;
    const order = operation.includes('asc') ? "ASC" : "DESC";
    const nulls = operation.includes('first') ? "NULLS FIRST" : "NULLS LAST";;
    
    this.qb.addOrderBy(fieldName, order, nulls);
  }
}

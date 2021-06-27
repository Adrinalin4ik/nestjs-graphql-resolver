import { getMetadataArgsStorage } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { JoinTypeQuery } from './join.interface';


export class JoinBuilder<Entity> {
  private joinedEntities = new Set<string>();

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
  ) {}

  addJoin(fromTable, toTable, joinType?: JoinTypeQuery) {
      const t = getMetadataArgsStorage();
      const relationField = `${fromTable}.${toTable}`;
      if (!this.joinedEntities.has(relationField)) {
        if (joinType === JoinTypeQuery.Inner) {
          this.qb.innerJoin(relationField, toTable).distinct();
        } else {
          this.qb.leftJoin(relationField, toTable).distinct();
        }
        this.joinedEntities.add(relationField);
      }
    }
}

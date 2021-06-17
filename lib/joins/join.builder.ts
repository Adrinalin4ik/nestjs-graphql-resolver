import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import * as pluralize from 'pluralize';
import { getMetadataArgsStorage } from 'typeorm';
import { JoinItemQuery } from './join.dto';
import { toSnakeCase } from '../helpers/string.helper';
export class JoinBuilder<Entity> {
  private joinedEntities = new Set<string>();

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private joins?: JoinItemQuery[],
  ) {}

  build() {
    if (this.joins) this.buildJoinEntitiesRec(this.joins, this.qb.alias);
  }

  private buildJoinEntitiesRec(joins: JoinItemQuery[], currentTable: string) {
    joins.forEach((join) => {
      const table = toSnakeCase(join.table);
      const joinTable = toSnakeCase(currentTable);
      this.joinTable(table, joinTable);
      if (join.joins?.length) {
        this.buildJoinEntitiesRec(join.joins, join.table);
      }
    });
  }

  private joinTable(table, relationTable) {
    const entityMeta = getMetadataArgsStorage();

    if (!this.joinedEntities.has(table)) {
      const relation = entityMeta.relations.find(
        (x) =>
          x.target['name'] == table &&
          pluralize(x.propertyName) == pluralize(relationTable).toLowerCase(),
      );

      let relationTableKey: string;

      if (relation.relationType === 'one-to-many') {
        relationTableKey =
          relationTableKey || pluralize.singular(table).toLowerCase();
      } else {
        relationTableKey = relationTableKey || pluralize(table).toLowerCase();
      }

      const relationField = `${relationTable}.${relationTableKey}`;

      // switch (join.type) {
      //   case JoinType.Left:
      //     this.qb.leftJoinAndSelect(join.table, relationField);
      //     break;
      //   case JoinType.Inner:
      //   default:
      this.qb
        .innerJoin(relationField.toLowerCase(), table.toLowerCase())
        .distinct();
      //     break;
      // }

      this.joinedEntities.add(relationTable);
    }
  }
}

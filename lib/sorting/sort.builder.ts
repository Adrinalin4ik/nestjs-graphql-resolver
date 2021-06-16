import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { sanitizeSqlValue } from '../helpers/sanitizer';
import { SortingType, SortTypeNullEnum } from './sort.dto';

export class SortBuilder<Entity> {
  public groupByEntityAttribute: string;

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private readonly sort: SortingType[],
  ) {}

  build() {
    if (this.sort) {
      for (const field of this.sort) {
        const table = (field.table || this.qb.alias).toLowerCase();
        const fieldName = `"${table}"."${sanitizeSqlValue(field.field)}"`;
        this.qb.addSelect(fieldName);
        this.qb.addOrderBy(
          fieldName,
          field.type,
          SortTypeNullEnum[field.nulls],
        );
      }
    }

    return this.qb;
  }
}

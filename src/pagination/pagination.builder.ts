import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { PaginationInputType } from './pagination.dto';

export class PaginationBuilder<Entity> {
  public groupByEntityAttribute: string;

  constructor(
    private readonly qb: SelectQueryBuilder<Entity>,
    private readonly paginate: PaginationInputType,
  ) {}

  build() {
    if (this.paginate) {
      if (this.paginate.page) {
        this.qb.offset(this.paginate.page);
      }
      if (this.paginate.per_page) {
        this.qb.limit(this.paginate.per_page);
      }
    }

    return this.qb;
  }
}

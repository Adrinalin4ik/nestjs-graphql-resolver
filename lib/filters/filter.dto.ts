import { registerEnumType, InputType } from '@nestjs/graphql';
import { getEntityNameEnum } from '../dto/entity-helper.dto';
import { decorateField } from '../helpers/decorators';

export enum OperatorQuery {
  AND = 'AND',
  OR = 'OR',
}

registerEnumType(OperatorQuery, {
  name: 'Operator',
});

export enum OperationQuery {
  EQ = '=',
  NEQ = '!=',
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
  IN = 'IN',
  ILIKE = 'ILIKE',
  NOTILIKE = 'not ILIKE',
  BETWEEN = 'BETWEEN',
  NOTBETWEEN = 'NOT BETWEEN',
  NULL = 'IS NULL',
  NOTNULL = 'IS NOT NULL',
  IS = 'IS',
  ISNOT = 'IS NOT',
}

registerEnumType(OperationQuery, {
  name: 'Operation',
});

export enum JoinTypeQuery {
  Left,
  Inner,
}

registerEnumType(JoinTypeQuery, {
  name: 'JoinType',
});

export class FilterItemInputType {
  operation: OperationQuery;
  operator: OperatorQuery;
  values: string[];
  field: string;
  table: string;
}

export class FiltersExpressionGroupInputType {
  operator: OperatorQuery;
  filters: FilterItemInputType[];
}

export class FiltersExpressionInputType {
  operator: OperatorQuery;
  filters: FilterItemInputType[];
  groups: FiltersExpressionGroupInputType[];
}

let filterInputType;

export const generateFilterInputType = () => {
  if (!filterInputType) {
    const entityNameEnum = getEntityNameEnum();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function FilterItemQuery() {}
    {
      decorateField(FilterItemQuery, 'operation', OperationQuery, {
        nullable: false,
      });
      decorateField(FilterItemQuery, 'operator', OperatorQuery, {
        nullable: false,
      });
      decorateField(FilterItemQuery, 'values', [String]);
      decorateField(FilterItemQuery, 'table', entityNameEnum);
      decorateField(FilterItemQuery, 'field', String, {
        nullable: false,
      });

      InputType()(FilterItemQuery);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function FiltersExpressionGroupQuery() {}
    {
      decorateField(FiltersExpressionGroupQuery, 'operator', OperatorQuery, {
        nullable: false,
      });
      decorateField(FiltersExpressionGroupQuery, 'filters', [FilterItemQuery]);

      InputType()(FiltersExpressionGroupQuery);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function FiltersExpressionQuery() {}
    {
      decorateField(FiltersExpressionQuery, 'operator', OperatorQuery, {
        nullable: false,
      });
      decorateField(FiltersExpressionQuery, 'filters', [FilterItemQuery]);
      decorateField(FiltersExpressionQuery, 'groups', [
        FiltersExpressionGroupQuery,
      ]);

      InputType()(FiltersExpressionQuery);
    }
    filterInputType = FiltersExpressionQuery;
  }
  return filterInputType;
};

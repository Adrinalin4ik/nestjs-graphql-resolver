import { Field, InputType } from '@nestjs/graphql';
import { getEntityNameEnum } from '../../dto/entity-helper.dto';
import { OperationQuery, OperatorQuery } from '../../filters/filter.dto';
import { decorateField } from '../../helpers/decorators';
import { AggregationEnum } from '../aggregations.dto';

export class HavingFilterItem {
  operation: OperationQuery;
  operator: OperatorQuery;
  values: string[];
  field: string;
  table: string;
  aggregator: AggregationEnum;
}

export class HavingGroupInputType {
  operator: OperatorQuery;
  filters: HavingFilterItem[];
}

export class HavingInputType {
  operator: OperatorQuery;
  groups: HavingGroupInputType[];
  filters: HavingFilterItem[];
}

let havingInputType;

export const generateHavingItemInputType = () => {
  if (!havingInputType) {
    const entityNameEnum = getEntityNameEnum();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function HavingFiltersInputTypeQuery() {}
    {
      decorateField(HavingFiltersInputTypeQuery, 'operation', OperationQuery, {
        nullable: false,
      });
      decorateField(HavingFiltersInputTypeQuery, 'operator', OperatorQuery, {
        nullable: false,
      });
      decorateField(HavingFiltersInputTypeQuery, 'values', [String]);
      decorateField(HavingFiltersInputTypeQuery, 'table', entityNameEnum);
      decorateField(HavingFiltersInputTypeQuery, 'field', String, {
        nullable: false,
      });
      decorateField(
        HavingFiltersInputTypeQuery,
        'aggregator',
        AggregationEnum,
        {
          nullable: false,
        },
      );

      InputType()(HavingFiltersInputTypeQuery);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function HavingGroupInputTypeQuery() {}
    {
      decorateField(HavingGroupInputTypeQuery, 'operator', OperatorQuery, {
        nullable: false,
      });
      decorateField(HavingGroupInputTypeQuery, 'filters', [
        HavingFiltersInputTypeQuery,
      ]);

      InputType()(HavingGroupInputTypeQuery);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function HavingInputTypeQuery() {}
    {
      decorateField(HavingInputTypeQuery, 'operator', OperatorQuery, {
        nullable: false,
      });
      decorateField(HavingInputTypeQuery, 'filters', [
        HavingFiltersInputTypeQuery,
      ]);
      decorateField(HavingInputTypeQuery, 'groups', [
        HavingGroupInputTypeQuery,
      ]);

      InputType()(HavingInputTypeQuery);
    }
    havingInputType = HavingInputTypeQuery;
  }
  return havingInputType;
};

import { InputType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from 'typeorm';
import { getEntityNameEnum } from '../dto/entity-helper.dto';
import { decorateField } from '../helpers/decorators';

export enum SortTypeNullEnum {
  LAST = 'NULLS LAST',
  FIRST = 'NULLS FIRST',
}

registerEnumType(SortTypeNullEnum, {
  name: 'SortTypeNullEnum',
});

export enum SortTypeEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}

registerEnumType(SortTypeEnum, {
  name: 'SortTypeEnum',
});

const sortInputTypeMap = new Map();

export interface SortingType {
  type: SortTypeEnum;
  nulls: SortTypeNullEnum;
  table: string;
  field: string;
}

export const generateSortInputType = (entity: BaseEntity) => {
  const generatedTypeName = `${entity['name']}SortInputType`;
  const generatedFieldTypeName = `${entity['name']}SortFieldType`;

  if (!sortInputTypeMap.has(generatedTypeName)) {
    const entityNameEnum = getEntityNameEnum();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function SortInputFieldType() {}
    {
      decorateField(SortInputFieldType, 'field', String, {
        nullable: false,
      });
      decorateField(SortInputFieldType, 'type', SortTypeEnum, {
        defaultValue: SortTypeEnum.ASC,
      });
      decorateField(SortInputFieldType, 'nulls', SortTypeNullEnum, {
        defaultValue: SortTypeNullEnum.LAST,
      });
      decorateField(SortInputFieldType, 'table', entityNameEnum);

      Object.defineProperty(SortInputFieldType, 'name', {
        value: generatedFieldTypeName,
      });

      InputType()(SortInputFieldType);
    }

    sortInputTypeMap.set(generatedTypeName, [SortInputFieldType]);
  }
  return sortInputTypeMap.get(generatedTypeName);
};

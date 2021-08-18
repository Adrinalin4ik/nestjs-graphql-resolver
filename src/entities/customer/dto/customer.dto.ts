import { Field } from '@nestjs/graphql';
import { EntityObjectType } from '../../../../lib';
import { BaseDTO } from '../../utils/base.dto';

@EntityObjectType({
  name: 'Customer',
})
export class CustomerObjectType extends BaseDTO {
  @Field()
  name: string;
}

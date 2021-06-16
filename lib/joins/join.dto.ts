import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { getEntityNameEnum } from '../dto/entity-helper.dto';

export enum JoinTypeQuery {
  Inner,
}

registerEnumType(JoinTypeQuery, {
  name: 'JoinType',
});

const EntityNameEnum = getEntityNameEnum();

@InputType()
export class JoinItemQuery {
  @Field(() => EntityNameEnum, { nullable: false })
  table: string;

  @Field(() => [JoinItemQuery], { nullable: true })
  joins: [JoinItemQuery];

  @Field(() => JoinTypeQuery, {
    nullable: true,
    defaultValue: JoinTypeQuery.Inner,
  })
  type: JoinTypeQuery;
}

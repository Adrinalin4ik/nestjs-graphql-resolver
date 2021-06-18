import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateCompetency {
  @Field()
  seniority_id: number;

  @Field()
  title: string;
}

@InputType()
export class UpdateCompetency extends CreateCompetency {
  @Field()
  id: number;

  @Field({ nullable: true })
  seniority_id: number;
}

@ObjectType()
export class DeleteCompetencyResult {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  affectedRows: number;
}

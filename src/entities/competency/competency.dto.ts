import { Field, InputType, Int, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { EntityObjectType } from '../../../lib';
import { SeniorityObjectType } from '../seniority/seniority.dto';
import { Seniority } from '../seniority/seniority.entity';
import { SubcompetencyObjectType } from '../sub-competency/sub-competency.dto';
import { UserCompetencyObjectType } from '../user-competency/user-competency.dto';

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


// @InputType()
// export class CompetencyInputDTO extends PartialType(Competency) {
//   @Field({nullable: true})
//   title: string

//   @Field({nullable: true})
//   seniority_id: number

//   @Field(() => Seniority, {nullable: true})
//   seniority: Seniority
// }

@EntityObjectType({
  name: 'Competency'
})
export class CompetencyObjectType {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => Int)
  public seniority_id: number;

  @Field(() => SeniorityObjectType)
  seniority: SeniorityObjectType;

  @Field(() => [SubcompetencyObjectType], { nullable: true })
  subcompetencies: SubcompetencyObjectType[];

  @Field(() => [UserCompetencyObjectType], { nullable: true })
  user_competencies: UserCompetencyObjectType[];
}
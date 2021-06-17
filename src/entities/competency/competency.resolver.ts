import { Resolver } from '@nestjs/graphql';
import { Competency } from './competency.entity';
import { AutoResolver } from '../../../lib';

// const type = generateGroupAggType(Competency);

@AutoResolver(Competency)
@Resolver(() => Competency)
export class CompetencyResolver {
  // @ResolveField(() => {
  //   const type = generateGroupAggType(Competency);
  //   return [type];
  // })
  // groupAgg() {
  //   return [];
  // }
  // constructor(
  //   private readonly competencyService: CompetencyService,
  //   private readonly seniorityService: SeniorityService,
  //   private readonly loader: BatchLoaders,
  // ) {}
  // // @Loader<number, Seniority[]>(async (ids) => {
  // //   const seniorities = await getRepository(Seniority).find({
  // //     where: { company: { id: In([...ids]) } },
  // //   });
  // //   const senioritiesById = groupBy(seniorities, 'seniorityId');
  // //   return ids.map((id) => senioritiesById[id] ?? []);
  // // })
  // @ResolveField()
  // async seniority(
  //   @Parent() competency: Competency,
  //   @Loader('seniority')
  //   loader: any,
  //   @Filters(Competency) filter,
  // ) {
  //   return await loader['seniority'].load(competency.seniority_id);
  // }
  // @Query(() => [Competency])
  // async competencies(
  //   @Filters(Competency) filter,
  //   @Loader(Competency) loader,
  //   // @AggregationParameter(Competency) agg,
  //   @Info() info: GraphQLResolveInfo,
  // ) {
  //   //return loader;
  //   const qb = getRepository(Competency).createQueryBuilder();
  //   let res;
  //   const json_agg_fields = new Set([`id`]);
  //   const select_fields = new Set();
  //   const groupByField = (
  //     info.fieldNodes[0].selectionSet.selections as FieldNode[]
  //   ).find((x) => x.name.value === 'groupAgg');
  //   let groupByEntityAttribute;
  //   if (groupByField) {
  //     for (const attributeField of groupByField.selectionSet
  //       .selections as FieldNode[]) {
  //       const aggName = attributeField.name.value;
  //       if (aggName === 'count') {
  //         // qb.select(`count(${fieldName})`);
  //         // select_fields.add(`count(${fieldName})`);
  //       } else if (aggName === 'by') {
  //         const groupField = (
  //           attributeField.selectionSet.selections as FieldNode[]
  //         )[0].name.value;
  //         groupByEntityAttribute = groupField;
  //         qb.groupBy(groupField);
  //         select_fields.add(groupField);
  //       } else if (aggName === 'fields') {
  //         for (const field of attributeField.selectionSet
  //           .selections as FieldNode[]) {
  //           if (!field.selectionSet?.selections) {
  //             const fieldName = field.name.value;
  //             json_agg_fields.add(fieldName);
  //           }
  //         }
  //       }
  //     }
  //     const json_agg = Array.from(json_agg_fields.values())
  //       .map((field) => `'${field}', ${field}`)
  //       .join(',');
  //     qb.select(
  //       `${Array.from(select_fields).join(
  //         ',',
  //       )}, count(seniority_id), json_agg(json_build_object(${json_agg}))`,
  //     );
  //     res = await qb.getRawMany();
  //     res = [
  //       {
  //         // groupAgg: [
  //         //   {
  //         //     by: { seniority_id: 1 },
  //         //     count: 1,
  //         //     fields: [{ seniority_id: 1 }],
  //         //   },
  //         // ],
  //         groupAgg: res.map((x) => ({
  //           by: { [groupByEntityAttribute]: x[groupByEntityAttribute] },
  //           count: x.count,
  //           fields: x.json_agg,
  //         })),
  //         // {
  //         //   // count: 1,
  //         //   // fields: res.map((x) => x.json_agg),
  //         // },
  //       },
  //     ];
  //   } else {
  //     res = loader;
  //   }
  //   return res;
  //   // return [];
  // }
}

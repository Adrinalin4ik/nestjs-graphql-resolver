# NestJS graphql resolver

This library provides functionality which allow to generate resolvers automatically.

----
## Installation

1. Install npm package
```bash
npm i nestjs-graphql-resolver
```

2. Decorate your graphql dtos with  `@EntityObjectType()` instead of default `@ObjectType()` from @nestjs/graphql library.

```typescript
import { Field, Int } from '@nestjs/graphql';
import { EntityObjectType } from 'nestjs-graphql-resolver';

...

@EntityObjectType({
  name: 'Subcompetency' // <--- Name must be like a typeorm entity name
}) 
export class SubCompetencyObjectType {
  @Field(() => Int) // <--- Don't forget to decorate your dto with @Field or another compatible decorator from @nestjs/graphql library.
  id: number;

...
```

3. Decorate your graphql resolvers with `@AutoResolver(EntityName)`

```typescript
import { Query, Resolver } from '@nestjs/graphql';
import { SubCompetency } from './sub_competency.entity';
import { AutoResolver } from 'nestjs-graphql-resolver';

@AutoResolver(SubCompetencyObjectType) // <--- Here, and provide graphql dto as a parameter
@Resolver(() => SubCompetencyObjectType)
export class SubCompetencyResolver {
  @Query(() => [SubCompetencyObjectType])
  async test() {
    return [];
  }
}

```
4. Naming convention. Postgres table names should be snake_case. You can make it simply add first parameter to entity decorator

```typescript
...
// user-competency.entity.ts
@Entity('user_competency') // <--- Here
export class UserCompetency extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;


```
5. You should have an entity class for additional table in `Many to Many` relation. This stuff is needed because graphql should expose this table and types for enums.

6. Done! Launch the project and test it.
----
## Features
The library automatically resolves `One to Many`, `Many`, `Many to One` relations and solves n+1 problem. Also you can make [subscribers automatically for you mutations](#subscribers).

All resolvers provide additional features:
- [Filtring](#filtring)
- [Grouping](#grouping)
- [Ordering](#ordering)
- [Paginating](#pagination)

You can override any resolver, just define it in resolver's class just like that

```typescript

import { Query, Resolver } from '@nestjs/graphql';
import { SubCompetency } from './sub_competency.entity';
import { AutoResolver } from 'nestjs-graphql-resolver';

@AutoResolver(SubCompetency)
@Resolver(() => SubCompetency)
export class SubCompetencyResolver {
  
  @Query(() => [SubCompetency]) 
  async subcompetencies() { // <--- this method will redefine automatically created resolver
    return [];
  }

  ... // <--- Btw, you can make mutations here as well
}

```

----
## Filtring
Filter feature generates SQL query for filtering. It could be combined with the joining feature if you'd like to filter by some nested model.

Filter input type looks like this

```graphql
input FiltersExpressionQuery {
  or: [FiltersExpressionQuery]
  and: [FiltersExpressionQuery]
  entity: {
    field: {operator: value}
  }
}

```

Filters support "`or`" and "`and`" operator and following operation types:
```
EQ = '=',
NEQ = '!=',
GT = '>',
GTE = '>=',
LT = '<',
LTE = '<=',
IN = 'IN',
ILIKE = 'ILIKE',
NOTILIKE = 'NOT ILIKE',
BETWEEN = 'BETWEEN',
NOTBETWEEN = 'NOT BETWEEN',
NULL = 'IS NULL',
NOTNULL = 'IS NOT NULL',
```
#### Examples:
##### Simple filter
```graphql
{
  subcompetencies(
    where: {
      id: {in: [1, 2]}
    }
  ) {
    id
  }
}

```


##### Filter with groups.
##### This will generates query: where (title ilike '%1%' or title ilike '%2%')
```graphql


{
  competencies(
    where: {
      or: [
        {
          title: {ilike: "%1%"}
        },
        {
          title: {ilike: "%2%"}
        }
      ]
    }
  ) {
    title
  }
}
```

##### This example joins two nested tables and make a filtring by joined SubCompetency model.
```graphql

{
  seniorities(
    where: {
      competencies: {
        subcompetencies: {
          id: {gte: 1}
        }
      }
    }
  ) {
    title
    competencies {
      title
      subcompetencies(
        order_by: {
          id: asc
        }
      ) {
        id
        title
      }
    }
  }
}

```

## Grouping
Grouping feature allows to make group by and have some filters via having input.

Each generated resolver will have `groupAgg` field. This field cannot be combined with entity fields.

`groupAgg` object type looks like this

```graphql
{
  competencies {
    groupAgg {
      by {
        seniority_id # the field for the group by statement
      }
      count
      sum {
        id
      }
      avg {
        id
      }
      max {
        id
      }
      min {
        id
      }
      fields { # the fields which will be returned in each group
        seniority_id
        subcompetencies {
          title
        }
      }
    }
  }
}

```

You can combine it with filter which allow to use aggregation functions.

#### Examples

##### This example returns an array of seniorities which includes more than one competency.
```graphql

{
  seniorities (
    where: {
      competencies: {
        count: {
          seniority_id: {gte: 1}
        }
      }
    }
  ) {
    id
  } 
}

```

##### This example returns groups which has seniority_id value equal or more than 1
```graphql
{
  competencies(
    where: {
      or: [
        {
          count: {
            id: {gte: 1}
          }
        }
      ]
    }
  ) {
    groupAgg {
      count
      sum {
        id
      }
      avg {
        id
      }
      fields {
        id
        seniority_id
      }
    }
  }
}
```


## Ordering
Ordering feature allows to order results by some fields.

#### Examples

##### Simple example

```graphql
{
  subcompetencies(order_by: {id: asc}) {
    id
  }
}
```

#### Ordering by nested fields.

```graphql

{
  seniorities(
    order_by: {
      competencies: {
        id: asc
        subcompetencies: {
          id: asc
        }
      }
    }
  ) {
    id
  }
}
```

## Pagination
Pagination allows paging the response data. Pagination will not work well with `groupAgg` statement.

#### Examples

##### Simple example

```graphql

{
  subcompetencies(
    paginate: {
      page: 0, 
      per_page: 2
    }
  ) {
    title
  }
}
```

##### Complete example

```graphql
{
  competencies(
    where: {
      subcompetencies: {
        title: {ilike: "%5%"}
      }
    }
    order_by: {
      seniority: {
        title: asc_null_first
      }
    }
    paginate: {
      page: 0,
      per_page: 1
    }
  ) {
    id
    title
    subcompetencies {
      groupAgg {
        by {
          competency_id
        }
        count
        fields {
          id
          title
        }
      }
    }
  }
}

```
## Subscribers
To use subscribers you have to set `installSubscriptionHandlers: true` in your GraphqlModuleOptions. Also you have to be sure that `appolo-server-express` is installed. Then you'll be able to use `@AutoMutation` decorator instead of `@Mutation`.

`@AutoMutation` decorator has all options from `@Mutation` and `@Subscriber` decorator

#### Examples

```typescript
...

@AutoResolver(Competency)
@Resolver(() => Competency)
export class CompetencyResolver {
  
  @AutoMutation(() => Competency) // <--- Add decorator here
  async createCompetency(
    @Args('competency') inputCompetency: CreateCompetency,
  ) {
    const competency = new Competency();
    competency.seniority_id = inputCompetency.seniority_id;
    competency.title = inputCompetency.title;

    return competency.save();
  }

...
```
this example will generate mutation (`createCompetency`) and subscription (`createCompetencySubscriber`)

## Special cases
- Joining by specific relation key in case of `@JoinColumn()`, you should add `@JoinColumnField(fromTable, ToTable, propertyName)` decorator to the graphql dto.

```typescript

@EntityObjectType({
  name: 'Task',
})
export class TaskObjectType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;
  
  @Field(() => Int, { nullable: true })
  assignee_id: number;

  @JoinColumnField(Task, User, 'assignee_id')
  @Field(() => UserObjectType)
  assignee: UserObjectType;
}


```

## Limitations
- Date and scalars are not supported, use string instead
- Works only with postgres adapter for typeorm
- Works only with express server
- Subscribers works with only appolo-server-express
- You cannot provide options for pub-sub for subscriptions
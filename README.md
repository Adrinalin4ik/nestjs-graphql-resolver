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

@EntityObjectType() // <--- Here
@Entity('subcompetency')
export class SubCompetency extends BaseEntity {
  @Field(() => Int) // <--- Don't forget to decorate your dto with @Field or other compatible decorator from @nestjs/graphql library.
  @PrimaryGeneratedColumn() // <--- You can combine your graphql type with typeorm dto. It works, but it's up to you. You can split as well.
  id: number;

...
```

3. Decorate your graphql resolvers with `@AutoResolver(EntityName)`

```typescript
import { Query, Resolver } from '@nestjs/graphql';
import { SubCompetency } from './sub_competency.entity';
import { AutoResolver } from 'nestjs-graphql-resolver';

@AutoResolver(SubCompetency) // <--- Here, and provide entity as a parameter
@Resolver(() => SubCompetency)
export class SubCompetencyResolver {
  @Query(() => [SubCompetency])
  async test() {
    return [];
  }
}

```
4. Naming convention. Postgres table names should be snake_case. You can make it simply add first parameter to entity decorator

```typescript
@EntityObjectType()
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
The library automatically resolves `One to Many`, `Many`, `Many to One` relations and solves n+1 problem.

All resolvers provide additional features:
- [Joining](#joining)
- [Filtring](#filtring)
- [Grouping](#grouping)
- [Sorting](#sorting)
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
## Joining
Joining feature allows to join some tables and use them for filtering or grouping.

Joining input type looks like this
```graphql

input JoinItemQuery {
  table: EntityName!
  joins: [JoinItemQuery!]
  type: JoinType = Inner
}

```
#### Examples
##### Join two tables to one model
```graphql
{
  competencies(
    joins: [
      {
        table: SubCompetency
      }
    	{
        table: Seniority
      }
    ]
  ) {
    title
  }
}

```
##### Join table Competency to Seniority and SubCompetency to Competency
```graphql
{
  seniorities(
    joins: [{
      table: Competency
      joins: [{
        table: SubCompetency
      }]
    }]
  ) {
    title
  }
}

```

## Filtring
Filter feature generates SQL query for filtering. It could be combined with the joining feature if you'd like to filter by some nested model.

Filter input type looks like this

```graphql
input FiltersExpressionQuery {
  operator: Operator
  filters: [
    {
      operation: Operation
      operator: Operator
      values: [String!]
      table: EntityName
      field: String
    }
  ]
  groups: [FiltersExpressionGroupQuery!]
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
  subcompetencies(filters: {
    filters: [
      {
        operation: IN
        field: "id"
        values: ["1", "2"]
      }
    ]
  }) {
    id
  }
}

```


##### Filter with groups.
##### This will generates query: where (title ilike '%1%' or title ilike '%2%')
```graphql


{
  competencies(
    filters: {
    	groups: [{
        filters: [
          {
            operation: ILIKE
            operator: OR
            values: "%1%"
            field: "title"
          }
          {
            operation: ILIKE
            operator: OR
            values: "%2%"
            field: "title"
          }
        ]
      }]
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
    joins: [{
      table: Competency
      joins: [{
        table: SubCompetency
      }]
    }]
    filters: {
      operator: OR
      filters: [{
        operation: GTE
        values: "1"
        field: "id"
        table: SubCompetency
      }]
    }
  ) {
    title
    competencies {
      title
      subcompetencies(sort: {
        field: "id"
        type: ASC
        table: SubCompetency
      }) {
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

You can combine it with having filter which allow to use aggregation functions and the input type looks exactly like in filtring feature, but with one additional attribute - `aggregator`. This feature can be combined with joining feature.

#### Examples

##### This example returns an array of seniorities which includes more than one competency.
```graphql


{
  seniorities (
    joins: {
      table: Competency
    }
    having: {
      groups: [
        {
          filters: [
            {
              operator: OR
              operation: GTE
              field: "seniority_id"
              table: Competency
              values: "1"
              aggregator: COUNT
            }
          ]
        }
    	]
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
    joins: {
      table: SubCompetency
    }
    having: {
      groups: [
        {
          filters: [
            {
              operator: OR
              operation: GTE
              field: "seniority_id"
              values: "1"
            }
          ]
        }
    	]
  	}
  ) {
    groupAgg {
      by {
        seniority_id
      }
      count
      fields {
        seniority_id
      }
    }
  }
}
```


## Sorting
Sorting feature allows to order results by some fields. You can combine it with `joining` feature.

#### Examples

##### Simple example

```graphql
{
  subcompetencies(sort: {
    field: "id"
    type: ASC
  }) {
    id
  }
}
```

#### Ordering by nested fields.

```graphql

{
  seniorities(
    joins: {
      table: Competency
      joins: {
        table: SubCompetency
      }
    }
    sort: [{
      table: SubCompetency
      field: "id"
      type: ASC
    }, {
      table: Competency
      field: "id"
      type: ASC
    }]
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
    joins: [{
      table: SubCompetency
      type: Inner
    },
    {
      table: Seniority
      type: Inner
    }]
    filters: {
      filters: {
        operation: ILIKE
        field: "title"
        table: SubCompetency
        values: ["%5%"]
      }
    }
    sort: [
      {
        field: "title"
        type: ASC
        table: Seniority
        nulls: FIRST
      }
    ]
    paginate: {
      page: 0,
      per_page: 1
    }
  ) {
    id
    title
    subcompetencies {
      id
      title
    }
  }
}

```

## Limitations
- Date and scalars are not supported, use string instead
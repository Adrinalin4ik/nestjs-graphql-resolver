# NestJS graphql resolver

This library provides functionality which allow to generate resolvers automatically.

----
## Features
The library automatically resolves One to Many, Many, Many to One relations.

All resolvers provide additional features:
- Joining
- Filtring
- Grouping
- Sorting
- Aggregating
- Paginating

### Joining
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

#### Examples
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

### Filtring
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
      },
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
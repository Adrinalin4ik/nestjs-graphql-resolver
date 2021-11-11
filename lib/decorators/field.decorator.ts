import { Field as GQLField, FieldOptions, ReturnTypeFunc } from '@nestjs/graphql';
import storage from '../storage';

export function Field(returnTypeFunction?: ReturnTypeFunc | FieldOptions, options?: FieldOptions): PropertyDecorator {
  return (target, propertyName) => {
    if (!options && !returnTypeFunction) {
      return GQLField()(target, propertyName);
    } else if (typeof returnTypeFunction !== 'function') {
      return GQLField(returnTypeFunction)(target, propertyName);
    } else {
      storage.fields.push({
        objectName: target.constructor.name,
        propertyName,
        propertyType: returnTypeFunction()
      })
      return GQLField(returnTypeFunction as ReturnTypeFunc, options)(target, propertyName);
    }
  }  
}

// export const ResolverField = (fromTable: typeof BaseEntity, toTable: typeof BaseEntity, joinPropertyName: string) => {
//   return (_dto, propertyName) => {
//     storage.relations.push({
//       propertyName, fromTable, toTable, joinPropertyName
//     })
//   };
// };

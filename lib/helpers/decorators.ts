import { Field, FieldOptions, ReturnTypeFunc } from '@nestjs/graphql';

export const decorateField = (
  clazz,
  fieldName: string,
  fieldType: ReturnTypeFunc,
  options?: FieldOptions,
) => {
  clazz.prototype[fieldName] = Field(fieldType, {
    ...options,
    nullable: true,
  })(clazz.prototype, fieldName);
};

/*
  This method adds new resolver to the resolver class, decorates it and adds decoratable parameters
*/
export const addMethodToResolverClass = ({
  resolverClass,
  methodName,
  methodDecorators,
  paramDecorators,
  callback,
}: {
  resolverClass;
  methodName: string;
  methodDecorators: MethodDecorator[];
  paramDecorators?: ParameterDecorator[];
  callback: (...args) => any;
}) => {
  const target = resolverClass.prototype;
  const key = methodName;
  let desc: any = {
    value: callback,
  };

  Reflect.metadata('design:returntype', Promise)(target, key);
  Reflect.metadata('design:paramtypes', [Object, Object])(target, key);
  Reflect.metadata('design:type', Function)(target, key);
  paramDecorators?.forEach((decorator, index) => {
    decorator(target, key, index);
  });

  methodDecorators.forEach((decorator) => {
    desc = decorator(target, key, desc) || desc;
  });

  Object.defineProperty(target, key, desc);
};

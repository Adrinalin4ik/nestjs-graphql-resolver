"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmitType = void 0;
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const mapped_types_1 = require("@nestjs/mapped-types");
const decorators_1 = require("../decorators");
const get_fields_and_decorator_util_1 = require("../schema-builder/utils/get-fields-and-decorator.util");
const type_helpers_utils_1 = require("./type-helpers.utils");
function OmitType(classRef, keys, decorator) {
    const { fields, decoratorFactory } = get_fields_and_decorator_util_1.getFieldsAndDecoratorForType(classRef);
    const isInheritedPredicate = (propertyKey) => !keys.includes(propertyKey);
    class OmitObjectType {
        constructor() {
            mapped_types_1.inheritPropertyInitializers(this, classRef, isInheritedPredicate);
        }
    }
    if (decorator) {
        decorator({ isAbstract: true })(OmitObjectType);
    }
    else {
        decoratorFactory({ isAbstract: true })(OmitObjectType);
    }
    mapped_types_1.inheritValidationMetadata(classRef, OmitObjectType, isInheritedPredicate);
    mapped_types_1.inheritTransformationMetadata(classRef, OmitObjectType, isInheritedPredicate);
    fields
        .filter((item) => !keys.includes(item.name))
        .forEach((item) => {
        if (shared_utils_1.isFunction(item.typeFn)) {
            item.typeFn();
        }
        decorators_1.Field(item.typeFn, Object.assign({}, item.options))(OmitObjectType.prototype, item.name);
        type_helpers_utils_1.applyFieldDecorators(OmitObjectType, item);
    });
    return OmitObjectType;
}
exports.OmitType = OmitType;

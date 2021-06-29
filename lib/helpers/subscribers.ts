import { AfterInsert, AfterRemove, AfterUpdate } from "typeorm"

export enum ESubscriberType {
  create = "Create",
  update = "Update",
  delete = "Delete",
}

export const generateSubscriberName = (name: String, type:ESubscriberType) => {
  return `${name}${type}Subscriber`
}

export const getDecoratorByOperationType = (type: ESubscriberType) => {
  switch(type) {
    case ESubscriberType.create:
      return AfterInsert
    case ESubscriberType.update:
      return AfterUpdate
    case ESubscriberType.delete:
      return AfterRemove
  }
}
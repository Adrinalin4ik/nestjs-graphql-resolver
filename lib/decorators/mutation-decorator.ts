import { Mutation, MutationOptions, ReturnTypeFunc, Subscription, SubscriptionOptions } from "@nestjs/graphql";
import { addDecoratedMethodToClass } from "../helpers/decorators";
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export interface AutoMutationConfig extends MutationOptions {
  subscription: SubscriptionOptions
}

export const AutoMutation = (typeFunc: ReturnTypeFunc, options?: AutoMutationConfig) => {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const subscriberName = `${options?.subscription.name || propertyKey}Subscriber`;

    addDecoratedMethodToClass({
      methodDecorators: [
        Subscription(typeFunc, options?.subscription)
      ],
      paramDecorators: [],
      methodName: subscriberName,
      resolverClass: target.constructor,
      callback: () => {
        return pubsub.asyncIterator(subscriberName);
      }
    })


    const targetMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      const res = await targetMethod.apply(this, args)

      pubsub.publish(subscriberName, {
        [subscriberName]: res,
      });

      return res
    }

    Mutation(typeFunc, options)(target, propertyKey, descriptor)

    return descriptor
  }
}
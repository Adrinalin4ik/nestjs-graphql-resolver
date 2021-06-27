import { Injectable, Module, OnModuleInit } from '@nestjs/common';
import { Field, GqlModuleOptions, GqlOptionsFactory, GraphQLModule, InputType, ObjectType } from '@nestjs/graphql';
import { decorateField } from './helpers/decorators';
import { join } from 'path';
import { getMetadataArgsStorage } from 'typeorm';
import { InputPlugin } from './input.plugin';;

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  public createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        path: '/subscriptions',
      },
    };
  }
}

@Module({
  imports: [
    // GraphQLModule.forRootAsync({
    //   useClass: GraphqlOptions
    // }),
    
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        path: '/subscriptions',
      },
      tracing: true,
    }),
  ],
  providers: [InputPlugin],
  controllers: [],
})
export class NestJSGraphqlResolver {}

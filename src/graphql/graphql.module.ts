import { Injectable } from '@nestjs/common';
import {
  GqlModuleOptions,
  GqlOptionsFactory,
  GraphQLModule,
} from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  public createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      emitTypenameField: true,
      definitions: {
        emitTypenameField: true,
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // subscriptions: {
      //   path: '/subscriptions',
      // },
    } as any;
  }
}

export default GraphQLModule.forRootAsync({
  useClass: GraphqlOptions,
});

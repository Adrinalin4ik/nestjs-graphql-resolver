import { Injectable } from '@nestjs/common';
import {
  GqlModuleOptions,
  GqlOptionsFactory,
  GraphQLModule,
} from '@nestjs/graphql';
import { join } from 'path';

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
  public createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      debug: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      // subscriptions: {
      //   path: '/subscriptions',
      // },
    };
  }
}

export default GraphQLModule.forRootAsync({
  useClass: GraphqlOptions,
});

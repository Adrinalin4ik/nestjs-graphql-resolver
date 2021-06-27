import { Field, InputType, ObjectType, Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { decorateField } from './helpers/decorators';

@Plugin()
export class InputPlugin implements ApolloServerPlugin {
  serverWillStart() {
    function Test1() {}
    decorateField(Test1, 'test', () => String)
    InputType()(Test1)
  }
  // requestDidStart(): GraphQLRequestListener {
  //   console.log('Request started');
  //   return {
  //     willSendResponse() {
  //       console.log('Will send response');
  //     },
  //   };
  // }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApolloServer = void 0;
const __1 = require("..");
function getApolloServer(app) {
    try {
        const graphqlFederationModule = app.get(__1.GraphQLFederationModule);
        return graphqlFederationModule.apolloServer;
    }
    catch (error) { }
    try {
        const graphqlModule = app.get(__1.GraphQLModule);
        return graphqlModule.apolloServer;
    }
    catch (error) { }
    throw new Error('Nest could not find either the GraphQLFederationModule or GraphQLModule. Neither module is registered in the given application.');
}
exports.getApolloServer = getApolloServer;

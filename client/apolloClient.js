import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import WebSocketLink from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getOperationAST } from 'graphql';

const httpUri = 'http://localhost:3000/graphql';
const wsUri = 'ws://localhost:3000/subscriptions';

const link = ApolloLink.split(
    operation => {
        const operationAST = getOperationAST(operation.query, operation.operationName);
        return !!operationAST && operationAST.operation === 'subscription';
    },
    new WebSocketLink({
        uri: wsUri,
        options: {
            reconnect: true, //auto-reconnect
            // // carry login state (should use secure websockets (wss) when using this)
            // connectionParams: {
            //   authToken: localStorage.getItem("Meteor.loginToken")
            // }
        }
    }),
    new HttpLink({ uri: httpUri })
);

const cache = new InMemoryCache(window.__APOLLO_STATE);

const client = new ApolloClient({
    link,
    cache
});
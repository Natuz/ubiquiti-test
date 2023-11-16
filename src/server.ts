require('dotenv').config();

import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { createYoga, createSchema } from 'graphql-yoga';
import { useServer } from 'graphql-ws/lib/use/ws';
import { parse } from 'url';

import { typeDefs } from './schemas';
import { resolvers } from './resolvers';

const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const graphqlEndpoint = process.env.GRAPHQL_URI || '/api/graphql';

// Prepare Yoga
const yoga = createYoga({
    graphqlEndpoint,
    graphiql: {
        subscriptionsProtocol: 'WS'
    },
    schema: createSchema({
        typeDefs,
        resolvers
    }),
    context: () => {
        // TODO provide auth headers
    }
});

(async () => {
    const server = createServer(async (req, res) => {
        try {
            const url = parse(req.url!, true);

            // start yoga only on certain address, leave other api paths to nextjs
            if (url.pathname!.startsWith(graphqlEndpoint)) {
                await yoga(req, res);
            }
        } catch (err) {
            console.error(`Error while handling ${req.url}`, err);
            res.writeHead(500).end();
        }
    });

    // Prepare Graphql WebSocket server
    useServer(
        {
            execute: (args: any) => args.rootValue.execute(args),
            subscribe: (args: any) => args.rootValue.subscribe(args),
            onSubscribe: async (ctx, msg) => {
                const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped({
                    ...ctx,
                    req: ctx.extra.request,
                    socket: ctx.extra.socket,
                    params: msg.payload
                });

                const args = {
                    schema,
                    operationName: msg.payload.operationName,
                    document: parse(msg.payload.query),
                    variableValues: msg.payload.variables,
                    contextValue: await contextFactory(),
                    rootValue: {
                        execute,
                        subscribe
                    }
                };

                const errors = validate(args.schema, args.document);

                if (errors.length) {
                    return errors;
                }

                return args;
            },
            onConnect: () => {
                // TODO check auth headers
            }
        },
        new WebSocketServer({ server, path: graphqlEndpoint })
    )

    await new Promise((resolve, reject) =>
        server.listen(port, (error?: any) => (error ? reject(error) : resolve(null)))
    )

    console.log(`✓ GraphQL server running on http://${hostname}:${port}${graphqlEndpoint}`);
    console.log(`✓ GraphQL WebSocket server running on ws://${hostname}:${port}${graphqlEndpoint}`);
})();

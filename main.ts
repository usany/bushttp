import { createSchema, createYoga } from "graphql-yoga";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";

// Create GraphQL Yoga instance
export const yoga = createYoga({
  schema: createSchema({
    typeDefs: schema,
    resolvers: {
      Query: resolvers,
    },
  }),
  graphqlEndpoint: "/graphql",
});

Deno.serve({
  port: 5000,
  onListen({ hostname, port }) {
    console.log(
      `Listening on http://${hostname}:${port}${yoga.graphqlEndpoint}`,
    );
  },
}, yoga);

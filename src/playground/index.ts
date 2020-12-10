/* eslint-disable no-console */
import { makeExecutableSchema } from '@graphql-tools/schema';
import applicationFactory, { typeDefs, resolvers } from '@via-profit-services/core';
import knexFactory from '@via-profit-services/knex';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import geographyFactory from '../index';

dotenv.config();

const PORT = 9005;
const app = express();
const server = http.createServer(app);

const knex = knexFactory({
  connection: {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
  },
});

const geography = geographyFactory();

const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    geography.typeDefs,
  ],
  resolvers: [
    resolvers,
    geography.resolvers,
  ],
})

const application = applicationFactory({
  schema,
  server,
  debug: true,
  enableIntrospection: true,
  middleware: [
    knex.middleware,
    geography.middleware,
  ],
});

app.use(application);
server.listen(PORT, () => {
  console.log(`GraphQL server started at http://localhost:${PORT}/graphql`);
  console.log(`Subscription server started at ws://localhost:${PORT}/graphql`);
});

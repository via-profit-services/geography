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
const LOG_DIR = './log';
const server = http.createServer(app);

const knex = knexFactory({
  logDir: LOG_DIR,
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

const { viaProfitGraphql } = applicationFactory({
  schema,
  server,
  logDir: LOG_DIR,
  debug: true,
  enableIntrospection: true,
  middleware: [
    knex,
    geography.middleware,
  ],
});

app.use(viaProfitGraphql);
server.listen(PORT, () => {
  console.log(`GraphQL server started at http://localhost:${PORT}/graphql`);
  console.log(`Subscription server started at ws://localhost:${PORT}/graphql`);
});

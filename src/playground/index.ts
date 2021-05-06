/* eslint-disable no-console */
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as core from '@via-profit-services/core';
import * as knex from '@via-profit-services/knex';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import * as geography from '../index';

dotenv.config();

const PORT = 9005;
const app = express();
const server = http.createServer(app);
(async () => {

  const knexMiddleware = knex.factory({
    connection: {
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
    },
  });

  const geographyMiddleware = geography.factory({
    // geocoder: 'Yandex',
    // yandexGeocoderAPIKey: '2f157179-c04e-45be-9ca9-9ec9d0abd00b',
    geocoder: 'DaData',
    daDataAPIKey: '81c55d81e9f6d090778cc7d8d10721add4cd9f73',
  });

  const schema = makeExecutableSchema({
    typeDefs: [
      core.typeDefs,
      geography.typeDefs,
    ],
    resolvers: [
      core.resolvers,
      geography.resolvers,
    ],
  })

  const { graphQLExpress } = await core.factory({
    schema,
    server,
    debug: true,
    middleware: [
      knexMiddleware,
      geographyMiddleware,
    ],
  });

  app.use(graphQLExpress);
  server.listen(PORT, () => {
    console.log(`GraphQL server started at http://localhost:${PORT}/graphql`);
  });

})();
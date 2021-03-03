import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { routes } from './routes';
import { allowOrigin } from './util/allow-origin-middleware';
import { defaultErrorRequestHandler, defaultNotFoundResponse } from './util/error-request-handler';

export const getApp = (): Application => {
    const app = express();

    // Test route to verify that the tests are working
    // app.use('/', async (_req, res) => res.status(200).send({ data: await User.find() }));

    app.use(cors({ credentials: true, origin: process.env.WEB_ORIGIN }));

    app.use(bodyParser.json());

    app.use(allowOrigin);

    routes(app);

    app.use(defaultNotFoundResponse);
    app.use(defaultErrorRequestHandler);

    return app;
};

import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import userRoutes from './routes/user-routes';
import { allowOrigin } from './util/allow-origin-middleware';
import { defaultErrorRequestHandler, defaultNotFoundResponse } from './util/error-request-handler';

const PORT = process.env.PORT || 5000;
(async () => {
    const app = express();

    app.use(cors({ credentials: true, origin: process.env.WEB_ORIGIN }));

    await createConnection();

    app.use(bodyParser.json());

    app.use(allowOrigin);

    app.use('/api/users', userRoutes);

    app.use(defaultNotFoundResponse);
    app.use(defaultErrorRequestHandler);

    app.listen(PORT, () => {
        console.log(`[server]: Server is running`);
    });
})();

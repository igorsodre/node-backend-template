import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { createConnection } from 'typeorm';
import userRoutes from './routes/user-routes';
import { defaultErrorRequestHandler, defaultNotFoundResponse } from './util/error-request-handler';
import { allowOrigin } from './util/allow-origin-middleware';
config();
const PORT = process.env.PORT || 5000;
(async () => {
    const app = express();

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

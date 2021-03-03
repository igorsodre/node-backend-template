import 'dotenv/config';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { getApp } from './app';

const PORT = process.env.PORT || 5000;
(async () => {
    const app = getApp();

    await createConnection();

    app.listen(PORT, () => {
        console.log(`[server]: Server is running`);
    });
})();

/* eslint-disable no-undef */
module.exports = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // host: process.env.TYPEORM_HOST,
    // port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
    // username: process.env.TYPEORM_USERNAME,
    // password: process.env.TYPEORM_PASSWORD,
    // database: process.env.TYPEORM_DATABASE,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
};

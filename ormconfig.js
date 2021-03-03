/* eslint-disable no-undef */
const envType = process.env.NODE_ENV;
const databaseurl = {
    deveplopment: process.env.DATABASE_URL,
    test: process.env.TEST_DATABASE_URL,
    production: process.env.DATABASE_URL,
};

module.exports = {
    type: 'postgres',
    url: databaseurl[envType] || process.env.DATABASE_URL,
    dropSchema: envType === 'test',
    migrationsRun: envType === 'test',
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
};

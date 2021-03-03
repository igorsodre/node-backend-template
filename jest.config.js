/* eslint-disable no-undef */
module.exports = {
    clearMocks: true,
    transform: { '^.+\\.ts?$': 'ts-jest' },
    testRegex: '/spec/.*\\.(test|spec)?\\.(ts|tsx)$',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['jest-extended'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

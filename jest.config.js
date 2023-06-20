/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  reporters: process.env.CI
    ? [['github-actions', { silent: false }], 'summary']
    : ['default'],
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './src/',
});

const jestConfig = {
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  testPathIgnorePatterns: [
    'renderWrapper.tsx',
  ],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(jestConfig);

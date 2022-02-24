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
    'setupTests.ts',
  ],
  testEnvironment: 'jest-environment-jsdom',
  automock: false,
  resetMocks: false,
  setupFilesAfterEnv: [
    './src/__tests__/setupTests.ts',
  ],
};

module.exports = createJestConfig(jestConfig);

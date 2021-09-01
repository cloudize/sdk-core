module.exports = {
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    '**/src/**/*.[jt]s?(x)',
    '!**/lib/**',
    '!**/tests/unit/**',
    '!**/node_modules/**',
  ],
  modulePaths: ['<rootDir>/src'],
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  testEnvironment: 'node',
  testMatch: [
    '**/tests/dev/**/*.test.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '\\.ts$': ['ts-jest'],
  },
};

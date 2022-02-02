module.exports = {
  modulePaths: ['<rootDir>/src'],
  moduleFileExtensions: [
    'js',
    'ts',
  ],
  testEnvironment: 'node',
  testMatch: [
    '**/tests/build/**/*.test.(j|t)s',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '\\.ts$': ['ts-jest'],
  },
};

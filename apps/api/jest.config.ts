import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '(src|test/unit)/.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {}],
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
};

export default config;

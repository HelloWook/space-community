import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'test',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {}],
  },
  testEnvironment: 'node',
};

export default config;

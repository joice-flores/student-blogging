module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['/tests'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@domain/(.*)$': '/src/domain/$1',
    '^@application/(.*)$': '/src/application/$1',
    '^@infrastructure/(.*)$': '/src/infrastructure/$1',
    '^@shared/(.*)$': '/src/shared/$1'
  }
};

module.exports = {
  "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
  // ... other configurations
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@constant/(.*)$': '<rootDir>/src/constant/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@user/(.*)$': '<rootDir>/src/modules/user/$1',
    '^@auth/(.*)$': '<rootDir>/src/modules/auth/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@db/(.*)$': '<rootDir>/src/database/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
  },
  // ... other configurations
};

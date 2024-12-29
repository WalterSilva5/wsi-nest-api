const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.test') });

console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);

module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: "../",
  testRegex: ".*\\.(test|spec)\\.ts$",
  transform: {
    ".+\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1"
  },
  coverageDirectory: "../coverage",
  testEnvironment: "node"
};

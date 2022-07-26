'use strict';

module.exports = {
  require: "ts-node/register",
  spec: [
    "./src/**/*.test.js",
    "./src/**/*.test.ts"
  ],
  "watch-files": [
    "./src/**/*.js",
    "./src/**/*.ts"
  ],
  'node-option': ['preserve-symlinks'],
  exit: true
}
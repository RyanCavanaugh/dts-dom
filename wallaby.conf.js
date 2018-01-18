'use strict';

module.exports = function (wallaby) {
  return {
    env: {
      type: 'node'
    },
    files: [
      'lib/**/*.ts',
      '!**/__tests__/**/*.test.ts'
    ],
    testFramework: 'jest',
    tests: [
      '**/__tests__/**/*.test.ts'
    ]
  };
};

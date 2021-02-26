'use strict';

var BroccoliReplace = require('.');

module.exports = new BroccoliReplace('test/fixtures', {
  files: [
    'simple.txt'
  ],
  variables: {
    key: 'value'
  }
});

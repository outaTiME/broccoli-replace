
/*
 * broccoli-replace
 *
 * Copyright (c) 2014 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/broccoli-replace/blob/master/LICENSE-MIT
 */

'use strict';

module.exports = function (broccoli) {

  var replace = require('./index');

  var testFiles = broccoli.makeTree('test/fixtures');
  testFiles = replace(testFiles, {
    files: [
      'simple.txt'
    ],
    variables: {
      key: 'value'
    }
  });

  return [testFiles];

};

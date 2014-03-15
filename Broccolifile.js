
/*
 * broccoli-replace
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/broccoli-replace/blob/master/LICENSE-MIT
 */

module.exports = function (broccoli) {

  'use strict';

  // broccoli

  var replace = require('./filters');

  // test

  var testFiles = broccoli.makeTree('test/fixtures');
  testFiles = replace(testFiles, {
    files: [
      'simple.txt'
    ],
    variables: {
      'key': 'value'
    }
  });

  return [testFiles];

};

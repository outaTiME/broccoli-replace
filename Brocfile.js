
/*
 * broccoli-replace
 *
 * Copyright (c) 2016 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/broccoli-replace/blob/master/LICENSE-MIT
 */

'use strict';

var replace = require('./index');

module.exports = replace('test/fixtures', {
  files: [
    'simple.txt'
  ],
  variables: {
    key: 'value'
  }
});

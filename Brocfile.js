
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

  return replace('test/fixtures', {
      files: [
          'simple.txt'
      ],
      variables: {
          key: 'value'
      }
  });

};


/*
 * broccoli-replace
 *
 * Copyright (c) 2014 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/broccoli-replace/blob/master/LICENSE-MIT
 */

var fs = require('fs');
var rimraf = require('rimraf');

exports['replace'] = {

  tearDown: function (cb) {
    rimraf.sync('temp');
    cb();
  },

  main: function (test) {

    'use strict';

    var expect;
    var result;

    test.expect(1);

    expect = 'value\n';
    result = fs.readFileSync('temp/simple.txt', 'utf8');
    test.equal(expect, result, 'should replace simple key with value');

    test.done();

  }

};

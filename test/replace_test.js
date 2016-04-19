
/*
 * broccoli-replace
 *
 * Copyright (c) 2016 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/broccoli-replace/blob/master/LICENSE-MIT
 */

'use strict';

// dependencies

var assert = require('assert');
var fs = require('fs');
var rimraf = require('rimraf');

// test

afterEach(function() {
  rimraf.sync('temp');
});

describe('broccoli-replace', function() {

  var expect;
  var result;

  it('should replace simple key with value', function(done) {
    expect = 'value\n';
    result = fs.readFileSync('temp/simple.txt', 'utf8');
    assert.equal(result, expect);
    done();
  });

});

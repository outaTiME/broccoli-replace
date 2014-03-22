
/*
 * broccoli-replace
 *
 * Copyright (c) 2014 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/broccoli-replace/blob/master/LICENSE-MIT
 */

'use strict';

// dependencies

var Filter = require('broccoli-filter');
var minimatch = require("minimatch");
var Applause = require('applause');

function ReplaceFilter (inputTree, options) {
  if (!(this instanceof ReplaceFilter)) {
    return new ReplaceFilter(inputTree, options);
  }
  Filter.call(this, inputTree, options);
  this.inputTree = inputTree;
  this.options = options || {};
  this.files = this.options.files;
  this.applause = Applause.create(options);
}

ReplaceFilter.prototype = Object.create(Filter.prototype);
ReplaceFilter.prototype.constructor = ReplaceFilter;

ReplaceFilter.prototype.getDestFilePath = function (relativePath) {
  var files = this.options.files || [];
  for (var i = 0; i < files.length; i++) {
    var pattern = files[i];
    var match = minimatch(relativePath, pattern);

    /* console.log('>>> getDestFilePath: %s, pattern: %s, match: %s', relativePath,
      pattern, match); */

    if (match === true) {
      return relativePath;
    }
  }
  return null;
};

ReplaceFilter.prototype.processString = function (string) {
  var result = this.applause.replace(string);
  if (result === false) {
    // no replacements
    return string;
  }
  return result;
};

module.exports = ReplaceFilter;

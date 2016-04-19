
/*
 * broccoli-replace
 *
 * Copyright (c) 2016 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/broccoli-replace/blob/master/LICENSE-MIT
 */

'use strict';

// dependencies

var Filter = require('broccoli-persistent-filter');
var minimatch = require('minimatch');
var Applause = require('applause');

function ReplaceFilter(inputTree, options) {
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

ReplaceFilter.prototype.getDestFilePath = function(relativePath) {
  var files = this.options.files || [];
  for (var i = 0; i < files.length; i++) {
    var pattern = files[i];
    var match = minimatch(relativePath, pattern);
    if (match === true) {
      return relativePath;
    }
  }
  return null;
};

ReplaceFilter.prototype.processString = function(string) {
  var res = this.applause.replace(string);
  var result = res.content;
  var count = res.count;
  if (count === 0) {
    // no replacements
    return string;
  }
  return result;
};

module.exports = ReplaceFilter;

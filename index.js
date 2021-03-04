'use strict';

var Filter = require('broccoli-filter');
var minimatch = require('minimatch');
var Applause = require('applause');

function ReplaceFilter(inputTree, options) {
  if (!this) {
    return new ReplaceFilter(inputTree, options);
  }

  options = options || {};
  Filter.call(this, inputTree, options);
  this._files = options.files;
  this._applause = Applause.create(options);
}

ReplaceFilter.prototype = Object.create(Filter.prototype);
ReplaceFilter.prototype.constructor = ReplaceFilter;

ReplaceFilter.prototype.getDestFilePath = function (relativePath) {
  var files = this._files || [];
  for (var i = 0; i < files.length; i++) {
    var pattern = files[i];
    var match = minimatch(relativePath, pattern);
    if (match === true) {
      return relativePath;
    }
  }

  return null;
};

ReplaceFilter.prototype.processString = function (string) {
  var result = this._applause.replace(string).content;
  if (result === false) {
    // No replacements
    return string;
  }

  return result;
};

module.exports = ReplaceFilter;

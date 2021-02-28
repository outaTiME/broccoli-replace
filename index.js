'use strict';

var Filter = require('broccoli-filter');
var Applause = require('applause');

function ReplaceFilter(inputTree, options) {
  if (!this) {
    return new ReplaceFilter(inputTree, options);
  }

  options = options || {};
  Filter.call(this, inputTree, options);
  this.applause = Applause.create(options);
}

ReplaceFilter.prototype = Object.create(Filter.prototype);
ReplaceFilter.prototype.constructor = ReplaceFilter;

ReplaceFilter.prototype.processString = function (string) {
  var result = this.applause.replace(string).content;
  if (result === false) {
    // No replacements
    return string;
  }

  return result;
};

module.exports = ReplaceFilter;

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
  var res = this.applause.replace(string);
  var result = res.content;
  var count = res.count;
  if (count === 0) {
    // No replacements
    return string;
  }

  return result;
};

module.exports = ReplaceFilter;

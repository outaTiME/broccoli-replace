
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

  var fs = require('fs');
  var filename = './node_modules/pattern-replace/README.md';
  var readme = fs.readFileSync(filename, 'utf8');
  // initialize section
  var sections = {};
  // http://regex101.com/r/wJ2wW8
  var pattern = /(\n#{3}\s)(.*)([\s\S]*?)(?=\1|$)/ig;
  var match;
  while ((match = pattern.exec(readme)) !== null) {
    var section = match[2];
    var contents = match[3];
    // trace
    /* var msg = "Found " + section + " → ";
    msg += "Next match starts at " + pattern.lastIndex;
    console.log(msg); */
    sections[section] = contents;
  }

  // took contents from readme section

  var getSectionContents = function (name) {
    return sections[name] || '_(Coming soon)_'; // empty
  };

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

  // readme

  var srcFiles = broccoli.makeTree('docs');
  srcFiles = replace(srcFiles, {
    files: [
      'README.md'
    ],
    variables: {
      'options': function () {
        var source = getSectionContents('Replacer Options');
        return source;
      }
    }
  });
  return [testFiles, srcFiles];

};

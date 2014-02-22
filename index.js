
/*
 * broccoli-replace
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 outaTiME
 * Licensed under the MIT license.
 * https://github.com/outaTiME/broccoli-replace/blob/master/LICENSE-MIT
 */

// dependencies

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var broccoli = require('broccoli');
var Transform = require('broccoli-transform');
var Replacer = require('pattern-replace');
var chalk = require('chalk');

module.exports = ReplaceTransform;
ReplaceTransform.prototype = Object.create(Transform.prototype);
ReplaceTransform.prototype.constructor = ReplaceTransform;
function ReplaceTransform (inputTree, options) {
  if (!(this instanceof ReplaceTransform)) return new ReplaceTransform(inputTree, options);
  this.inputTree = inputTree;
  this.options = options;
  this.replacer = new Replacer(options);
}

ReplaceTransform.prototype.transform = function (srcDir, destDir) {
  if (this.options.files != null) {
    var files = broccoli.helpers.multiGlob(this.options.files, {
      cwd: path.join(srcDir)
    });
    for (var i = 0; i < files.length; i++) {
      var source = path.join(srcDir, files[i]);
      var target = path.join(destDir, files[i]);
      var string = fs.readFileSync(source, { encoding: 'utf8' });
      // var result = UglifyJS.minify(string, this.options);
      var result = this.replacer.replace(string, {
        source: source,
        target: target
      });
      if (result !== false) {
        console.log('Replace ' + chalk.cyan(source) + ' → ' +
          chalk.cyan(target));
        mkdirp.sync(path.join(destDir, path.dirname(files[i])));
        fs.writeFileSync(target, result, { encoding: 'utf8' });
      }
    }
  } else {
    throw new Error('The files attribute must be specified.');
  }
};

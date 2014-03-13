# broccoli-replace [![Build Status](https://secure.travis-ci.org/outaTiME/broccoli-replace.png?branch=master)](http://travis-ci.org/outaTiME/broccoli-replace)

> Replace text patterns using [pattern-replace](https://github.com/outaTiME/pattern-replace).



## Install

From NPM:

```shell
npm install broccoli-replace --save-dev
```

## Replace Filter

Assuming installation via NPM, you can use `broccoli-replace` in your brocfile like this:

```javascript
module.exports = function (broccoli) {
  var replace = require('broccoli-replace');
  var srcFiles = broccoli.makeTree('src');
  srcFiles = replace(srcFiles, {
    files: [
      '**/*.html' // replace only html files in src
    ],
    patterns: [
      {
        match: 'foo',
        replacement: 'bar'
      }
    ]
  });
  return [srcFiles];
};
```

### Options

#### files
Type: `Array`
Default: `[]`

Define the source files that will be used for replacements, you can use globbing via [minimatch](https://github.com/isaacs/minimatch) library.

> This is a mandatory value, an empty definition will ignore any kind of replacement.

#### patterns
Type: `Array`

Define patterns that will be used to replace the contents of source files.

> Check out [pattern-replace](https://github.com/outaTiME/pattern-replace#patterns) documentation for more details.

#### variables
Type: `Object`

This is the old way to define patterns using plain object (simple variable lookup mechanism and no regexp support), you can still using but for more control you should use the new `patterns` way.

> Check out [pattern-replace](https://github.com/outaTiME/pattern-replace#variables) documentation for more details.

#### prefix
Type: `String`
Default: `@@`

The prefix added for matching (prevent bad replacements / easy way).

> Check out [pattern-replace](https://github.com/outaTiME/pattern-replace#prefix) documentation for more details.

#### usePrefix
Type: `Boolean`
Default: `true`

If set to `false`, we match the pattern without `prefix` concatenation (useful when you want to lookup an simple string).

> Check out [pattern-replace](https://github.com/outaTiME/pattern-replace#useprefix) documentation for more details.

#### preservePrefix
Type: `Boolean`
Default: `false`

If set to `true`, we preserve the `prefix` in target.

> Check out [pattern-replace](https://github.com/outaTiME/pattern-replace#preserveprefix) documentation for more details.

#### delimiter
Type: `String`
Default: `.`

The delimiter used to flatten when using object as replacement.

> Check out [pattern-replace](https://github.com/outaTiME/pattern-replace#delimiter) documentation for more details.

### Usage Examples

#### Basic

File `src/manifest.appcache`:

```
CACHE MANIFEST
# @@timestamp

CACHE:

favicon.ico
index.html

NETWORK:
*
```

Broccolifile:

```js
module.exports = function (broccoli) {
  var replace = require('broccoli-replace');
  var srcFiles = broccoli.makeTree('src');
  srcFiles = replace(srcFiles, {
    files: [
      'manifest.appcache'
    ],
    patterns: [
      {
        match: 'timestamp',
        replacement: new Date().getTime()
      }
    ]
  });
  return [srcFiles];
};
```

#### Multiple matching

File `src/manifest.appcache`:

```
CACHE MANIFEST
# @@timestamp

CACHE:

favicon.ico
index.html

NETWORK:
*
```


File `src/humans.txt`:

```
              __     _
   _    _/__  /./|,//_`
  /_//_// /_|///  //_, outaTiME v.@@version

/* TEAM */
  Web Developer / Graphic Designer: Ariel Oscar Falduto
  Site: http://www.outa.im
  Twitter: @outa7iME
  Contact: afalduto at gmail dot com
  From: Buenos Aires, Argentina

/* SITE */
  Last update: @@timestamp
  Standards: HTML5, CSS3, robotstxt.org, humanstxt.org
  Components: H5BP, Modernizr, jQuery, Twitter Bootstrap, LESS, Jade, Grunt
  Software: Sublime Text 2, Photoshop, LiveReload

```

Broccolifile:

```js
module.exports = function (broccoli) {
  var pkg = require('./package.json');
  var replace = require('broccoli-replace');
  var srcFiles = broccoli.makeTree('src');
  srcFiles = replace(srcFiles, {
    files: [
      'manifest.appcache',
      'humans.txt'
    ],
    patterns: [
      {
        match: 'version',
        replacement: pkg.version
      },
      {
        match: 'timestamp',
        replacement: new Date().getTime()
      }
    ]
  });
  return [srcFiles];
};
```

#### Cache busting

File `src/index.html`:

```html
<head>
  <link rel="stylesheet" href="/css/style.css?rel=@@timestamp">
  <script src="/js/app.js?rel=@@timestamp"></script>
</head>
```

Broccolifile:

```js
module.exports = function (broccoli) {
  var replace = require('broccoli-replace');
  var srcFiles = broccoli.makeTree('src');
  srcFiles = replace(srcFiles, {
    files: [
      'index.html'
    ],
    patterns: [
      {
        match: 'timestamp',
        replacement: new Date().getTime()
      }
    ]
  });
  return [srcFiles];
};
```

#### Include file

File `src/index.html`:

```html
<body>
  @@include
</body>
```

Broccolifile:

```js
module.exports = function (broccoli) {
  var fs = require('fs');
  var replace = require('broccoli-replace');
  var srcFiles = broccoli.makeTree('src');
  srcFiles = replace(srcFiles, {
    files: [
      'index.html'
    ],
    patterns: [
      {
        match: 'include',
        replacement: fs.readFileSync('./includes/content.html').toString()
      }
    ]
  });
  return [srcFiles];
};
```

#### Regular expression

File `src/username.txt`:

```
John Smith
```

Broccolifile:

```js
module.exports = function (broccoli) {
  var replace = require('broccoli-replace');
  var srcFiles = broccoli.makeTree('src');
  srcFiles = replace(srcFiles, {
    files: [
      'username.txt'
    ],
    patterns: [
      {
        match: /(\w+)\s(\w+)/,
        replacement: '$2, $1' // replaces "John Smith" to "Smith, John"
      }
    ]
  });
  return [srcFiles];
};
```

#### Lookup for `foo` instead of `@@foo`

The `String` matching type or `expression` in `false` generates a simple variable lookup mechanism `@@string`, to skip this mode use one of the below rules ... make your choice:

Broccolifile:

```js
module.exports = function (broccoli) {
  var replace = require('broccoli-replace');
  var srcFiles = broccoli.makeTree('src');

  // option 1 (explicitly using an regexp)
  var replacer_op1 = replace(srcFiles, {
    files: [
      'foo.txt'
    ],
    patterns: [
      {
        match: /foo/g,
        replacement: 'bar'
      }
    ]
  });

  // option 2 (easy way)
  var replacer_op2 = replace(srcFiles, {
    files: [
      'foo.txt'
    ],
    patterns: [
      {
        match: 'foo',
        replacement: 'bar'
      }
    ],
    usePrefix: false
  });

  // option 3 (old way)
  var replacer_op3 = replace(srcFiles, {
    files: [
      'foo.txt'
    ],
    patterns: [
      {
        match: 'foo',
        replacement: 'bar'
      }
    ],
    prefix: '' // remove prefix
  });

  return [replacer_op1, replacer_op2, replacer_op3];
};
```

## Release History

 * 2014-02-26   v0.0.4   Fix issue when no replacement found.
 * 2014-02-25   v0.0.3   Code normalization and documentation updated.
 * 2014-02-23   v0.0.2   Use Filter instead of Transformer.
 * 2014-02-22   v0.0.1   Initial version.

---

Task submitted by [Ariel Falduto](http://outa.im/)

# broccoli-replace [![Build Status](https://secure.travis-ci.org/outaTiME/broccoli-replace.png?branch=master)](http://travis-ci.org/outaTiME/broccoli-replace)

> Replace text patterns with [applause](https://github.com/outaTiME/applause).



## Install

From NPM:

```shell
npm install broccoli-replace --save-dev
```

## Replace Filter

Assuming installation via NPM, you can use `broccoli-replace` in your broccolifile like this:

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

#### patterns.match
Type: `String|RegExp`

Indicates the matching expression.

If matching type is `String` we use a simple variable lookup mechanism `@@string` (in any other case we use the default regexp replace logic):

```javascript
{
  patterns: [
    {
      match: 'foo',
      replacement: 'bar'  // replaces "@@foo" to "bar"
    }
  ]
}
```

#### patterns.replacement
Type: `String|Function|Object`

Indicates the replacement for match, for more information about replacement check out the [String.replace].

You can specify a function as replacement. In this case, the function will be invoked after the match has been performed. The function's result (return value) will be used as the replacement string.

```javascript
{
  patterns: [
    {
      match: /foo/g,
      replacement: function () {
        return 'bar'; // replaces "foo" to "bar"
      }
    }
  ]
}
```

Also supports object as replacement (we create string representation of object using [JSON.stringify]):

```javascript
{
  patterns: [
    {
      match: /foo/g,
      replacement: [1, 2, 3] // replaces "foo" with string representation of "array" object
    }
  ]
}
```

[String.replace]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
[JSON.stringify]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

#### patterns.json
Type: `Object`

If an attribute `json` found in pattern definition we flatten the object using `delimiter` concatenation and each key–value pair will be used for the replacement (simple variable lookup mechanism and no regexp support).

```javascript
{
  patterns: [
    {
      json: {
        "key": "value" // replaces "@@key" to "value"
      }
    }
  ]
}
```

Also supports nested objects:

```javascript
{
  patterns: [
    {
      json: {
        "key": "value",   // replaces "@@key" to "value"
        "inner": {        // replaces "@@inner" with string representation of "inner" object
          "key": "value"  // replaces "@@inner.key" to "value"
        }
      }
    }
  ]
}
```

#### patterns.yaml
Type: `String`

If an attribute `yaml` found in pattern definition will be converted and then processed like [json attribute](#patternsjson).

```javascript
{
  patterns: [
    {
      yaml: 'key: value'  // replaces "@@key" to "value"
    }
  ]
}
```

#### patterns.cson
Type: `String`

If an attribute `cson` found in pattern definition will be converted and then processed like [json attribute](#patternsjson).

```javascript
{
  patterns: [
    {
      cson: 'key: \'value\''
    }
  ]
}
```

#### variables
Type: `Object`

This is the old way to define patterns using plain object (simple variable lookup mechanism and no regexp support), you can still using but for more control you should use the new `patterns` way.

```javascript
{
  variables: {
    'key': 'value' // replaces "@@key" to "value"
  }
}
```

#### prefix
Type: `String`
Default: `@@`

The prefix added for matching (prevent bad replacements / easy way).

> This only applies for simple variable lookup mechanism.

#### usePrefix
Type: `Boolean`
Default: `true`

If set to `false`, we match the pattern without `prefix` concatenation (useful when you want to lookup an simple string).

> This only applies for simple variable lookup mechanism.

#### preservePrefix
Type: `Boolean`
Default: `false`

If set to `true`, we preserve the `prefix` in target.

> This only applies for simple variable lookup mechanism and `patterns.replacement` is an string.

#### delimiter
Type: `String`
Default: `.`

The delimiter used to flatten when using object as replacement.

#### preserveOrder
Type: `Boolean`
Default: `false`

If set to `true`, we preserve the patterns definition order, otherwise these will be sorted (in ascending order) to prevent replacement issues like `head` / `header` (typo regexps will be resolved at last).


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
        replacement: fs.readFileSync('./includes/content.html', 'utf8')
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

 * 2014-03-23   v0.1.5   Readme updated.
 * 2014-03-22   v0.1.4   Modular core renamed to [applause](https://github.com/outaTiME/applause). Performance improvements. Expression flag removed. New pattern matching for CSON object. More test cases, readme updated and code cleanup.
 * 2014-03-21   v0.1.3   Test cases in Mocha, readme updated and code cleanup.
 * 2014-03-15   v0.1.2   New [pattern-replace](https://github.com/outaTiME/pattern-replace) modular core for replacements.
 * 2014-02-26   v0.0.4   Fix issue when no replacement found.
 * 2014-02-25   v0.0.3   Code normalization and documentation updated.
 * 2014-02-23   v0.0.2   Use Filter instead of Transformer.
 * 2014-02-22   v0.0.1   Initial version.

---

Task submitted by [Ariel Falduto](http://outa.im/)

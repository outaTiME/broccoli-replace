# broccoli-replace [![Build Status](https://img.shields.io/travis/outaTiME/broccoli-replace.svg)](https://travis-ci.org/outaTiME/broccoli-replace) [![NPM Version](https://img.shields.io/npm/v/broccoli-replace.svg)](https://npmjs.org/package/broccoli-replace)

> Replace text patterns with [applause](https://github.com/outaTiME/applause).

## Install

From NPM:

```shell
npm install broccoli-replace --save-dev
```

## Replace Filter

Assuming installation via NPM, you can use `broccoli-replace` in your Brocfile.js like this:

```javascript
var replace = require('broccoli-replace');
module.exports = replace('src', {
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

#### patterns.replacement or patterns.replace
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

> The replacement only resolve the [special replacement patterns] when using regexp for matching.

[String.replace]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
[JSON.stringify]: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[special replacement patterns]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter

#### patterns.json
Type: `Object`

If an attribute `json` is found in pattern definition we flatten the object using `delimiter` concatenation and each key–value pair will be used for the replacement (simple variable lookup mechanism and no regexp support).

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

For deferred invocations is possible to define functions:

```javascript
{
  patterns: [
    {
      json: function (done) {
        done({
          key: 'value'
        });
      }
    }
  ]
}
```

#### patterns.yaml
Type: `String`

If an attribute `yaml` found in pattern definition it will be converted and then processed like [json attribute](#patternsjson).

```javascript
{
  patterns: [
    {
      yaml: 'key: value'  // replaces "@@key" to "value"
    }
  ]
}
```

For deferred invocations is possible to define functions:

```javascript
{
  patterns: [
    {
      yaml: function (done) {
        done('key: value');
      }
    }
  ]
}
```

#### patterns.cson
Type: `String`

If an attribute `cson` is found in pattern definition it will be converted and then processed like [json attribute](#patternsjson).

```javascript
{
  patterns: [
    {
      cson: 'key: \'value\''
    }
  ]
}
```

For deferred invocations is possible to define functions:

```javascript
{
  patterns: [
    {
      cson: function (done) {
        done('key: \'value\'');
      }
    }
  ]
}
```

#### variables
Type: `Object`

This is the old way to define patterns using plain object (simple variable lookup mechanism and no regexp support). You can still use this but for more control you should use the new `patterns` way.

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

If set to `false`, we match the pattern without `prefix` concatenation (useful when you want to lookup a simple string).

> This only applies for simple variable lookup mechanism.

#### preservePrefix
Type: `Boolean`
Default: `false`

If set to `true`, we preserve the `prefix` in target.

> This only applies for simple variable lookup mechanism and when `patterns.replacement` is a string.

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

Brocfile.js:

```js
var replace = require('broccoli-replace');
module.exports = replace('src', {
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

Brocfile.js:

```js
var pkg = require('./package.json');
var replace = require('broccoli-replace');
module.exports = replace('src', {
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
```

#### Cache busting

File `src/index.html`:

```html
<head>
  <link rel="stylesheet" href="/css/style.css?rel=@@timestamp">
  <script src="/js/app.js?rel=@@timestamp"></script>
</head>
```

Brocfile.js:

```js
var replace = require('broccoli-replace');
module.exports = replace('src', {
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
```

#### Include file

File `src/index.html`:

```html
<body>
  @@include
</body>
```

Brocfile.js:

```js
var fs = require('fs');
var replace = require('broccoli-replace');
module.exports = replace('src', {
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
```

#### Regular expression

File `src/username.txt`:

```
John Smith
```

Brocfile.js:

```js
var replace = require('broccoli-replace');
module.exports = replace('src', {
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
```

#### Lookup for `foo` instead of `@@foo`

Brocfile.js:

```js
var mergeTrees = require('broccoli-merge-trees');
var replace = require('broccoli-replace');

// option 1 (explicitly using an regexp)
var replacer_op1 = replace('src_op1', {
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
var replacer_op2 = replace('src_op2', {
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
var replacer_op3 = replace('src_op3', {
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

module.exports = mergeTrees([replacer_op1, replacer_op2, replacer_op3]);
```

## Release History

 * 2016-04-19   v0.12.0   Use broccoli-persistent-filter instead of broccoli-filter (thanks [@alexBaizeau](https://github.com/alexBaizeau))
 * 2015-09-09   v0.11.0   Improvements in handling patterns. Fix plain object representation issue. More test cases.
 * 2015-08-19   v0.10.0   Last [applause](https://github.com/outaTiME/applause) integration and package.json update.
 * 2015-08-06   v0.3.3   Fix issue with special characters attributes ($$, $&, $`, $', $n or $nn) on JSON, YAML and CSON.
 * 2015-05-07   v0.3.1   Fix regression issue with empty string in replacement.
 * 2015-05-01   v0.3.0   Update to [applause](https://github.com/outaTiME/applause) v0.4.0.
 * 2014-10-10   v0.2.0   Escape regexp when matching type is `String`.
 * 2014-06-10   v0.1.7   Remove node v.8.0 support and third party dependencies updated. Update examples in new broccoli way.
 * 2014-04-20   v0.1.6   JSON / YAML / CSON as function supported. Readme updated (thanks [@milanlandaverde](https://github.com/milanlandaverde)).
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

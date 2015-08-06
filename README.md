# broccoli-replace [![Build Status](https://secure.travis-ci.org/outaTiME/broccoli-replace.png?branch=master)](http://travis-ci.org/outaTiME/broccoli-replace)

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

function () {
      var name = 'Applause Options';
      return sections[name] || '_(Coming soon)_'; // empty
    }

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

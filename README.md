# broccoli-replace

[![Build Status](https://img.shields.io/travis/outaTiME/broccoli-replace.svg)](https://travis-ci.org/outaTiME/broccoli-replace)
[![Version](https://img.shields.io/npm/v/broccoli-replace.svg)](https://www.npmjs.com/package/broccoli-replace)
![Prerequisite](https://img.shields.io/badge/node-%3E%3D10-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: outa7iME](https://img.shields.io/twitter/follow/outa7iME.svg?style=social)](https://twitter.com/outa7iME)

> Replace text patterns with [applause](https://github.com/outaTiME/applause).

## Install

From NPM:

```shell
npm install broccoli-replace --save-dev
```

## Usage

Assuming installation via NPM, you can use `broccoli-replace` in your Brocfile.js like this:

```javascript
var BroccoliReplace = require('broccoli-replace');

module.exports = new BroccoliReplace('src', {
  files: [
    '**/*.html'
  ],
  patterns: [
    {
      match: 'foo',
      replacement: 'bar'
    }
  ]
});
```

## Options

Supports all the applause [options](https://github.com/outaTiME/applause#options).

## Examples

### Basic

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

```javascript
var BroccoliReplace = require('broccoli-replace');

module.exports = new BroccoliReplace('src', {
  files: [
    'manifest.appcache'
  ],
  patterns: [
    {
      match: 'timestamp',
      replacement: Date.now()
    }
  ]
});
```

### Multiple matching

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
  Site: https://www.outa.im
  Twitter: @outa7iME
  Contact: afalduto at gmail dot com
  From: Buenos Aires, Argentina

/* SITE */
  Last update: @@timestamp
  Standards: HTML5, CSS3, robotstxt.org, humanstxt.org
  Components: H5BP, Modernizr, jQuery, Bootstrap, LESS, Jade, Grunt
  Software: Sublime Text, Photoshop, LiveReload
```

Brocfile.js:

```javascript
var BroccoliReplace = require('broccoli-replace');
var pkg = require('./package.json');

module.exports = new BroccoliReplace('src', {
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
      replacement: Date.now()
    }
  ]
});
```

### Cache busting

File `src/index.html`:

```html
<head>
  <link rel="stylesheet" href="/css/style.css?rel=@@timestamp">
  <script src="/js/app.js?rel=@@timestamp"></script>
</head>
```

Brocfile.js:

```javascript
var BroccoliReplace = require('broccoli-replace');

module.exports = new BroccoliReplace('src', {
  files: [
    'index.html'
  ],
  patterns: [
    {
      match: 'timestamp',
      replacement: Date.now()
    }
  ]
});
```

### Include file

File `src/index.html`:

```html
<body>
  @@include
</body>
```

Brocfile.js:

```javascript
var BroccoliReplace = require('broccoli-replace');
var fs = require('fs');

module.exports = new BroccoliReplace('src', {
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

### Regular expression

File `src/username.txt`:

```
John Smith
```

Brocfile.js:

```javascript
var BroccoliReplace = require('broccoli-replace');

module.exports = new BroccoliReplace('src', {
  files: [
    'username.txt'
  ],
  patterns: [
    {
      match: /(\w+)\s(\w+)/,
      replacement: '$2, $1' // Replaces "John Smith" with "Smith, John"
    }
  ]
});
```

### Lookup for `foo` instead of `@@foo`

Brocfile.js:

```javascript
var BroccoliMergeTrees = require('broccoli-merge-trees');
var BroccoliReplace = require('broccoli-replace');

var inputNodes = [
  new BroccoliReplace('src', {
    files: [
      'foo.txt'
    ],
    patterns: [
      {
        match: /foo/g, // Explicitly using a regexp
        replacement: 'bar'
      }
    ]
  }),
  new BroccoliReplace('src', {
    files: [
      'foo.txt'
    ],
    patterns: [
      {
        match: 'foo',
        replacement: 'bar'
      }
    ],
    usePrefix: false // Using the option provided
  }),
  new BroccoliReplace('src', {
    files: [
      'foo.txt'
    ],
    patterns: [
      {
        match: 'foo',
        replacement: 'bar'
      }
    ],
    prefix: '' // Removing the prefix manually
  })
];

module.exports = new BroccoliMergeTrees(nodes);
```

## Related

- [applause](https://github.com/outaTiME/applause) - Human-friendly replacements

## License

MIT © [outaTiME](https://outa.im)

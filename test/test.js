var test = require('ava');
var fs = require('fs');
var rimraf = require('rimraf');

test('should replace simple key with value', function (t) {
  var result = fs.readFileSync('temp/simple.txt', 'utf8');
  t.is(result, 'value\n');
});

test.after.always.cb(function (t) {
  rimraf('temp', t.end);
});

var test = require('ava');
var fs = require('fs');

test('should replace simple key with value', function (t) {
  var result = fs.readFileSync('temp/simple.txt', 'utf8');
  t.is(result, 'value\n');
});

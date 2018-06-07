// process.stdout.write('\033c'); // clear the screen
var test = require('tap-only');
var undefsafe = require('../lib/undefsafe');
var fixture = {
  "commits": [
    {
      "modified": [
        "one",
        "two"
      ]
    },
    {
      "modified": [
        "two",
        "four"
      ]
    }
  ]
};

test('2.0.0: match all.*', function (t) {
  var res = undefsafe(fixture, '*.*.*.1');
  t.deepEqual(res, ['two', 'four']);
  t.end();
});


test('2.0.0: match all.*', function (t) {
  var res = undefsafe(fixture, 'commits.*.modified.*.b');
  t.deepEqual(res, ['one', 'two', 'two', 'four']);
  t.end();
});


test('get value on first * selector', function (t) {
  var res = undefsafe(fixture, 'commits.*.modified.0');
  t.deepEqual(res, ['one', 'two']);
  t.end();
});

test('walking multiple routes', function (t) {
  var res = undefsafe(fixture, 'commits.*.modified.*', 'four');
  t.equal(res, 'four');
  t.end();
});


test('get specific match * selector', function (t) {
  var res = undefsafe(fixture, 'commits.*.modified.*', 'two');
  t.equal(res, 'two');
  t.end();
});

test('match * selector returns undefined', function (t) {
  var res = undefsafe(fixture, 'commits.*.modified.*', 'three');
  t.equal(res, undefined);
  t.end();
});

test('match * selector works on objects', function (t) {
  var res = undefsafe(fixture, '*.*.modified.*', 'one');
  t.equal(res, 'one');
  t.end();
});

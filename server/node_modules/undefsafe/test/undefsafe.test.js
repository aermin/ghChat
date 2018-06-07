'use strict';
var test = require('tap-only');
var undefsafe = require('../lib/undefsafe');

test('should handle primatives', function (t) {
  var r = undefsafe(1, '');
  t.equal(r, 1, 'undefsafe is 1: ' + r);
  t.end();
});

test('should handle null', function (t) {
  var r = undefsafe(null, 'foo');
  t.equal(r, undefined, 'undefsafe works with null');
  t.end();
});

test('should handle empty objects', function (t) {
  var value = {};
  var r;

  r = undefsafe(value, '');
  t.equal(r, value, 'value is value' + r);

  r = undefsafe(value, 'foo');
  t.equal(r, undefined, 'value.foo is undefined: ' + r);

  r = undefsafe(value, 'foo.bar');
  t.equal(r, undefined, 'value.foo.bar is undefined: ' + r);

  t.end();
});

test('should handle null properties', function (t) {
  var value = {
    a: {
      b: null,
    },
  };
  var r;

  r = undefsafe(value, 'a.b');
  t.equal(r, null, 'value.a.b is null: ' + r);

  r = undefsafe(value, 'a.b.c');
  t.equal(r, undefined, 'value.a.b.c is undefined: ' + r);

  t.end();
});

test('should find properties with periods in them', function (t) {
  var value = {
    a: { 'one.two': true }
  };

  var r = undefsafe(value, 'a["one.two"]');
  t.equal(r, true, 'a["one.two"]: ' + r);

  value = {
    a: { 'one.two.and\three': true }
  };

  r = undefsafe(value, `a['one.two.and\three']`);
  t.equal(r, true, 'weird: ' + r);

  value = {
    a: { 'one.two.and\three': [
      false,
      true,
    ] }
  };

  r = undefsafe(value, `a['one.two.and\three'].1`);
  t.equal(r, true, 'combo: ' + r);

  value = {
    'one.two': true
  };

  r = undefsafe(value, `['one.two']`);
  t.equal(r, true, 'root: ' + r);

  t.end();
});


test('should find deep object properties', function (t) {
  var value = {
    a: {
      b: {
        c: {
          d: 10,
          e: {
            f: 20,
          },
          g: true,
          h: false,
          i: undefined,
          j: null,
        },
      },
    },
  };
  var r;

  r = undefsafe(value, 'a');
  t.equal(r, value.a, 'value.a: ' + r + ' ' + value.a);

  r = undefsafe(value, 'a.foo');
  t.equal(r, undefined, 'value.a.foo is undefined: ' + r);

  r = undefsafe(value, 'a.b.c.d');
  t.equal(r, 10, 'value.a.b.c.d = 10');

  r = undefsafe(value, 'a.b.c.e');
  t.equal(r, value.a.b.c.e, 'value.a.b.c.e = <object>');

  r = undefsafe(value, 'a.b.c.g');
  t.equal(r, true, 'bool(true)');

  r = undefsafe(value, 'a.b.c.h');
  t.equal(r, false, 'bool(false)');

  r = undefsafe(value, 'a.b.c.i');
  t.equal(r, undefined, 'undefined');

  r = undefsafe(value, 'a.b.c.j');
  t.equal(r, null, 'null');

  t.end();
});

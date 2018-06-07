'use strict';
var test = require('tap').test;
var undefsafe = require('../lib/undefsafe');

test('setting deep object values', function (t) {
  var fixture = {
    a: {
      b: {
        c: {
          d: 10
        }
      }
    }
  };

  undefsafe(fixture, 'a.b.c.d', 20);
  t.equal(fixture.a.b.c.d, 20, 'deep primative changed');
  t.end();
});

test('setting shallow object values', function (t) {
  var fixture = {
    a: {
      b: {
        c: {
          d: 10
        }
      }
    }
  };

  undefsafe(fixture, 'a.b', 20);
  t.equal(fixture.a.b, 20, 'shallow object changed');
  t.end();
});

test('undef value', function (t) {
  var fixture = {
    a: {
      b: {
        c: {
          d: undefined
        }
      }
    }
  };

  undefsafe(fixture, 'a.b', 20);
  t.deepEqual(fixture.a.b, 20, 'swapped undefined');
  t.end();
});

test('missing value', function (t) {
  var fixture = {
    a: {
      b: {
        c: {
          d: 10
        }
      }
    }
  };

  var res = undefsafe(fixture, 'a.c', 20);
  t.equal(res, undefined, 'target was not found');
  t.deepEqual(fixture.a.b, { c: { d: 10 } }, 'shallow object changed');
  t.end();
});

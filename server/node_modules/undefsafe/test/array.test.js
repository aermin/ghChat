'use strict';
var test = require('tap').test;
var undefsafe = require('../lib/undefsafe');

test('get specific array index', function (t) {
  var fixture = {
    a: [1,2,3,4]
  };

  var res = undefsafe(fixture, 'a.2');
  t.equal(res, 3);
  t.end();
});

test('set specific array index', function (t) {
  var fixture = {
    a: [1,2,3,4]
  };

  undefsafe(fixture, 'a.2', 30);
  t.deepEqual(fixture, { a: [1,2,30,4] });
  t.end();
});


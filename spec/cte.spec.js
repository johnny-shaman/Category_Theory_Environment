describe("Test of CTE", function () {
  "use strict";

  const _ = require("../cte.js");
  const EventEmitter = require("events").EventEmitter;

  const a = {a: 1};

  const b = (v) => ({b: v});

  const c = b(15);
  const k = x => _({a: x.a + 5});
  const h = x => _({a: x.a * x.a});
  const m = x => _(x);

  const ary = [1, 3, 2];
  const aryf = [v => v += 2, v => v *= 2, v => v -= 2];
  const rs = {a : 0};
  const qr = (k, v) => rs.a = v;

  const nulledAry0 = [null,2,3];
  const nulledAry1 = [1,null,3];
  const nulledAry2 = [1,2,null];
  const voidAry0 = [undefined,2,3];
  const voidAry1 = [1,undefined,3];
  const voidAry2 = [1,2,undefined];

  const nulledObj0 = {a: null, b: 2, c: 3};
  const nulledObj1 = {a: 1, b: null, c: 3};
  const nulledObj2 = {a: 1, b: 2, c: null};
  const voidObj0 = {a: undefined, b: 2, c: 3};
  const voidObj1 = {a: 1, b: undefined, c: 3};
  const voidObj2 = {a: 1, b: 2, c: undefined};

  const fulfillObj = {a: 0, b: true, c: false};
  const fulfillAry = [0, true, false];
  const toposObj = {a: {b: {c: 3}}};

  const triargF = (x, y, z) => (x + y) * z;

  const EETest = function () {
    EventEmitter.call(this);
  };

  EETest.prototype = Object.create(EventEmitter.prototype, {
    constructor: {
      configurable: true,
      writable: true,
      value: EETest
    }
  });

  const eeTest = _(new EETest());

  it("testing b", () => expect(b(10).b).toBe(10));

  const _beenTest = _(function (v) {
    this.v = v;
  })
  .take(t => t.by.put({
    a (v) {
      this.v += v;
      return this.v;
    },
    b (v) {
      this.v += v;
      return this;
    },
    c (v) {
      this.v += v;
    },
  }))._;
  
})
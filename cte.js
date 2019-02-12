(() => {
  "use strict";

  let _ = function (v) {
    return Object.create(_.prototype, {
      "@": {
        configurable: true,
        get () {
          return v;
        }
      }
    });
  };
  Object.defineProperties(_.prototype, {
    _: {
      configurable: true,
      get () {
        return _.id(this["@"]);
      }
    },
    lift: {
      configurable: true,
      value (f = _, ...v) {
        return f(this, ...v);
      }
    },
    flat: {
      configurable: true,
      value (f = _.id_, ...v) {
        return this._ == null ? this._ : f(this._, ...v);
      }
    },
    endo: {
      configurable: true,
      value (f, ...v) {
        return this._ == null ? this : _(f(this._, ...v));
      }
    },
    bind: {
      configurable: true,
      value (f, ...v) {
        return this.lift(t => t.flat(f, ...v));
      }
    },
    take: {
      configurable: true,
      value (f, ...v) {
        return this.lift(t => ({a: f(t, ...v), s: t}).s);
      }
    },
    ask: {
      configurable: true,
      value (x, y, n) {
        return this.lift(t => x(t) ? y(t) : n(t));
      }
    },
    is: {
      configurable: true,
      value (c, y, n) {
        return this.ask(t => _.is_(t._) === c, y, n);
      } 
    },
    reduce: {
      configurable: true,
      get () {
        return this.fold;
      }
    },
    fold: {
      configurable: true,
      value (f, ...v) {
        return this.is(
          Array,
          ({_}) => _.reduce((p, c) => f(p, c, ...v)),
          t => t._.reduce((p, [k, w]) => f(p, k, w, ...v))
        );
      }
    },
    map: {
      configurable: true,
      value (f, ...v) {
        return this.is(
          Array,
          ({_}) => _.map((w, k) => f(w, k, ...v)),
          t => t.fold((p, k, w) => p.put({[k]: f(k, w, ...v)}), t.other)
        );
      }
    },
    each: {
      configurable: true,
      value (f, ...v) {
        return this.take(
          t => t.is(
            Array,
            ({_}) => _.forEach(([k, w]) => f(w, k, ...v)),
            t => t.all.flat(a => a.forEach(([k, w]) => f(k, w, ...v)))
          )
        );
      }
    },
    filter: {
      configurable: true,
      value (f, ...v) {
        return this.is(
          Array,
          ({_}) => _.filter((w, k) => f(w, k, ...v)),
          t => t.all.fold(
            (p, k, w) => f(k, w, ...v) ? p.put({[k]: w}) : p,
            t.other
          )
        );
      }
    },
    pick: {
      configurable: true,
      value (...k) {
        return this.filter(h => k.includes(h));
      }
    },
    drop: {
      configurable: true,
      value (...k) {
        return this.filter(h => !k.includes(h));
      }
    },
    swap: {
      configurable: true,
      get () {
        return this.all.fold((p, [k, v]) => p.put({[v]: k}), this.other);
      }
    },
    by: {
      configurable: true,
      get () {
        return this.endo(
          t => t.prototype ? t.prototype : Object.getPrototypeOf(t)
        );
      }
    },
    keys: {
      configurable: true,
      get () {
        return this.endo(Object.keys);
      }
    },
    vals: {
      configurable: true,
      get () {
        return this.endo(Object.values);
      }
    },
    all: {
      configurable: true,
      get () {
        return this.endo(Object.entries);
      }
    },
    put: {
      configurable: true,
      value (f, ...o) {
        return this.endo(Object.assign, ...o);
      }
    },
    struct: {
      configurable: true,
      value (o) {
        return this.endo(Object.create, o);
      }
    },
    make: {
      configurable: true,
      value (...o) {
        return this.lift(t => t.put(t.flat(Object.create), ...o));
      }
    },
    other: {
      configurable: true,
      get () {
        return this.by.endo(Object.create);
      }
    },
    copy: {
      configurable: true,
      get () {
        return this.lift(t => t.other.put(t._))._;
      }
    },
    clone: {
      configurable: true,
      get () {
        return this.lift(
          t => t.all.endo(a => a.reduce((p, [k, v]) => p.put({
            [k]: (
              v instanceof Object
              ? _(v).clone._
              : v
            )
          }), t.other))
        );
      }
    }
  });

  _.to_ = (...f) => (...v) => f.reduceRight((a, m) => m(a))(...v);
  _.id_ = v => v == null ? null : v.valueOf();
  _.is_ = v => v == null ? null : v.constructor;
  _._ = _.pair = function (R, L, K) {
    return Object.create(_.pair.prototype, {
      "@": {
        configurable: true,
        get () {
          return {L, R};
        }
      },
      "#": {
        configurable: true,
        get () {
          return K;
        }
      }
    });
  };
  _._.prototype = Object.create(_.prototype, {
    constructor: {
      configurable: true,
      writable: true,
      value: _.pair
    },
    L: {
      configurable: true,
      get () {
        return this._.L;
      }
    },
    R: {
      configurable: true,
      get () {
        return this._.R;
      }
    },
    K: {
      configurable: true,
      get () {
        return this["#"];
      }
    },
    update: {
      configurable: true,
      value (f = _.id_, ...v) {
        return this.Lift(({L, R}) => _._(f(L(R), ...v), L));
      }
    },
    final: {
      configurable: true,
      value (f = _.id_, ...v) {
        return this.endo(({L, R}) => f(L(R)));
      }
    },
    swap: {
      configurable: true,
      get () {
        return this.bind(({R, L}) => _._(L, R));
      }
    },
    done: {
      configurable: true,
      value (f = _.id_, ...v) {
        return this.lift(
          ({L, R, K}) => (
            K == null
            ? _(f(L(R))).flat(r => _._(r, L, r))
            : _._(K, L, K)
          )
        );
      }
    },
    redo: {
      configurable: true,
      value (f = _.id_, ...v) {
        return this.lift(({L, R}) => _(f(L(R))).flat(r => _.pair(r, L, r)));
      }
    }
  });

  Object.assign(_.is_(this) === Object ? module.exports : this._, _);
})();
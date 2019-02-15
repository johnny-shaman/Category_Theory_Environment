(() => {
  "use strict";

  let _ = function (v, f) {
    return Object.create(_.prototype, {
      "@": {
        configurable: true,
        get () {
          return v;
        }
      },
      "#": {
        configurable: true,
        get () {
          return f;
        }
      }
    });
  };
  Object.defineProperties(_.prototype, {
    _: {
      configurable: true,
      get () {
        return _.id_(this["@"]);
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
        return this.lift(t => _(f(t, ...v), t)["#"]);
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
    fullen: {
      configurable: true,
      value (y, n) {
        return this.ask(
          t => !(t.vals.includes(null) || t.vals.includes(undefined)),
          y,
          n
        );
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
          ({_}) => _.reduce((p, c) => f(p, c, ...v), v.shift()),
          t => t._.reduce((p, [k, w]) => f(p, k, w, ...v), v.shift())
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
    adapt: {
      configurable: true,
      value (...a) {
        return this.map(v => v == null ? a.shift() : v);
      }
    },
    pushL: {
      configurable: true,
      value (...v) {
        return this.take(t => t._.unshift(...v));
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.take(t => t._.push(...v));
      }
    },
    popL: {
      configurable: true,
      get () {
        return this.endo(a => a.shift());
      }
    },
    popR: {
      configurable: true,
      get () {
        return this.endo(a => a.pop());
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
    descript: {
      configurable: true,
      get () {
        return this.endo(Object.getOwnPropertyDescriptors);
      }
    },
    struct: {
      configurable: true,
      value (o) {
        return this.endo(Object.create, o);
      }
    },
    define: {
      configurable: true,
      value (o) {
        return this.endo(Object.defineProperties, o);
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
        return this.lift(t => t.other.define(t.descript._));
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
    },
    get: {
      configurable: true,
      value (...h) {
        return this.lift(t => h.reduce((p, k) => p.endo(o => o[k]), t));
      }
    },
    set: {
      configurable: true,
      value (v, ...h) {
        return this.put(h.reduceRight((p, k) => ({[k]: p}), v));
      }
    },
    delete: {
      configurable: true,
      value (...h) {
        return this.take(t => _(h).each(k => t.flat(o => delete o[k])));
      }
    },
    been: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (t, k) {
            switch (k) {
              case "_": return this._;
              case "to": return this;
              default: return (...v) => t.take(
                t => t.get(k).is(
                  Function,
                  ({_}) => _(...v),
                  t => t.set(v.shift(), v)
                )
              ).been;
            }
          }
        });
      }
    },
    list: {
      configurable: true,
      get () {
        return this.ask(
          t => t._.length == null,
          t => t.copy.put({length: t.keys._.length}).list,
          t => t.endo(Array.from)
        );
      }
    },
    json: {
      configurable: true,
      get () {
        return this.is(
          String,
          t => t.endo(JSON.parse),
          t => t.endo(JSON.stringify)
        );
      }
    },
    done: {
      configurable: true,
      value (...v) {
        return this.ask(
          t => t["#"] == null,
          t => t.bind(f => _(f(...v), f)),
          _.id_
        );
      }
    },
    redo: {
      configurable: true,
      value (...v) {
        return this.ask(
          t => t["#"] == null,
          _.id_,
          t => t["#"](...v)
        );
      }
    },
    part: {
      configurable: true,
      value (...v) {
        return _(v).fullen(
          t => t.endo(f => f(...v)),
          t => t.lift(t => (...vv) => t.part(..._(v).adapt(...vv)._))
        );
      }
    }
  });

  _.to_ = (...f) => (...v) => f.reduceRight((a, m) => m(a))(...v);
  _.id_ = v => v == null ? null : v.valueOf();
  _.is_ = v => v == null ? null : v.constructor;

  _(this).is(
    Object,
    t => t.lift().by.define({
      on: {
        configurable: true,
        value (d) {
          _(d).give(this["@"].on.bind(this["@"]));
          return this;
        }
      },
      once: {
        configurable: true,
        value (d) {
          _(d).give(this["@"].once.bind(this["@"]));
          return this;
        }
      }
    }),
    _.id_
  );

  this.constructor === Object ? module.exports = _ : this._ = _;
})();
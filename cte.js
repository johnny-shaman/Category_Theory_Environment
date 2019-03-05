(() => {
  "use strict";

  let _ = function (v, f) {
    return Object.create(_.prototype, {
      "#": {
        configurable: true,
        get () {
          return v;
        }
      },
      "@": {
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
        return _.id_(this["#"]);
      }
    },
    $: {
      configurable: true,
      get () {
        return _.id_(this["@"]);
      }
    },
    lift: {
      configurable: true,
      value (f = _) {
        return f(this);
      }
    },
    fork: {
      configurable: true,
      get () {
        return _(this._, this._);
      }
    },
    endo: {
      configurable: true,
      value (f = _.id_, ...v) {
        return this._ == null ? this : _(f(this._, ...v), this.$);
      }
    },
    base: {
      configurable: true,
      get () {
        return _(this.$);
      }
    },
    flat: {
      configurable: true,
      value (f = _.id_) {
        return this._ == null ? this : f(this._, this.$);
      }
    },
    use: {
      configurable: true,
      value (f, ...v) {
        return this.fork.endo(f, ...v).base;
      }
    },
    affix: {
      configurable: true,
      value (f) {
        return this.fork.lift(f);
      }
    },
    annex: {
      configurable: true,
      value (f) {
        return this.fork.flat(f);
      }
    },
    is: {
      configurable: true,
      get () {
        return this.endo(t => t.constructor);
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
      value (f, p) {
        return this.lift(
          t => t.is._ === Array
          ? t.endo(t => t.reduce(f, p))
          : t.sets.endo(t => t.reduce((p, [k, w]) => f(p, k, w), p))
        );
      }
    },
    map: {
      configurable: true,
      value (f) {
        return this.lift(
          t => t.is._ === Array
          ? t.endo(t => t.map(f))
          : t.fold((p, k, w) => p.put({[k]: f(k, w)}), t.other)._
        );
      }
    },
    each: {
      configurable: true,
      value (f) {
        return this.lift(
          t => t.is._ === Array
          ? t.use(t => t.forEach(f))
          : t.fork.sets.endo(t => t.forEach(([k, v]) => f(k, v))).base
        );
      }
    },
    filter: {
      configurable: true,
      value (f) {
        return this.lift(
          t => t.is._ === Array
          ? t.endo(t => t.filter(f))
          : t.fold((p, k, v) => f(k, v) ? p.put({[k]: v}) : p, t.other)._
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
        return this.fold((p, k, v) => p.put({[v]: k}), this.other)._;
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
        return this.use(t => t.unshift(...v));
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.use(t => t.push(...v));
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
    toggle: {
      configurable: true,
      value (...d) {
        return this.annex(
          (a, o) => _(a).filter(
            v => !d.includes(v)
          ).pushR(...d.filter(
            v => !o.includes(v)
          ))
        );
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
    sets: {
      configurable: true,
      get () {
        return this.endo(Object.entries);
      }
    },
    put: {
      configurable: true,
      value (...o) {
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
        return this.endo(Object.create, ...o);
      }
    },
    create: {
      configurable: true,
      get () {
        return this.make;
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
          t => t.sets.endo(a => a.reduce((p, [k, v]) => p.put({
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
        return this.use(o => _(h).each(k => delete o[k]));
      }
    },
    been: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (t, k) {
            switch (k) {
              case "_": return t._;
              case "to": return t;
              default: return (...v) => t.lift(
                t => t.get(k).is._ === Function
                ? t.use(o => o[k].apply(o, v))
                : t.set(v.shift(), ...v)
              ).been;
            }
          }
        });
      }
    },
    list: {
      configurable: true,
      get () {
        return this.lift(
          t => t._.length == null
          ? t.put({length: t.keys._.length}).list
          : t.endo(Array.from)
        );
      }
    },
    json: {
      configurable: true,
      get () {
        return this.lift(
          t => t.is._ === String
          ? t.endo(JSON.parse)
          : t.endo(JSON.stringify)
        );
      }
    },
    done: {
      configurable: true,
      value (...v) {
        return this.lift(
          t => t.$ == null
          ? t.fork.endo(f => f(...v))
          : t
        );
      }
    },
    redo: {
      configurable: true,
      value (...v) {
        return this.lift(t => t.base.fork.endo(f => f(...v)));
      }
    },
    part: {
      configurable: true,
      value (...v) {
        return this.lift(
          t => _.fullen_(v)
          ? t.endo(f => f(...v))
          : (...w) => t.lift(t => t.part(..._(v).adapt(...w)._))
        );
      }
    }
  });

  _.id_ = v => v == null ? null : v.valueOf();
  _.is_ = v => v == null ? null : v.constructor;
  _.fullen_ = a => !(
    Object.values(a).includes(undefined) || Object.values(a).includes(null)
  );

  _(this).endo(
    t => _.is_(t) === Object
    ? module.exports = _
    : t._ = _
  );
})();
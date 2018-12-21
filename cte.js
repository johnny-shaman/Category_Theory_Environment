(() => {
  "use strict";
  const _ = function (a = null, b = null) {
    return Object.assign(
      // construct on "this"
      Object.create(
        // Make "this.prototype"
        Object.assign(
          Object.create(
            _[`#${a.constructor.name}`]
            ? _[`#${a.constructor.name}`]
            : (
              a instanceof Array
              ? _["#Array"]
              : _["#Object"]
            )
          ),
          a.constructor.prototype
        ),
        // "this.defineProperties" on undo state
        {
          "#": {
            configurable: true,
            writable: true,
            value: a == null ? null : a.constructor
          },
          "<": {
            configurable: true,
            writable: true,
            value: b
          },
          "*": {
            configurable: true,
            writable: true,
            value: b["*"]
          },
        }
      ),
      // Type Alias to All Object
      new Object(a)
    );
  };
  Object.assign(_.prototype, {
    get by () {
      return this["#"];
    },
    get _ () {
      return this["#"] == null ? null : this.valueOf();
    },
    of (m, ...v) {
      return this.bind(f => m.apply(f, ...v));
    },
    apply (f, ...v) {
      return this["#"] == null ? this : _(f(this.valueOf(), ...v), this);
    },
    bind (f, ...v) {
      return this.apply(f, ...v)._;
    }
  });

  Object.assign(_, {
    T_: Object,
    from_: (v, T) => _.just(v) == null ? v : v instanceof T,
    x_: (...f) => v => f.reduceRight(
      (a, f) => _.just_(a) === null ? a : f(a), v
    ),
    dual_ (l, s) {
      _(Object.create(_.dual_.prototype)).lift({l, s});
    },
    "@been": {
      get (t, k, r) {
        return r[k]
        ? r[k](t)
        : (...v) => t.map(
          o => _.by_(o[k]) === Function
          ? o[k].apply(o, v)
          : t.set(...v)
        )["<"].been;
      },
      each (t) {
        return f => t.each(f).been;
      },
      to (t) {
        return t;
      },
      _ (t) {
        return t._;
      }
    },
    "#dual_": Object.assign(
      Object.create(_.prototype),
      {
        
      }
    ),
    "#Object": Object.assign(
      Object.create(_.prototype),
      {
        get (...k) {
          return k.reduce((a, k) => a.map(v => v[k]), this);
        },
        set (v, ...k) {
          return k
          .reduce(
            (a, k) => (
              a.get(k)._ === null
              ? a.put({[k]: {}}).get(k)
              : a.get(k)
            ),
            this
          )
          .lift({[k.pop()]: v});
        },
        put (...o) {
          return this.apply(Object.assign, ...o);
        },
        get keys () {
          return this.apply(Object.keys);
        },
        get values () {
          return this.apply(Object.values);
        },
        get entries () {
          return this.apply(Object.entries);
        },
        map (f) {
          return this
          .entries
          .reduce((a, [k, v]) => a.put({[k]: f(k, v)}), _({}, this));
        },
        each (f) {
          return this.map(f)["<"];
        },
        detail (d) {
          return this.apply(Object.defineProperties, d);
        },
        lift (...o) {
          return this.apply(Object.assign, Object.create(this._), ...o);
        },
        pick (...k) {
          return this
          .keys
          .filter(v => k.includes(v))
          .foldL((a, k) => a.put({[k]: this.get(k)._}), _({}, this));
        },
        drop (...k) {
          return this
          .keys
          .filter(v => !k.includes(v))
          .foldL((a, k) => a.put({[k]: this.get(k)._}), _({}, this));
        },
        get been () {
          return this.map(o => new Proxy(this, _["@been"]));
        },
        flat (k) {
          return this.put(this[k]);
        },
        get configurable () {
          this
          .entries
          .reduce((a, [k, v]) => a.put({[k]: {
            configurable: true,
            value: v
          }}), _({}, this));
        },
        get writable () {
          this
          .entries
          .reduce((a, [k, v]) => a.put({[k]: {
            configurable: true,
            writable: true,
            value: v
          }}), _({}, this));
        }
      }
    ),
    "#Array": Object.assign(
      Object.create(_["#Object"]),
      {
        each (f) {
          return this.apply(a => a.forEach(f))["<"];
        },
        get foldL () {
          return this.reduce;
        },
        get foldR () {
          return this.reduceRight;
        },
        adapt (...a) {
          return this.map(v => v == null ? a.shift() : v);
        },
        adaptRight (...a) {
          return this.map(v => v == null ? a.pop() : v);
        },
        get adaptL () {
          return this.adapt;
        },
        get adaptR () {
          return this.adaptRight;
        }
      }
    ),
    "#Function": Object.assign(
      Object.create(_["#Object"]),
      {
        get type () {
          return this.get("prototype");
        },
        usual (...o) {
          return this.type.put(...o);
        },
        it (...o) {
          return this.put(...o);
        },
        lift (f) {
          return this
          .map(
            o => _(f)
            .usual(
              _(o)
              .lift(f.type)
              .detail(
                _({constructor: f})
                .writable
                ._
              )
            )
          );
        },
        done (...v) {
          return _.just_(this["*"]) === null
          ? _(this).put({["*"]: this.map(f => f(...v))._})._
          : this;
        },
        redo (...v) {
          return _(this).put({["*"]: null})._.done(...v);
        },
        part (...a) {
          return (a.includes(null) || a.includes(undefined))
          ? (...b) => this.part(...a.map(v => v == null ? b.shift() : v))
          : this.apply(f => f(...a));
        }
      }
    )
  });

  export {_};
})();

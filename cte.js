(() => {
  "use strict";

  let _ = function (v) {
  };

  Object.assign(_, {
    id_: v => v == null ? undefined : v.valueOf(),
    is_: v => v == null ? "null" : v.name ? v.name : _.of_(v).name,
    of_: v => v.constructor,
    by_: v => v.prototype ? v.prototype: _.of_(v).prototype,
    fullen_: a => !(a.includes(undefined) || a.includes(null)),
    fill_: (n, v) => _.put_([], {length: n}).fill(v),
    have_: (v, c) => v instanceof c,
    sets_: Object.entries,
    keys_: Object.keys,
    vals_: Object.values,
    put_:  Object.assign,
    feat_: Object.create,
    struct_: Object.defineProperties,
    pipe_: (...f) => (...v) => _(f).foldR((a, f) => f(a), ...v),
    use_:  (p, ...o) => _.put_(_.feat_(p), ...o),
    Cat: v => _.feat_(
      _.by_(_)[_.is_(v)]
      ? _.by_(_)[_.is_(v)]
      : _.by_(_).Category,
      {
        name: {
          configurable: true,
          value: "Cat"
        },
        "@": {
          configurable: true,
          writable: true,
          value: v
        },
        "<": {
          configurable: true,
          writable: true,
          value: undefined
        },
        cached: {
          configurable: true,
          writable: true,
          value: undefined
        }
      }
    )
  });
  _.put_(_.by_(_), {
    Category: _.feat_(_.feat_(null, {
      endo: {
        configurable: true,
        value (...f) {
          return  _.Cat(_.pipe_(...f)(this.flat));
        }
      },
      map: {
        configurable: true,
        value (...f) {
          return _.Cat(_.pipe_(...f)(this.flat));
        }
      },
      flip: {
        configurable: true,
        value (...f) {
          return this.endo(...f).flat;
        }
      },
      biject: {
        configurable: true,
        value (...f) {
          return this.endo(t => f.map(g => g(t)));
        }
      },
      struct: {
        configurable: true,
        value (o) {
          return this.endo(t => _.struct_(t, o));
        }
      },
      be: {
        configurable: true,
        value (...f) {
          return this.peek.endo(t => _.pipe_(...f)(t) ? t : undefined);
        }
      },
      is: {
        configurable: true,
        value (c) {
          return this.be(o => _.is_(o) === c);
        }
      },
      isnt: {
        configurable: true,
        value (c) {
          return this.be(o => _.is_(o) !== c);
        }
      },
      lift: {
        configurable: true,
        value (n) {
          return _.Cat(_.struct_(this, {
            name: {
              configurable: true,
              value: n
            }
          }));
        }
      },
      unit: {
        configurable: true,
        get () {
          return this.lift("Unit");
        }
      },
      peek: {
        configurable: true,
        get () {
          return this.unit.peek.flat;
        }
      },
      poke: {
        configurable: true,
        get () {
          return this.unit.poke.flat;
        }
      },
      _: {
        configurable: true,
        get () {
          return _.id_(this["@"]);
        }
      }
    }))
  });
  _.put_(_.by_(_), {
    Object: _.feat_(_.by_(_).Category, {
      sets: {
        configurable: true,
        get () {
          return this.endo(_.sets_);
        }
      },
      keys: {
        configurable: true,
        get () {
          return this.endo(_.keys_);
        }
      },
      vals: {
        configurable: true,
        get () {
          return this.endo(_.vals_);
        }
      },
      fold: {
        configurable: true,
        value (...f) {
          return this.sets.endo(
            s => s.reduce(
              _.pipe_(...f),
              _.put_(_.feat_(_.by_(this._)), this._)
            )
          );
        }
      },
      map: {
        configurable: true,
        value (...f) {
          return this.fold(
            (p, [k, v]) => _.put_(p, {[k]: _.pipe_(...f)(k, v)})
          );
        }
      },
      copy: {
        configurable: true,
        get () {
          return this.map((k, v) => _.have_(v, Object) ? _(v).copy._ : v);
        }
      },
      turn: {
        configurable: true,
        get () {
          return this.fold((p, [k, v]) => p.put({[v]: k}));
        }
      },
      filter: {
        configurable: true,
        value (...f) {
          return this.sets.endo(
            s => s.filter(([k, v]) => _.pipe_(...f)(k, v))
          )
          .fold(
            (p, [k, v]) => _.put_(p, {[k]: v}),
          );
        }
      },
      pick: {
        configurable: true,
        value (...h) {
          return this.filter(({k}) => h.includes(k));
        }
      },
      drop: {
        configurable: true,
        value (...h) {
          return this.filter(({k}) => !h.includes(k));
        }
      }
    })
  });
  _.put_(_.by_(_), {
    Array: _.feat_(_.by_(_).Object, {
      map: {
        configurable: true,
        value (...f) {
          return this.endo(a => a.map(_.pipe_(...f)));
        }
      },
      filter: {
        configurable: true,
        value (...f) {
          return this.endo(a => a.filter(_.pipe_(...f)));
        }
      },
      exist: {
        configurable: true,
        values (v) {
          return this.peek.be(a => a.includes(v));
        }
      },
      some: {
        configurable: true,
        values (...f) {
          return this.peek.be(a => a.some(_.pipe_(...f)));
        }
      },
      every: {
        configurable: true,
        values (...f) {
          return this.peek.be(a => a.every(_.pipe_(...f)));
        }
      },
      pushL: {
        configurable: true,
        value (...v) {
          return this.peek.endo(t => t.flat.unshift(...v)).poke;
        }
      },
      pushR: {
        configurable: true,
        value (...v) {
          return this.unit.peek.endo(t => t.flat.push(...v)).poke;
        }
      },
      popL: {
        configurable: true,
        get () {
          return this.peek.endo(t => t.flat.shift());
        }
      },
      popR: {
        configurable: true,
        get () {
          return this.peek.endo(t => t.flat.pop());
        }
      },
      splice: {
        configurable: true,
        value (...v) {
          return this.endo(a => a.splice(...v));
        }
      },
      flat: {
        configurable: true,
        get () {
          return this.endo(a => a.flat());
        }
      },
      foldL: {
        configurable: true,
        value (...f) {
          return this.endo(a => a.reduce(_.pipe_(...f)));
        }
      },
      foldR: {
        configurable: true,
        value (...f) {
          return this.endo(a => a.reduceRight(_.pipe_(...f)));
        }
      },
      adaptL: {
        configurable: true,
        value (...a) {
          return this.endo(b => b.map(v => v == null ? a.shift() : v));
        }
      },
      adaptR: {
        configurable: true,
        value (...a) {
          return this.adaptL(...a.reverse());
        }
      },
      adapt: {
        configurable: true,
        get () {
          return this.adaptL;
        }
      },
      adaptRight: {
        configurable: true,
        get () {
          return this.adaptR;
        }
      }
    }),
    Function: _.feat_(_.by_(_).Object, {
      by: {
        configurable: true,
        get () {
          return this.endo(_.by_);
        }
      },
      part: {
        configurable: true,
        value (...v) {
          return _(v).fullen_
          ? this.to(...v)
          : (...w) => this.part(...v.adaptL(...w));
        }
      },
      done: {
        configurable: true,
        value (...v) {
          return this.cached === undefined
          ? this.unit.put({cached: this.lift(f => f(...v))}).flat.cached
          : this.cached;
        }
      },
      redo: {
        configurable: true,
        value (...v) {
          return this.unit.put({cached: undefined}).flat.done(...v);
        }
      },
      lift: {
        configurable: true,
        value (...v) {
          return this.endo(f => _.Cat(f(...v)));
        }
      },
      flip: {
        configurable: true,
        value (...v) {
          return this.endo(f => f(...v));
        }
      }
    }),
    Unit: _.feat_(_.by_(_).Category, {
      flat: {
        configurable: true,
        get () {
          return _.id_(this.struct({
            name: "Category"
          })["@"]);
        }
      },
      flip: {
        configurable: true,
        value (...f) {
          return this.flat.endo(...f);
        }
      },
      flop: {
        configurable: true,
        value (...f) {
          return this.flat.map(...f).unit;
        }
      },
      unit: {
        configurable: true,
        get () {
          return this;
        }
      },
      peek: {
        configurable: true,
        get () {
          return this.put({"<": this.flat});
        }
      },
      poke: {
        configurable: true,
        get () {
          return this.endo(t => t["<"]);
        }
      },
      lift: {
        configurable: true,
        get () {
          return _.by_(_).Category.call(this, "CoAlgebra");
        }
      },
      _: {
        configurable: true,
        get () {
          return this._._;
        }
      }
    })
  });
  _.put_(_.by_(_), {
    CoAlgebra: _.feat_(_.by_(_).Unit, {
      flop: {
        configurable: true,
        value (...f) {
          return this.flat.map(...f);
        }
      },
      get: {
        configurable: true,
        value (...a) {
          return a.reduce((p, k) => p._ == null ? undefined : _.Cat(p._[k]), this);
        }
      },
      set: {
        configurable: true,
        value (v, ...a) {
          return a.reduce((p, k) => p.put({[k]: v})[k], this);
        }
      },
      put: {
        configurable: true,
        value (...o) {
          return this.endo(t => _.put_(t, ...o));
        }
      },
      delete: {
        configurable: true,
        value (...k) {
          return this.read(_ => k.forEach(k => delete _._[k]));
        }
      },
      _: {
        configurable: true,
        get () {
          return this._._;
        }
      }
    })
  });

  Object.defineProperties(_.prototype, {
    each: {
      configurable: true,
      value (f) {
        return this.read(a => _(a).entries._.forEach(f));
      }
    },
    $: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (_, k, r) {
            return r[k]
            ? r[k](_)
            : (...v) => _.read(
              o => o[k].constructor === Function
              ? o[k].call(o, ...v)
              : _.set(v.shift(), k, ...v)
            ).$;
          },
          _ (_) {
            return _._;
          },
          $ (_) {
            return _;
          }
        });
      }
    },
    define: {
      configurable: true,
      value (o = {}) {
        return this.lift(Object.defineProperties, o);
      }
    },
    from: {
      configurable: true,
      value (o = {}) {
        return this.lift(
          m => Object.create(
            m.constructor.prototype,
            Object.assign(o, {
              constructor: {
                configurable: true,
                writable: true,
                value: _.by_(o) === Object ? m.constructor : o.constructor
              }
            })
          )
        );
      }
    },
    list: {
      configurable: true,
      get () {
        return this.lift(
          o => _(o.length)[""]
          ? _(o).draw({length: _(o).keys._.length}).list._
          : Array.from(o)
        );
      }
    },
    json: {
      configurable: true,
      get () {
        return JSON.stringify(this._);
      }
    }
  });

  _(String).define({
    json: {
      configurable: true,
      get () {
        try {
          return _(JSON.parse(this));
        } catch (e) {
          return _(this);
        }
      }
    }
  });

  _(Number).define({
    _ : {
      configurable: true,
      value (n, s = 1) {
        return [...function* (v) {
          yield v;
          while (v + s <= n) {
            yield v += s;
          }
        }(this.valueOf())];
      }
    }
  });

  _(this).is(Object).$(() => _(_).annex({
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
  }));

  _(this).by._ === Object ? module.exports = _ : this._ = _;
})();

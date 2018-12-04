(() => {
  "use strict";
    const _ = function (c) {
      return Object.create(
        Object.assign(
          _[_.T_(c)] ? _[_.T_(c)] : _.prototype,
          Object.create(c.constructor.prototype)
        ),
        {
          "@": {
            configurable: true,
            writable: true,
            value: c
          }
        }
      );
    };
    Object.assign(_.prototype, {
      get _ () {
        return _.id_(this["@"]);
      },
      map (f) {
        return this.es.reduce((p, [k, v]) => p.draw(f(k, v)), this);
      },
      fmap (f) {
        return this.es.reduce((p, [k, v]) => p.draw(f(k, v)), this)._;
      },
      alpha (f) {
        return _(this._ !== null ? f(this._) : null);
      },
      bind (f) {
        return this.alpha(f)._;
      },
      get ks () {
        return this.alpha(Object.keys);
      },
      get vs () {
        return this.alpha(Object.values);
      },
      get es () {
        return this.alpha(Object.entries);
      },
      draw (...o) {
        return _(Object.assign(this._, ...o));
      },
      be (f) {
        return this.bind(f) ? this : _(null);
      }
    });
    Object.assign(_, {
      id_: (v) => (
        (v === undefined || v === null)
        ? null
        : v.valueOf()
      ),
      O_: (...f) => f.reduceRight((a, f) => f(a)),
      T_: (v) => v.constructor,
    });

})();

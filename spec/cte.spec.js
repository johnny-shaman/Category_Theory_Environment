describe("Test of CTE", function () {
  "use strict";

  const _ = require("../cte.js");

  // static function sector...
  // Identity
  it(
    "Identity Function",
    () => expect(_.id_({a: 5}).a).toBe(5)
  );
  

  // get Constructor
  it(
    "Type Check",
    () =>{
      expect(_.is_(3)).toBe(Number);
      expect(_.is_()).toBe(null);
      expect(_.is_(null)).toBe(null);
    }
  );
  
  // join or extract 
  it(
    "join and extract",
    () => expect(_({a: 5})._).toEqual({a: 5})
  );
  
  
  /*
    lift is applying whole Functor.
    lift is Categoly theory's "Unit".
  */
  it(
    "lift #1",
    () => expect(_({a: 5}).lift()._._).toEqual({a: 5})
  );
  
  it(
    "lift #2",
    () => expect(_({a: 5}).lift(t => t.put({b: 3}))._).toEqual({a: 5, b: 3})
  );
  

  // Left Identity
  it(
    "flat on left identity",
    () => expect(
      _({a: 5}).flat(o => _({a: o.a * 3}))._
    ).toEqual(
      (o => _({a: o.a * 3}))({a: 5})._
    )
  );
  
  // Right Identity
  it(
    "flat on right identity",
    () => expect(
      _({a: 5}).flat(_).flat(_)._
    ).toEqual({a: 5})
  );
  
  // Associativity
  it(
    "flat on associativivy",
    () => expect(
      _({a: 5}).flat(o => _({a: o.a * 3})).flat(o => _({a: o.a + 5}))._
    ).toEqual(
      _({a: 5}).flat(o => _({a: o.a * 3}).flat(o => _({a: o.a + 5})))._
    )
  );

  it(
    "flat on null",
    () => expect(_().flat()._).toBe(null)
  );

  // fold reduce
  it(
    "fold",
    () => {
      expect(_({a: 5, b: 3}).fold((p, k, v) => p + v, 10)._).toBe(18);
      expect(_([5, 3]).fold((p, c) => p + c, 10)._).toBe(18);
    }
  );
  
  it(
    "reduce",
    () => expect(_({a: 5, b: 3}).reduce((p, k, v) => p + v, 10)._).toBe(18)
  );
  
  
  // map
  it(
    "map",
    () => {
      expect(_({a: 5, b: 3}).map((k, v) => v * 8)._).toEqual({a: 40, b: 24});
      expect(_([5, 3]).map(v => v * 8)._).toEqual([40, 24]);
    }
  );
  
  
  // each 
  it(
    "each",
    () => {
      const r = {};
      const s = [];

      expect(
        _({a: 5, b: 3}).each((k, v) => _(r).put({[k]: v + 8}))._
      ).toEqual({a: 5, b: 3});

      expect(r).toEqual({a: 13, b: 11});

      expect(_([5, 3]).each(v => s.push(v + 8))._).toEqual([5, 3]);

      expect(s).toEqual([13, 11]);
    }
  );
  
  
  // filter 
  it(
    "filter",
    () => {
      expect(_({a: 5, b: 3}).filter((k, v) => v === 5)._).toEqual({a: 5});
      expect(_([3,4,5,6,7]).filter(v => v > 4)._).toEqual([5, 6, 7]);
    }
  );
  
  
  // pick 
  it(
    "pick",
    () => {
      expect(_({a: 5, b: 3}).pick("a")._).toEqual({a: 5});
    }
  );
  
  
  // drop 
  it(
    "drop",
    () => expect(_({a: 5, b: 3}).drop("a")._).toEqual({b: 3})
  );
  
  
  // swap 
  it(
    "swap is swap Object's key value",
    () => expect(_({a: 5, b: 3}).swap._).toEqual({"5": "a", "3": "b"})
  );
  
  
  // adapt
  it(
    "adapt",
    expect(
      _([1, null, 3, 4, undefined, null, null, 7]).adapt(5, 8).adapt(2).adapt(9)._
    ).toEqual([1, 5, 3, 4, 8, 2, 9, 7])
  );


  // pushL
  it(
    "pushL",
    () => expect(_([2, 3, 4]).pushL(0, 1, 5)._).toEqual([0, 1, 5, 2, 3, 4])
  );
  
  
  // pushR
  it(
    "pushL",
    () => expect(_([2, 3, 4]).pushR(0, 1, 5)._).toEqual([2, 3, 4, 0, 1, 5])
  );
  
  
  // popL
  it(
    "pushL",
    () => expect(_([2, 3, 4]).popL._).toBe(2)
  );
  
  
  // popR
  it(
    "pushL",
    () => expect(_([2, 3, 4]).popR._).toBe(4)
  );
  
  
  // by 
  it(
    "by: get delegative Object",
    () => {
      expect(_({a: 5}).by._).toBe(Object.prototype)
      expect(_(Array).by._).toBe(Array.prototype)
    }
  );
  
  
  // keys 
  it(
    "keys",
    () => expect(_({a: 5, b: 3}).keys._).toEqual(["a", "b"])
  );
  
  
  // vals 
  it(
    "vals",
    () => expect(_({a: 5, b: 3}).vals._).toEqual([5, 3])
  );
  
  
  // sets
  it(
    "sets",
    () => expect(
      _({a: 5, b: 3}).sets._
    ).toEqual([["a", 5], ["b", 3]])
  );
  
  
  // put
  it(
    "put",
    () => expect(_({a: 5}).put({b: 3})._.b).toBe(3)
  );
  
  
  // descript 
  it(
    "descript",
    () => expect(_({a: 5}).descript._).toEqual({
      a: {
        configurable: true,
        writable: true,
        enumerable: true,
        value: 5
      }
    })
  );
  
  
  // struct 
  it(
    "struct",
    () => {
      expect(
        _({a: 5}).struct({a: {
          configurable: true,
          value: 1
        }})._.a
      ).toBe(1);
  
      expect(
        _({a: 5}).struct({a: {
          configurable: true,
          value: 1
        }}).by._.a
      ).toBe(5);
    }
  );
  
  
  // define 
  it(
    "define",
    () => expect(
      _({a: 5}).define({b: {
        configurable: true,
        writable: true,
        enumerable: true,
        value: 3
      }})._
    ).toEqual({a: 5, b: 3})
  );
  
  
  // make 
  it(
    "make, create",
    () => {
      expect(
        _({add (v) {this.a += v}}).make({a:{writable: true, value: 5}}).fork.endo(t => t.add(3)).base._.a
      ).toBe(8);
  
      expect(
        _({add (v) {this.a += v}}).create({a:{writable: true, value: 5}}).fork.endo(t => t.add(3)).base._.a
      ).toBe(8);
    }
  );
  
  
  // other get other one
  it(
    "other",
    () => expect(
      _([3, 4, 5]).other.use(t => t.push(6, 7, 8))._
    ).toEqual([6, 7, 8])
  ); // []
  
  
  // copy get shallow copy
  it(
    "copy",
    () => {
      let o = {a: {b: 8}};
      expect(_(o).copy._).not.toBe(o);
      expect(_(o).copy._.a).toBe(o.a);
    }
  );
  
  
  // clone get deep copy
  it(
    "copy",
    () => {
      let o = {a: {b: 8}};
      expect(_(o).clone._).not.toBe(o);
      expect(_(o).clone._.a).not.toBe(o.a);
    }
  );
  
  
  // get is lens's zoom 
  it(
    "get is lens.zoom (getter)",
    () => {
      expect(_({a: {b: {c: 5}}}).get("a", "b", "c")._).toBe(5);
      expect(_({a: {b: {c: 5}}}).get("a", "c", "b")._).toBe(null);
    }
  );
  
  
  // set is lens's setter 
  it(
    "set is setter",
    () => expect(_({}).set(5, "a", "b", "c")._).toEqual({a: {b: {c: 5}}})
  );
  
  
  // delete is delete properties and methods
  it(
    "delete",
    () => {
      expect(_({a: 5, b: 3}).delete("a")._).toEqual({b: 3});
      expect(_({a: 5, b: 3}).delete("a", "b")._).toEqual({});
    }
  );
  
  
  // been get's Object.with like to use 
  it(
    "been like with Statement",
    () => {
      let O = class {
        constructor (a) {
          this.a = a;
        }
        add (v) {
          this.a += v;
        }
      };

      expect(_(new O(8)).been.add(3).add(5)._).toEqual({a: 16});
      expect(_(new O(8)).been.add(3).add(5).to.get("a")._).toBe(16);
      expect(
        _({a: {b: 5}}).been.b(6, "c").a(3, "c", "d").a(8, "b")._
      ).toEqual({a: {b: 5}, c: {d: 3}, b: 8});
    }
  );
  
  
  // list get to Array from Array like Object 
  it(
    "list",
    () => expect(_({0: 3, 1: 5}).list._).toEqual([3, 5])
  );
  
  
  // json get JSON 
  it(
    "json",
    () => {
      expect(_({a: 5}).json._).toBe(JSON.stringify({a: 5}));
      expect(_(JSON.stringify({a: 5})).json._).toEqual({a: 5});
    }
  );
  
  
  // done force on wrapped function 
  it(
    "done",
    () => expect(_(v => v + 9).done(5).done(18)._).toBe(14)
  );
  
  
  // redo reforce on wrapped function 
  it(
    "redo",
    () => expect(_(v => v + 9).done(5).redo(18)._).toBe(27)
  );
  
  
  // part is partial applying on wrapped function 
  it(
    "part",
    () => expect(
      _((x, y, z) => x + y + z).part(null, null, 5)(null, 3)(1)._
    ).toBe(9)
  );
});
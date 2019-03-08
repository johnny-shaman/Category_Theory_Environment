# Category Theory Environment
Enpowerment Prototype Object on algebraic and Category Theory

[![Build Status](https://travis-ci.org/johnny-shaman/Category_Theory_Environment.svg?branch=master)](https://travis-ci.org/johnny-shaman/Category_Theory_Environment)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f7dc51710c060313dea4/test_coverage)](https://codeclimate.com/github/johnny-shaman/Category_Theory_Environment/test_coverage)

Usage:
```javascript
// static function sector... ***************************************************

//Identity
_.id_({a: 5}).a === 5

//get constructor function (get type)
_.is_([]) === Array;
_.is_({}) === Object;

//fullen
_.fullen_([1, 2, 3]) === true;
_.fullen_([1, null, 3]) === false;
_.fullen_([1, undefined, 3]) === false;

_.fullen_({a: 5, b: 3}) === true;
_.fullen_({a: 5, b; null}) === false;
_.fullen_({a: null, b: 3}) === false;


// join ************************************************************************
_({a: 5})._.a === 5


/*lift**************************************************************************
  lift is applying whole Functor.
  lift is Categoly theory's "Unit".
*/
_({a: 5}).lift(t => t._).a === 5;
_({a: 5}).lift()._._.a === _({a: 5}).lift(_)._._.a;
_({a: 5}).lift(t => t.put({b: 3}))._.b === 3;

//Can it in Associativity
_({a: 5}).lift(t => t.keys).endo(t => t.reduce((p, c) => p + c))._


/*flat**************************************************************************
  flat can accessor into a value on closure.
  flat is Categoly theory's "CoUnit".
  flat can map likely flatMap
*/
_({a: 5}).lift().flat()._.a === 5;
_({a: 5}).flat(o => o.a) === 5;
_({a: 5}).flat().a === 5;

// flat Have a Kleisli Triple

// Left Identity
_({a: 5}).flat(o => _({a: o.a * 3}))._.a === (o => _({a: o.a * 3}))({a: 5})._.a;

// Right Identity
_({a: 5}).flat(_).bind(_)._.a === 5

// Associativity
_({a: 5}).flat(o => _({a: o.a * 3})).flat(o => _({a: o.a + 5}))._ === 20;
_({a: 5}).flat(o => _({a: o.a * 3}).flat(o => _({a: o.a + 5})))._ === 20;


// endo is a endo functor ******************************************************
_({a: 5}).endo(o => o.a)._ === 5;

// Associativity
_({a: 5}).endo(o => o.a).endo(v => v + 8).endo(v => v * 5)._ === 65;


// fork is Comonad's duplicate**************************************************
_({a: 5}).fork;


// $ is extract ****************************************************************
_({a: 5}).fork.$.a === 5;


// base traverce Comonad to Monad **********************************************
_({a: 5}).fork.endo(o => o.a).base._ //{a: 5};


// use is Comonad's extend *****************************************************
_(Object.create(
  {add (v) {
    this.a + v;
  }},
  {a: {
    value: 5
  }}
)).use(t => o.add(8))._.a === 13


//affix is Comonad's Can Lift It ***********************************************
_(Object.create(
  {add (v) {
    this.a + v;
  }},
  {a: {
    value: 5
  }}
)).affix(t => t.been.add(8).to)._.a === 13


//annex is Comonad's Can Flat It ***********************************************
_(Object.create(
  {add (v) {
    this.a + v;
  }},
  {a: {
    value: 5
  }}
)).annex(o => _(o).been.add(8).to)._.a === 13


// is **************************************************************************

_({a: 5}).is._ === Object;
_([1, 2, 3]).is._ === Array;
_(new Foo()).is._ === Foo;


// fold reduce *****************************************************************
_({a: 5, b: 3}).fold((p, k, v) => p + v)._ === 8;
_({a: 5, b: 3}).reduce((p, k, v) => p + v)._ === 8;


// map *************************************************************************
_({a: 5, b: 3}).map((k, v) => v * 8)._.b === 24;


// each ************************************************************************
_({a: 5, b: 3}).each((k, v) => console.log(`${k}: ${v}`))._.b === 3;


// filter **********************************************************************
_({a: 5, b: 3}).filter((k, v) => v === 5)._.a === 5;
_({a: 5, b: 3}).filter((k, v) => v === 5)._.b === undefined;


// pick ************************************************************************
_({a: 5, b: 3}).pick("a")._.a === 5;
_({a: 5, b: 3}).pick("a")._.b === undefined;


// drop ************************************************************************
_({a: 5, b: 3}).drop("a")._.a === undefined;
_({a: 5, b: 3}).drop("a")._.b === 3;


// swap ************************************************************************
_({a: 5, b: 3}).swap._[5] === "a";
_({a: 5, b: 3}).swap._[3] === "b";


// adapt ***********************************************************************
_([1, null, 3, 4, undefined]).adapt(5, 8)._ // [1, 5, 3, 4, 8]


// pushL ***********************************************************************
_([1, 2, 3]).pushL(5, 6)._; // [5, 6, 1, 2, 3]


// pushR ***********************************************************************
_([1, 2, 3]).pushR(5, 6)._; // [1, 2, 3, 5, 6]


// popL ************************************************************************
_([1, 2, 3]).popL._ === 1;


// popR ************************************************************************
_([1, 2, 3]).popR._ === 3;


// toggle **********************************************************************
_([1, 2, 3]).toggle(2, 4, 5)._ // [1, 3, 4, 5]


// by **************************************************************************
_({a: 5}).by._ === Object.prototype
_(Array).by._ === Array.prototype


// keys ************************************************************************
_({a: 5, b: 3}).keys._[0] === "a";


// vals ************************************************************************
_({a: 5, b: 3}).vals._[1] === 3;


// sets *************************************************************************
_({a: 5, b: 3}).sets._[0][1] === 5; // Object.entries


// put *************************************************************************
_({a: 5}).put({b: 3})._.b === 3;


// descript ********************************************************************
_({a: 5}).descript._ // Object.getOwnProperyDescriptors

/* return it,
{
  a: {
    configurable: true,
    writable: true,
    enumerable: true,
    value: 5
  }
}
*/


// struct **********************************************************************
_({a: 5, b: 3}).struct({a: {
  configurable: true,
  value: 3
}})._.a === 3; // Object.create

_({a: 5, b: 3}).struct({a: {
  configurable: true,
  value: 3
}}).by._.a === 5; // getPrototypeOf


// define **********************************************************************
_({a: 5}).define({b: {
  configurable: true,
  value: 3
}})._.b === 3;


// make create *****************************************************************
_({
  add (v) {
    this.a = a + v
  }
})
.make({
  a: {
    writable: true,
    value: 5
  }
})
.use(t => t._.add(3))
._
.a === 8;

_({
  add (v) {
    this.a = a + v
  }
})
.create({
  a: {
    writable: true,
    value: 5
  }
})
.use(t => t._.add(3))
._
.a === 8;


// other get other one *********************************************************
_([3, 4, 5]).other._; // []


// copy get shallow copy *******************************************************
let o = {a: {b: 8}}
_(o).copy._   !== o;
_(o).copy._.a === o.a;


// clone get deep copy *********************************************************
let p = {a: {b: 8}}
_(p).clone._   !== p;
_(p).clone._.a !== p.a;


// get is lens's zoom **********************************************************
_({a: {b: {c: 5}}).get("a", "b", "c")._ === 5;
_({a: {b: {c: 5}}).get("a", "c", "b")._ === null;


// set is lens's setter ********************************************************
_({}).set(5, "a", "b", "c")._;  // {a: {b: {c: 5}}


// delete is delete properties and methods *************************************
_({a: 5, b: 3}).delete("a")._.a === undefined;
_({a: 5, b: 3}).delete("a")._.b === 3;
_({a: 5, b: 3}).delete("a", "b")._;  // {}


// been get's Object.with like to use ******************************************
_(Object.create(
  {add (v) {
    this.a + v;
  }},
  {a: {
    value: 5
  }}
))
.been
.add(3)
.add(5)
.to
.get("a")
._ === 13

_(Object.create(
  {add (v) {
    this.a + v;
  }},
  {a: {
    value: 5
  }}
))
.been
.add(3)
.add(5)
._
.a === 13

_(Object.create(
  {add (v) {
    this.a + v;
  }},
  {a: {
    value: 5
  }}
))
.been
.b(4, "c", "d")
._
.b
.c
.d === 4


// list get to Array from Array like Object ************************************
_({0: 3, 1: 5}).list._ // [3, 5]


// json get JSON ***************************************************************
_({a: 5}).json._.constructor === String;
_({a: 5}).json.json._.a === 5;


// done force on wrapped function **********************************************
_(v => v + 9).done(5).done(18)._ === 14;


// redo reforce on wrapped function ********************************************
_(v => v + 9).done(5).redo(18)._ === 32;


// part is partial applying on wrapped function ********************************
_((x, y, z) => x + y + z).part(null, null, 5)(null, 3)(1)._ === 9;



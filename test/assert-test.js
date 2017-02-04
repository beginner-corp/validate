var test = require('tape')
var assert = require('../assert')

test('assert exists', t=> {
  t.plan(1)
  t.ok(assert, 'in current scope')
})

test('can assert', t=> {
  t.plan(1)
  assert({}, {})
  t.ok(true, 'did not throw')
})

test('can assert requireds', t=> {
  t.plan(4)
  assert({f:1}, {'f':Number})
  t.ok(true, 'did not throw')
  try {
    assert({y:1}, {'f':Number})
  }
  catch(e) {
    var chars = e.message.split('')
    var last = chars[chars.length - 1]
    t.ok(e, 'got exception')
    t.equal('f', last, 'named missing param')
    t.equal('ReferenceError', e.name, 'got ReferenceError')
    console.log(e)
  }
})

test('can assert nested values', t=> {
  t.plan(1)
  var params = {
    a: {
      'one': 'beachfront'
    }
  }
  assert(params, {
    'a': Object,
    'a.one': String
  })
  t.ok(true, 'no problemo')
})

test('can assert nested values with mistakes', t=> {
  t.plan(1)
  var params = {
    house: [],
    mouse: false
  }
  try {
    assert(params, {
      'house':Array,
      'mouse':Object,
      'mouse.friend':String
    })
  }
  catch(e) {
    t.ok(e, 'got a fail')
    console.log(e)
  }
})

test('can assert Number', t=> {
  t.plan(3)
  try {
    assert({f:'one'}, {'f':Number})
  }
  catch(e) {
    var chars = e.message.split('')
    var last = chars[chars.length - 1]
    t.ok(e, 'got exception')
    t.equal('f', last, 'named invalid param')
    t.equal('TypeError', e.name, 'got TypeError')
    console.log(e)
  }
})

test('can assert String', t=> {
  t.plan(3)
  try {
    assert({f:1}, {'f':String})
  }
  catch(e) {
    var chars = e.message.split('')
    var last = chars[chars.length - 1]
    t.ok(e, 'got exception')
    t.equal('f', last, 'named invalid param')
    t.equal('TypeError', e.name, 'got TypeError')
    console.log(e)
  }
})

test('can assert Boolean', t=> {
  t.plan(3)
  try {
    assert({f:1}, {'f':Boolean})
  }
  catch(e) {
    var chars = e.message.split('')
    var last = chars[chars.length - 1]
    t.ok(e, 'got exception')
    t.equal('f', last, 'named invalid param')
    t.equal('TypeError', e.name, 'got TypeError')
    console.log(e)
  }
})

test('can assert Object', t=> {
  t.plan(3)
  try {
    assert({f:1}, {'f':Object})
  }
  catch(e) {
    var chars = e.message.split('')
    var last = chars[chars.length - 1]
    t.ok(e, 'got exception')
    t.equal('f', last, 'named invalid param')
    t.equal('TypeError', e.name, 'got TypeError')
    console.log(e)
  }
})

test('can assert Array', t=> {
  t.plan(3)
  try {
    assert({f:1}, {'f':Array})
  }
  catch(e) {
    var chars = e.message.split('')
    var last = chars[chars.length - 1]
    t.ok(e, 'got exception')
    t.equal('f', last, 'named invalid param')
    t.equal('TypeError', e.name, 'got TypeError')
    console.log(e)
  }
})

test('can assert Function', t=> {
  t.plan(3)
  try {
    assert({f:1}, {'f':Function})
  }
  catch(e) {
    var chars = e.message.split('')
    var last = chars[chars.length - 1]
    t.ok(e, 'got exception')
    t.equal('f', last, 'named invalid param')
    t.equal('TypeError', e.name, 'got TypeError')
    console.log(e)
  }
})

test('can assert a custom', t=> {
  
  t.plan(2)

  // create a cheesy custom type
  function Kitchen(v) {
    Kitchen.toString = x=> 'Kitchen'
    if (v === 'mkay') return true
    return Error('not a kitchen')
  }

  // assert it!
  var params = {kitchen:'mkay'}
  assert(params, {
    'kitchen':Kitchen
  })

  t.ok(true, 'did not fail')

  try {
    assert({kitchen:'non'}, {
      kitchen:Kitchen
    })
  }
  catch(e) {
    t.ok(e, 'failed correctly')
    console.log(e)
  }
})

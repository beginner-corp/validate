var test = require('tape')
var customs = require('../examples/customs')

test('basics', t=> {
  t.plan(1)
  customs({}, (err, results)=> {
    t.ok(err, 'got errors for empty params')
    console.log(err)
  })
})

test('got error for wrong types', t=> {
  t.plan(1)
  customs({created:'tues', email:'brian.io'}, (err, results)=> {
    t.equal(err.length, 2, 'got errors for empty params')
    console.log(err)
  })
})


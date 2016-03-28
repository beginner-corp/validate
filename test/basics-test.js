var test = require('tape')
var basics = require('../examples/basics')

test('basics', t=> {
  t.plan(1)
  basics({}, (err, results)=> {
    t.ok(err, 'got errors for empty params')
    console.log(err)
  })
})

test('got error for wrong types', t=> {
  t.plan(1)
  basics({meta:1, key:1, count:'1', results:{}, ok:[]}, (err, results)=> {
    t.ok(err, 'got errors for empty params')
    console.log(err)
  })
})

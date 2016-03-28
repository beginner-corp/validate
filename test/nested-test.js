var test = require('tape')
var nested = require('../examples/nested')

test('nested', t=> {
  t.plan(1)
  nested({}, (err, results)=> {
    t.ok(err, 'got errors for empty params')
    console.log(err)
  })
})

test('got a good name there buddy', t=> {
  t.plan(1)
  nested({name:{first:'brian'}}, (err, results)=> {
    t.ok(results, 'got the name')
    console.log(results)
  })
})

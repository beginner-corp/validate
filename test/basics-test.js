var test = require('tape')
var validate = require('../')
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

test('max str', t=> {
  t.plan(1)
  var schema = {
    maximal: {required:true, type:String, max:255}
  }
  var errors = validate({maximal:'lil'}, schema)
  if (errors) {
    t.fail(errors)
    console.log(errors)
  }
  else {
    t.ok(true, 'no errors')
  }
})

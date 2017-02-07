var validate = require('../')
var test = require('tape')

test('sane', t=> {
  t.plan(1)
  t.ok(validate, 'validate exists')
})

test('optional callback win', t=> {
  t.plan(1)
  var schema = {
    'name': {required:true, type:String}
  }
  validate({name:'brian'}, schema, (err, data)=> {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(data, 'there was a name')
    }
    console.log(err, data)
  })
})

test('optional callback fail', t=> {
  t.plan(1)
  var schema = {
    'name': {required:true, type:String}
  }
  validate({}, schema, (err, data)=> {
    if (err) {
      t.ok(err, 'caught missing name')
    }
    else {
      t.fail(data)
    }
    console.log(err, data)
  })
})

test('Function type check', t=> {
  t.plan(1)
  var schema = {
    'callback': {type:Function}
  }
  var errors = validate({callback:'foo'}, schema)
  t.equal(errors.length, 1, 'nope not a fn')
  console.log(errors)
})

test('No type check', t=> {
  t.plan(1)
  var schema = {
    'any': {required:true}
  }
  validate({any:'thing'}, schema, (err, data)=> {
    if (err) {
      t.fail(err)
    }
    else {
      t.ok(data, 'there was a name')
    }
    console.log(err, data)
  })
})

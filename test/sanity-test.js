var validate = require('../')
var test = require('tape')

test('sane', t=> {
  t.plan(1)
  t.ok(validate, 'validate exists')
})


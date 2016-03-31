var test = require('tape')
var ranges = require('../examples/ranges')

test('basics', t=> {
  t.plan(1)
  ranges({}, (err, results)=> {
    t.ok(err, 'got errors for empty params')
    console.log(err)
  })
})

test('DateRange', t=> {
  t.plan(1)
  ranges({easter:'2016/03/25-2016/03/28'}, (err, results)=> {
    t.equal(err, null, 'a valid range')
    console.log(results)
  })
})

test('custom easter must be 2016', t=> {
  t.plan(1)
  ranges({easter:'2015/03/25-2015/03/28'}, (err, results)=> {
    t.equal(err.length, 1, 'only 2016 easter!')
    console.log(err)
  })
})

test('custom easter must be 2016', t=> {
  t.plan(1)
  ranges({easter:'2016/03/25-2017/03/28'}, (err, results)=> {
    t.equal(err.length, 1, 'only 2016 easter!')
    console.log(err)
  })
})

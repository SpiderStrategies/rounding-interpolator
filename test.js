var test = require('tape')
  , r = require('./')

test('d3 rounding basic', function (t) {
  t.equal(r('300px', '500px')(.5), '400px')
  t.equal(r('300px', '500px')(1), '500px')
  t.equal(r('my favorite font 300px', 'my favorite font 500px')(.5), 'my favorite font 400px')

  t.equal(r('300.1px', '500.1px')(1), '500.1px')
  t.equal(r(1.15, 10.15)(1), '10.15')
  t.end()
})

test('allows +/- prefix', function (t) {
  t.equal(r('heyo +3%', 'heyo +5%')(.5), 'heyo +4%')
  t.equal(r('+3%', '+5%')(.1), '+3%')
  t.equal(r('+3%', '+5%')(.5), '+4%')
  t.equal(r('+3%', '+5%')(1), '+5%')
  t.equal(r(' + 3%', ' + 5%')(.5), ' + 4%')
  t.equal(r(' + 3%', ' + 5%')(1), ' + 5%')
  t.equal(r(' +3%', ' +5%')(1), ' +5%')
  t.end()
})

test('rounds numbers w/o a decimal', function (t) {
  for (var i = 100; i >= 1; i--) {
    t.ok(r(300, 500)(1 / i).split('.').length == 1)
  }
  t.end()
})

test('rounds strings with numbers without showing a decimal', function (t) {
  for (var i = 100; i >= 1; i--) {
    t.ok(r('300px', '500px')(1 / i).split('.').length == 1)
  }
  t.end()
})

test('rounds strings with numbers, matching the number of decimals in the end value', function (t) {
  for (var i = 100; i >= 1; i--) {
    var _r = r('I have 1.25 apples', 'I have 15.75 apples')(1 / i)
    t.ok(_r.split('.').length == 2)
    t.equal((_r.split('.')[1]).length, 9) // 2 decimals plus a space and 'apples'
  }
  t.end()
})

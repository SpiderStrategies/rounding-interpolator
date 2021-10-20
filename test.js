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

test('interpolates currency', function (t) {
  t.equal(r('$20', '$35')(0), '$20')
  t.equal(r('$20', '$35')(1), '$35')
  t.equal(r('$20', '$35.00')(0), '$20')
  t.equal(r('$20', '$35.00')(1), '$35')

  t.end()
})

test('interpolates with commas', function (t) {
  t.equal(r('4,418', '4,080')(1), '4,080')

  t.equal(r('4,418', '800')(1), '800')
  t.equal(r('4,418', '800,000')(1), '800,000')
  t.equal(r('4,418', '800,300')(1), '800,300')
  t.equal(r('4,418', '800,003')(1), '800,003')
  t.equal(r('4,418', '3')(1), '3')
  t.equal(r('4,418', '$300,000,030.45')(1), '$300,000,030.45')
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

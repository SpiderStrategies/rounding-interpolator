var d3 = require('d3')
  , d3_interpolate_number = /(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g

/*
 * This is similiar to d3's interpolateString, but adds some special magic.
 * We want to format the number as it's transitioning to match the format of the number.
 * Meaning, if the number is an integer, we don't want to show a bunch of decimals as we're
 * transitioning. The best way to understand this code is to look at the tests for it.
 */
module.exports = function (a, b) {
  var m, i, j, s0 = 0, s1 = 0, s = [], q = [], n, o
  a = a + '', b = b + ''
  d3_interpolate_number.lastIndex = 0
  for (i = 0; m = d3_interpolate_number.exec(b); ++i) {
    if (m.index) s.push(b.substring(s0, s1 = m.index))
    q.push({
      i: s.length,
      x: m[0]
    })
    s.push(null)
    s0 = d3_interpolate_number.lastIndex
  }
  if (s0 < b.length) s.push(b.substring(s0))
  for (i = 0, n = q.length; (m = d3_interpolate_number.exec(a)) && i < n; ++i) {
    o = q[i]
    if (o.x == m[0]) {
      if (o.i) {
        if (s[o.i + 1] == null) {
          s[o.i - 1] += o.x
          s.splice(o.i, 1)
          for (j = i + 1; j < n; ++j) q[j].i--;
        } else {
          s[o.i - 1] += o.x + s[o.i + 1]
          s.splice(o.i, 2)
          for (j = i + 1; j < n; ++j) q[j].i -= 2;
        }
      } else {
        if (s[o.i + 1] == null) {
          s[o.i] = o.x
        } else {
          s[o.i] = o.x + s[o.i + 1]
          s.splice(o.i + 1, 1)
          for (j = i + 1; j < n; ++j) q[j].i--
        }
      }
      q.splice(i, 1)
      n--
      i--
    } else {
      // let's store how many decimals we'll use when we display the value as we transition
      var end = parseFloat(o.x)
        , decimals = Math.floor(end) === end ? 0 : (end.toString().split('.')[1].length || 0)
      o.format = d3.format('.' + decimals + 'f')
      o.x = d3.interpolateNumber(parseFloat(m[0]), end)
    }
  }
  while (i < n) {
    o = q.pop()
    if (s[o.i + 1] == null) {
      s[o.i] = o.x
    } else {
      s[o.i] = o.x + s[o.i + 1]
      s.splice(o.i + 1, 1)
    }
    n--
  }
  if (s.length === 1) {
    return s[0] == null ? (o = q[0].x, function(t) {
      return q[0].format(o(t) + '')
    }) : function() {
      return b
    }
  }
  return function(t) {
    for (i = 0; i < n; ++i) {
      s[(o = q[i]).i] = q[i].format(o.x(t))
    }
    return s.join('')
  }
}

var _ = require('underscore')


module.exports = {
  hexstring_to_intarray: function(txt) {
    var arr=[]
    for (var i=0; i<txt.length; i=i+2) {
      arr.push(parseInt(txt.substring(i,i+2),16))
    }
    return arr
  },

  array_xor: function(a,b) {
    var maxl=a.length > b.length ? b.length : a.length
    var result=[]
    for (var i=0; i<maxl; i++) {
      result.push(a[i] ^ b[i])
    }
    return result
  },

  array_to_string(arr) {
    var rarr = arr.map((x) =>
                       { return (x < 32) ? "." : String.fromCharCode(x) })
    return rarr.join('')
  }
  
}


var hl=require('./lib/hexlib.js')
var ciphers=require('./lib/data.js')

var cparsed = ciphers.ciphers.map((str) =>
                                  { return hl.hexstring_to_intarray(str)})

var xx = hl.array_xor(cparsed[0],cparsed[1])
var xp = hl.array_to_string(xx)
console.log(xp)

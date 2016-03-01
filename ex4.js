var hl=require('./lib/hexlib')

var a=['e86d2de2','5f67abaf','7c2822eb','7b50baab']
var b=['1792d21d','bbe033c0','325032a9','325032a9']

for (var i=0;i<a.length;i++) {
  console.log(hl.intarray_to_hexstring(hl.array_xor(hl.hexstring_to_intarray(a[i]),hl.hexstring_to_intarray(b[i]))))
}

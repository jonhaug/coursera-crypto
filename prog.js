var hl=require('./lib/hexlib.js')
var aes=require('aes-js')

var hexkey='140b41b22a29beb4061bda66b6747e14'
//var hexkey='140b41b22a29beb4061bda66b6747e14'
var key=hl.hexstring_to_intarray(hexkey)

//var ciph='4ca00ff4c898d61e1edbf1800618fb2828a226d160dad07883d04e008a7897ee2e4b7465d5290d0c0e6c6822236e1daafb94ffe0c5da05d9476be028ad7c1d81'
var ciph='5b68629feb8606f9a6667670b75b38a5b4832d0f26e1ab7da33249de7d4afc48e713ac646ace36e872ad5fb8a512428a6e21364b0c374df45503473c5242a253'

var ciphBlocks=[]
for (var i=0;i<ciph.length;i+=32) {
  ciphBlocks.push(ciph.substring(i,i+32))
}


var myaes = new aes.AES(key)
var intciph = ciphBlocks.map(hl.hexstring_to_intarray)

var result = intciph.map((x,i,arr) => {
  if (i>0) {
    return new Buffer(hl.array_xor(myaes.decrypt(x), arr[i-1]))
  }
})
var resultString=''
for (var i=1;i<result.length-1;i++) {
  resultString += result[i].toString()
}
var last=result[result.length-1]
var j=last.length-1
var lastCh=last[j]
while (last[j] == lastCh && j>=0) { j-- }
if (j>=0) {
  resultString += last.slice(0,j+1).toString()
}

console.log(j)
console.log(result)
console.log(resultString)

//console.log(result.join(''))

//Basic CBC mode encryption needs padding.

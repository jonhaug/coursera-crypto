var hl=require('./lib/hexlib.js')
var aes=require('aes-js')

var hexkey='36f18357be4dbd77f050515c73fcf9f2'
var key=hl.hexstring_to_intarray(hexkey)

var ciph='69dda8455c7dd4254bf353b773304eec0ec7702330098ce7f7520d1cbbb20fc388d1b0adb5054dbd7370849dbf0b88d393f252e764f1f5f7ad97ef79d59ce29f5f51eeca32eabedd9afa9329'
//var ciph='770b80259ec33beb2561358a9f2dc617e46218c0a53cbeca695ae45faa8952aa0e311bde9d4e01726d3184c34451'

var ciphBlocks=[]
for (var i=0;i<ciph.length;i+=32) {
  ciphBlocks.push(ciph.substring(i,i+32))
}


var myaes = new aes.AES(key)
var intciph = ciphBlocks.map(hl.hexstring_to_intarray)
console.log(intciph)
var iv=intciph[0]
var result=[]
for (var i=1;i<intciph.length;i++) {
  var xx=myaes.encrypt(iv)
  result.push(new Buffer(hl.array_xor(xx,intciph[i])))
  iv[15]++
}
var resultString=''
for (var i=0;i<result.length;i++) {
  resultString += result[i].toString()
}

console.log(result)
console.log(resultString)

//console.log(result.join(''))

// Basic CBC mode encryption needs padding.
// Our implementation uses rand. IV
// CTR mode lets you build a stream cipher from a block cipher.
// Always avoid the two time pad!

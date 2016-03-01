var hl=require('./lib/hexlib.js')
var ciphers=require('./lib/data.js')

var cparsed = ciphers.ciphers.map((str) =>
                                  { return hl.hexstring_to_intarray(str)})


function compare_print(i,j) {
  var xx = hl.array_xor(cparsed[i],cparsed[j])
  var xp = hl.array_to_string(xx)
  console.log(xp)
}

// Where there are capital letters below, high probability that the ciphers[0] contains a space.
for (var i=1; i<cparsed.length; i++) {
  compare_print(0,i)
}

//var probably_char_set='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
var probably_char_set='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,- ?!:'
//var probably_char_set='abcdefghijklmnopqrstuvwxyz'
var checkArray=new Array(256)
for (var i=0; i<probably_char_set.length;i++) {
  x=probably_char_set.charCodeAt(i)
  checkArray[x]=true
}

function is_printable(ch) {
  return ch >=32 && ch <127
}

// Print printable, but not probable characters:
var s=''
for (var i=0;i<256;i++) {
  if (is_printable(i) && ! checkArray[i]) s+=String.fromCharCode(i)
}
console.log('<' + s + '>')


// Guess if cipher at index position is a char.
// Returns 0 (if any cipher contains a non printable character, 1 if printable, 2 if in probably set
function guess_index_position(ciph_ix, index, ch) {
  var ciph=cparsed[ciph_ix]
  var code=ciph[index] ^ ch
  var return_value=1
  for (var i=0;i<cparsed.length;i++) {
    if (i != ciph_ix && index < cparsed[i].length) {
      var current_guess = cparsed[i][index] ^ code
      if (! is_printable(current_guess)) return 0
      if (checkArray[current_guess]) return_value++
    }
  }
  return return_value
}

// Assumes printable character at position for all ciphers, count probably characters, return
// an object with the most probably ones.
function guess_otp_at(ix) {
  var return_object={}
  var checkCode=[]
  for (var code=0;code<256;code++) {
    var counter=1
    for (var i=0;i<cparsed.length;i++) {
      if (ix < cparsed[i].length) {
        var ch=cparsed[i][ix] ^ code
        if (! is_printable(ch)) {
          counter=0
          break
        }
        //counter++
        if (checkArray[ch]) counter++
      }
    }
    checkCode[code]=counter
  }
  var mx=Math.max.apply(Math,checkCode)
  checkCode.forEach((v,i) => { if (mx == v) return_object[i]=v })
  return return_object
}

var obj={}
for (var i=0;i<probably_char_set.length;i++) {
  var ch=probably_char_set.charCodeAt(i)
  var r = guess_index_position(1,0,ch)
  if (r > 0) {
    var name=String.fromCharCode(ch)
    obj[name]=r
  }
}
//console.log(JSON.stringify(obj, null, 2))

// var c=1
// var ros=[]
// for (var ix=0;ix<10;ix++) {
//   var ro=guess_otp_at(ix)
//   ros.push(ro)
//   console.log(JSON.stringify(ro))
//   c *= Object.keys(ro).length
// }


// console.log('ros:' + ros.length + ' tsize:' + c)

// var count=0
// function rec_gen(ix, current) {
//   if (ix < ros.length) {
//     var ro=ros[ix]
//     for (var p in ro) {
//       var ch = is_printable(p) ? String.fromCharCode(p) : '.'
//       rec_gen(ix+1,current+ch)
//     }
//   } else {
//     count++
// //    console.log(current)
//   }
// }

//rec_gen(0, '')
//console.log(count)

// TODO: For all index positions, find a cipher that might contain a space, guess so, and see if the OTP
// can be used to decrypt all ciphers to produce a meaningful character.
// Meaningful characters: Letter, numbers and a handful of symbols: .,-?!

// First position is always a letter, perhaps a capital letter.
// The last is perhaps one of .?!

function is_capital(ch) {
  return ch>='A'.charCodeAt(0) && ch <= 'Z'.charCodeAt(0)
}
function checkSpace(cp_i, ix) {
  var return_object={}
  var checkCode=[]
  var counter=0
  var code_i = cparsed[cp_i][ix]
  for (var i=0;i<cparsed.length-1;i++) {
    if (ix < cparsed[i].length) {
        var ch=cparsed[i][ix] ^ code_i
        if (! is_capital(ch)) {
          counter++
        }
      }
    }
  return counter
}


function guessCodeAt(ix) {
  var currentHigh=0
  var currentGuess=-1
  for (var i=0;i<cparsed.length;i++) {
    var guess=checkSpace(i,ix)
    if (guess > currentHigh && guess > 4) {
      currentHigh=guess; currentGuess=i
    }
  }
//  console.log('ix=' + ix + ' i=' + currentGuess + ' currentHigh=' + currentHigh)
  return currentGuess >= 0 ? cparsed[currentGuess][ix] ^ ' '.charCodeAt(0) : 0
}

var result=[]
for (var j=0;j<cparsed[0].length;j++) {
  result.push(guessCodeAt(j))
}
console.log(hl.intarray_to_hexstring(result.slice(0,20)))
console.log(hl.intarray_to_hexstring(cparsed[0].slice(0,20)))
console.log(hl.intarray_to_hexstring(cparsed[1].slice(0,20)))

function decrypt(arr, otp) {
  var r=[]
  for (var j=0;j<arr.length;j++) {
    if (j>=otp.length) break
    r.push( arr[j] ^ otp[j])
  }
  return r
}

for (var j=0;j<cparsed.length;j++) {
  console.log(hl.array_to_string(decrypt(cparsed[j], result)))
}

console.log(result[2], cparsed[0][2], cparsed[1][2])



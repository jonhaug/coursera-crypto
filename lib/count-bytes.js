var fs=require('fs')
var path=require('path')

var file='english.txt'

var txt = fs.readFileSync(path.join('resources',file))
console.log(txt.length)

var freqCount=[]

// charCodeAt
for (var i=0;i<txt.length;i++) {
  var cc=txt[i]
  freqCount[cc] = freqCount[cc] ? freqCount[cc]+1 : 1
}


var sum=0, count=0
var freqTable=[]
freqCount.forEach((v,i) => {
  sum+=v; count++
  freqTable.push({n:v, val:i})
})
console.log('Size=' + sum + ", count=" + count)

freqTable.sort((a,b)=>{ return a['n'] -b['n'] })

freqTable.forEach((obj)=>{var val=obj['val'];console.log(val, String.fromCharCode(val), obj['n'])})


import fs from 'node:fs'

fs.createReadStream('text.txt', {
  encoding: 'utf-8'
}).on('data', data => { console.log(data) })

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

if (process.platform !== 'linux') {
  console.log('The system is not supported')
  process.exit(1)
}

if (process.argv.length < 3) {
  console.log('Enter the file name')
  process.exit(1)
}

const pathFile = process.argv[2]
const parsedPath = path.parse(pathFile)
const sortedFilePath = path.join(process.cwd(), parsedPath.name + '-sorted' + parsedPath.ext)

const cp = spawn('sort', ['-d', pathFile])
const writeStream = fs.createWriteStream(sortedFilePath)

cp.stdout.on('data', data => {
  writeStream.write(data)
})

cp.stderr.on('data', data => {
  console.log(String(data))
})

cp.on('error', err => {
  console.log(err)
})

cp.on('close', code => {
  writeStream.end()
})

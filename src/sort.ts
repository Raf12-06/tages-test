import { statSync, createReadStream } from 'node:fs'

const stat = statSync('text.txt')
if (!stat.isFile()) {
  process.exit(1)
}

const FILE_SIZE = stat.size
const PART_BYTE = 1_000_000 //"524_288_000"
let NUM_PART = Math.ceil(Number(FILE_SIZE) / PART_BYTE)
let OFFSET_BYTE = 0

async function processFile() {
  while (NUM_PART) {
    await new Promise((res, rej) => {
      const readStream = createReadStream('text.txt', {
        encoding: 'utf-8',
        start: OFFSET_BYTE,
        end: OFFSET_BYTE + PART_BYTE,
      })

      readStream.on('data', data => {

      })

      readStream.on('close', () => {
        NUM_PART--
        OFFSET_BYTE += PART_BYTE
      })

      readStream.on('error', err => {
        console.log(err);
      })
    })
  }
}


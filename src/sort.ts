import { statSync, createReadStream, createWriteStream } from 'node:fs'

const stat = statSync('text.txt')
if (!stat.isFile()) {
  process.exit(1)
}

const PART_BYTE = 524_288_000

const listFile = ['text.txt', 'text2.txt']

let wasChange = false
async function processFile() {

  for (let i = 0; i < 10000; i++) {
    await new Promise((res, rej) => {
      const writeStream = createWriteStream(listFile[1])
      const readStream = createReadStream(listFile[0], {
        encoding: 'utf-8',
        highWaterMark: PART_BYTE
      })

      readStream.on('data', (chunk: string) => {
        const rowPart = normalizeChunk(chunk).split('\n')
        const rows = compareRows(rowPart);
        writeStream.write(rows);
      })

      readStream.on('close', () => {
        writeStream.close()
        res(null)
      })

      readStream.on('error', err => {
        writeStream.close()
        rej(err);
      })
    })

    listFile.reverse();
  }
}

let lostRow = ''
function normalizeChunk(chunk: string) {
  if (lostRow) chunk = lostRow + chunk

  const lastIndex = chunk.length - 1
  const lastSymbol = chunk[lastIndex]
  if (lastSymbol !== '\n') {
    let endIndex = 0
    for (let i = lastIndex; i >= 0; i--) {
      const symbol = chunk[i]
      if (symbol !== '\n') {
        endIndex = i
      } else break
    }

    lostRow = chunk.substring(endIndex)
    return chunk.substring(0, endIndex)
  } else {
    return chunk;
  }
}

let lastStr = '';
function compareRows(rows: string[]): string {
  let resultStr = '';
  for (let i = 0; i < rows.length; i++) {
    const str = rows[i]
    if (str) {
      if (!lastStr) lastStr = str
      else {
        if (str > lastStr) {
          wasChange = true
          resultStr += lastStr + '\n'
          lastStr = str
        } else {
          resultStr += str + '\n'
        }
      }
    }
  }
  return resultStr;
}

processFile().catch(e => console.log(e));

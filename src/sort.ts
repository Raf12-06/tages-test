import { statSync, createReadStream, appendFileSync, writeFileSync } from 'node:fs'

const stat = statSync('text.txt')
if (!stat.isFile()) {
  process.exit(1)
}

const PART_BYTE = 524_288_000

const listFile = ['text.txt', 'text2.txt'];

let cntRow = 0;
async function processFile() {

   do {
    await new Promise((res, rej) => {
      const readStream = createReadStream(listFile[0], {
        encoding: 'utf-8',
        highWaterMark: PART_BYTE
      })

      readStream.on('data', (chunk: string) => {
        const rowPart = normalizeChunk(chunk).split('\n')
        if (!cntRow) cntRow += rowPart.filter(v => v).length;
        const rows = compareRows(rowPart);
        appendFileSync(listFile[1], rows);
      })

      readStream.on('close', () => {
        if (lastStr) {
          appendFileSync(listFile[1], lastStr + '\n')
          lastStr = 0
        }
        writeFileSync(listFile[0],'')
        listFile.reverse();
        res(null)
      })

      readStream.on('error', err => {
        rej(err);
      })
    })
    cntRow--
  } while (cntRow > 0)
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

let lastStr = 0;
function compareRows(rows: string[]): string {
  let resultStr = '';
  for (let i = 0; i < rows.length; i++) {
    const str = Number(rows[i])
    if (str) {
      if (!lastStr) lastStr = str
      else {
        if (str > lastStr) {
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

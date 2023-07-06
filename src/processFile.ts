import {createReadStream} from 'node:fs';

const FILE_SIZE = Number(process.env.FILE_SIZE)
const PART_BYTE = Number(process.env.PART_BYTE)
let NUM_PART = Math.ceil(Number(FILE_SIZE) / PART_BYTE)
let OFFSET_BYTE = 0

processFile()

async function processFile() {
    for (let i = 0; i < NUM_PART; i++, NUM_PART--, OFFSET_BYTE += PART_BYTE) {
        await new Promise((resolve, reject) => {
            const readStream = createReadStream('text.txt', {
                encoding: 'utf-8',
                start: OFFSET_BYTE,
                end: OFFSET_BYTE + PART_BYTE
            })

            readStream.on('data', data => {

            })

            readStream.on('close', () => {
                if (i === 0) process.send?.('PART_DONE')
                resolve(null)
            })

            readStream.on('error', err => {
                reject(err)
            })
        })
    }
}


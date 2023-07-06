import { statSync } from 'node:fs'
import os from 'node:os'
import { fork } from 'child_process'

const stat = statSync('text.txt')
if (!stat.isFile()) {
  process.exit(1)
}

process.env.PART_BYTE = String(1_000_000) //"524_288_000"
process.env.FILE_SIZE = String(stat.size)

let cntCpu = os.cpus().length

startCp();

function startCp() {
  if (cntCpu) {
    const cp = fork('build/processFile.js',{
      env: process.env
    })

    cp.on('message', message => {
      if (message === 'PART_DONE') {
        cntCpu--
        startCp();
      }
    })
  }
}

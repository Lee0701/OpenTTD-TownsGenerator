
const fs = require('fs')
const readline = require('readline')

async function main(args) {
    if(args.length < 2) {
        console.log(`Usage: ${process.argv[1]} ${process.argv[2]} outFile inFiles...`)
        convert.exit(1)
    }
    const outFile = args[0]
    const inFiles = args.slice(1)

    const set = new Set()
    const out = fs.createWriteStream(outFile, 'utf8')

    let lines = 0
    await Promise.all(inFiles.map((inFile) => new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: fs.createReadStream(inFile, 'utf8'),
        })
        rl.on('line', (line) => {
            const qid = line.split('\t')[0]
            if(set.has(qid)) return
            set.add(qid)
            out.write(line + '\n')
            lines++
            if(lines % 10000 === 0) console.log(lines)
        })
        rl.on('close', () => {
            resolve()
        })
        rl.on('error', (err) => {
            reject(err)
        })
    })))
}

if(require.main === module) main(process.argv.slice(2))


const fs = require('fs')
const readline = require('readline')

const loadDict = (path) => Object.fromEntries(fs.readFileSync(path, 'utf8').split('\n').map((line) => line.split('\t')))
const reverseDict = (dict) => Object.fromEntries(Object.entries(dict).map(([k, v]) => [v, k]))

async function main(args) {
    if(args.length < 4) {
        console.log(`Usage: ${process.argv[1]} ${process.argv[2]} csvFile inDictFile outDictFile outFile`)
        process.exit(1)
    }
    const [csvFile, inDictFile, outDictFile, outFile] = args

    console.log(`Load input dictionary...`)
    const inDict = reverseDict(loadDict(inDictFile))
    console.log(`Load output dictionary...`)
    const outDict = loadDict(outDictFile)

    const rl = readline.createInterface({
        input: fs.createReadStream(csvFile, 'utf8'),
    })
    const out = fs.createWriteStream(outFile, 'utf8')

    let header
    let lines = 0
    rl.on('line', (line) => {
        if(!header) {
            out.write(line + '\n')
            header = line
            return
        }

        const entries = line.split(',')

        if(entries[0].includes(' / ')) {
            const name = entries[0].split(' / ')[0]
            const rest = entries.slice(1)
            out.write([name, ...rest].join(',') + '\n')
            return
        }

        const name = entries[0].split(' / ').pop()
        const rest = entries.slice(1)

        const qCode = inDict[name]
        if(!qCode) {
            console.warn(`Input entry not found: ${name}`)
            out.write([name, ...rest].join(',') + '\n')
            return
        }
        const result = outDict[qCode]
        if(!result) {
            console.warn(`Output entry not found: ${qCode}`)
            out.write([name, ...rest].join(',') + '\n')
            return
        }

        out.write([result, ...rest].join(',') + '\n')

        lines++
        if(lines % 10000 === 0) console.log(lines)
    })
}

if(require.main === module) main(process.argv.slice(2))

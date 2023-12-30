
const fs = require('fs')
const readline = require('readline')

const loadNames = (path) => new Promise((resolve, reject) => {
    const names = new Set()
    const rl = readline.createInterface({
        input: fs.createReadStream(path, 'utf8'),
    })
    let lines = 0
    console.log(`Load names...`)
    rl.on('line', (line) => {
        const entries = line.split('\t')
        const name = entries[1]
        const asciiName = entries[2]
        const altNames = entries[3].split(',')
        names.add(name, asciiName, ...altNames)
        lines++
        if(lines % 100000 === 0) console.log(lines)
    })
    rl.on('close', () => {
        resolve(names)
    })
    rl.on('error', (err) => {
        reject(err)
    })
})

async function convert(inFile, names, outFile) {
    const rl = readline.createInterface({
        input: fs.createReadStream(inFile, 'utf8'),
    })
    const out = fs.createWriteStream(outFile, 'utf8')

    let lines = 0
    console.log(`Filter data...`)
    rl.on('line', (line) => {
        const [key, value] = line.split('\t')
        if(!names.has(value)) return
        out.write(line + '\n')
        lines++
        if(lines % 10000 === 0) console.log(lines)
    })
}

async function main(args) {
    if(args.length < 2) {
        console.log(`Usage: ${process.argv[1]} ${process.argv[2]} allCountries.txt inFile...`)
        convert.exit(1)
    }
    const [allCountries] = args
    const inFiles = args.slice(1)

    const names = await loadNames(allCountries)
    inFiles.forEach((inFile) => {
        const outFile = inFile.replace(/\.tsv$/, '_f.tsv')
        convert(inFile, names, outFile)
    })
}

if(require.main === module) main(process.argv.slice(2))

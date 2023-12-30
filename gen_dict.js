
const fs = require('fs')
const readline = require('readline')

const head = 'INSERT INTO `wb_items_per_site` VALUES '
const recordPattern = /\(\d+?,\d+?,'.+?','.+?'\)[,;]/g
const fieldPattern = /(\d+|'.+?')/g

const stripQuotes = (str) => str.startsWith("'") && str.endsWith("'") ? str.substring(1, str.length - 1) : str

async function main(args) {
    if(args.length < 3) {
        console.log(`Usage: ${process.argv[1]} ${process.argv[2]} sqlFile siteID outFile`)
        process.exit(1)
    }
    const [sqlFile, siteID, outFile] = args

    const rl = readline.createInterface({
        input: fs.createReadStream(sqlFile, 'utf8'),
    })
    const out = fs.createWriteStream(outFile, 'utf8')

    let r = 0
    rl.on('line', (line) => {
        if(!line.startsWith(head)) return
        const records = line.match(recordPattern).map((match) => match.match(fieldPattern))
        const results = records.map((record) => {
            const [, qid, sid, page] = record
            return [parseInt(qid), stripQuotes(sid), stripQuotes(page)]
        })
        results.forEach(([qid, sid, page]) => {
            if(sid == siteID) {
                out.write(`${qid}\t${page}\n`)
                r++
                if(r % 10000 === 0) console.log(r)
            }
        })
    })
}

if(require.main === module) main(process.argv.slice(2))

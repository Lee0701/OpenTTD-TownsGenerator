
const fs = require('fs')
const path = require('path')

const main = async () => {
    const args = process.argv.slice(2)
    const inFile = args.shift()
    const outFile = args.shift()
    
    let data = fs.readFileSync(inFile, 'utf-8')
    data = JSON.parse(data)
    data = Object.entries(data).map((item) => {
        const key = item.shift()
    })
    console.log(Object.entries(data)[0])
}

if(require.main === module) main()

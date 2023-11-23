
const fs = require('fs')
const readline = require('readline')

const main = async () => {
    const data = fs.createReadStream('alternateNames/alternateNames.txt', 'utf8')
    const rl = readline.createInterface({input: data})
    const output = []
    rl.on('line', (line) => {
        const items = line.split('\t')
        if(items[2].slice(0, 2) == 'zh') output.push(line)
    })
    rl.on('close', () => {
        fs.writeFileSync('alternateNames/alternateNames_zh.txt', output.join('\n'))
    })
}

if(require.main === module) {
    main()
}

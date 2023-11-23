
const fs = require('fs')

const main = async () => {
    const data = fs.readFileSync('./alternateNames/alternateNames_zh.txt', 'utf8')
            .split('\n')
            .map((line) => line.split('\t'))
    const groups = data
            .reduce((acc, items) => (acc[items[1]] = [...(acc[items[1]] || []), items], acc), {})
    
    const result = Object.entries(groups).map(([key, list], i) => {
        if(i % 1000 == 0) console.log(i, key)
        const values = Object.fromEntries(list
                .map((items) => [items[2], items[3]])
                .filter(([lang, value]) => value.split('').find((c) => !(c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z')))
                .map(([lang, value]) => [lang, value]))
        if(values['zh-TW']) return [key, values['zh-TW']]
        else if(values['zh']) return [key, values['zh']]
        else if (values['zh-CN']) return [key, values['zh-CN']]
        else return [key, '']
    })
    
    fs.writeFileSync('./alternateNames/alternateNames_zh_dict.json', JSON.stringify(Object.fromEntries(result), null, 2))
}

if(require.main === module) {
    main()
}

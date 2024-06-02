
const fs = require('fs')
const path = require('path')

const industryCodeMap = require('./industry_codes/ecs')

const north = 60.009580000
const east = 20.009580000
const south = 29.990420000
const west = -10.009580000
const header = [north, east, south, west].join(',')

const parseJson = (file) => {
    const result = []
    const input = JSON.parse(fs.readFileSync(file, 'utf8'))
    const type = path.basename(file, '.json')
    const code = industryCodeMap[type]
    if(code === undefined) return result
    input.elements.forEach((elem) => {
        if(elem.lat !== undefined && elem.lon !== undefined) {
            result.push([code, elem.lat, elem.lon])
        } else if(elem.center !== undefined) {
            result.push([code, elem.center.lat, elem.center.lon])
        }
    })
    return result.map((items) => items.join(','))
}

const main = async () => {
    const inDir = 'data/trans-siberia'
    const outFile = 'data/trans-siberia.csv'
    const result = []
    const files = fs.readdirSync(inDir)
    files.forEach((file) => {
        const list = parseJson(path.join(inDir, file))
        list.forEach((line) => result.push(line))
    })
    fs.writeFileSync(outFile, header + '\n' + result.join('\n'))
}

if(require.main === module) {
    main()
}

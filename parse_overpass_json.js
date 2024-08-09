
const fs = require('fs')
const path = require('path')

const industryCodeMap = require('./industry_codes/ecs')

const north = 60.0095840600000017
const east = 150.0104210009999974
const south = 29.9895833329999988
const west = -15.0095833580000004
const header = [north, east, south, west].join(',')

const parseJson = (file) => {
    const result = []
    const input = JSON.parse(fs.readFileSync(file, 'utf8'))
    const type = path.basename(file, '.json')
    const code = industryCodeMap[type]
    if(code === undefined) {
        console.warn(`No code found for ${type}`)
        return result
    }
    if(!input.elements) console.error(`No elements found for ${type}`)
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
    const outFile = 'data/industry/industries.csv'
    const result = []
    const files = fs.readdirSync(inDir)
    files.forEach((file) => {
        if(!file.endsWith('.json')) return
        const list = parseJson(path.join(inDir, file))
        list.forEach((line) => result.push(line))
    })
    fs.writeFileSync(outFile, header + '\n' + result.join('\n'))
}

if(require.main === module) {
    main()
}

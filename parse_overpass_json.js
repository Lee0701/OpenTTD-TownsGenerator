
const fs = require('fs')
const path = require('path')

const north = 60.009580000
const east = 20.009580000
const south = 29.990420000
const west = -10.009580000
const header = [north, east, south, west].join(',')

const industryCodeMap = {
    // coal mine
    coal_mine: 0,
    // power station
    power_station: 1,
    // sawmill
    sawmill: 2,
    // forest
    forest: 3,
    // oil refinery
    refinery: 4,
    // factory
    factory: 6,
    // steel mill
    steel_mill: 8,
    // farm
    farm: 9,
    // iron mine
    iron_mine: 18,
    // oil well
    oil_well: 11,
}

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
    const inDir = 'data/EUXXL'
    const outFile = 'data/EUXXL_industries_additional.csv'
    const result = []
    const files = fs.readdirSync(inDir)
    files.forEach((file) => {
        result.push(...parseJson(path.join(inDir, file)))
    })
    fs.writeFileSync(outFile, header + '\n' + result.join('\n'))
}

if(require.main === module) {
    main()
}

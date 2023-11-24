
const fs = require('fs')
const readline = require('readline')
const alternateNamesDict = require('./data/alternateNames/alternateNames_zh_hant_dict.json')

const north = 60.00958
const east = 20.00958
const south = 29.99042
const west = -10.00958
const header = [north, east, south, west].join(',')

const THRES_COUNT = 120000
const THRES_CITY = 500000
const THRES_L = 100000
const THRES_M = 75000

const convertPopulation = (population) => Math.round(Math.sqrt(population) * 2)
// const convertPopulation = (population) => Math.round(population / 100)

const main = async () => {
    const inFile = 'data/cities1000.txt'
    const outFile = 'data/EUXXL_both_names.csv'
    const result = []
    const failed = []
    const count = {S: 0, M: 0, L: 0, C: 0}
    const input = fs.createReadStream(inFile, 'utf8')
    const rl = readline.createInterface({input})
    let i = 0
    rl.on('line', (line) => {
        const [id, name, asciiName, alternateNames, latitude, longitude,
            featureClass, featureCode, countryCode, countryCodes2,
            admin1Code, admin2Code, admin3Code, admin4Code,
            population, elevation, timezone
        ] = line.split('\t')
        if(featureClass != 'P') {
            return
        }
        const outLatitude = parseFloat(latitude)
        const outLongitude = parseFloat(longitude)
        if(outLatitude > north || outLatitude < south
                || outLongitude > east || outLongitude < west) {
            return
        }
        const dictName = alternateNamesDict[id]
        const inDataName = alternateNames.split(',').find((n) => n.split('').filter((c) => c >= '\u4e00' && c <= '\u9fff').length > n.length/2)
        const cjkName = dictName || inDataName
        const outName = cjkName ? cjkName + ' / ' + asciiName : asciiName
        if(!outName || !population) {
            failed.push(line)
            return
        }
        const inPopulation = Math.round(population)
        const outPopulation = convertPopulation(population)
        const normalizedName = outName.replace(/,/g, ' ').replace(/ +/, ' ').trim()
        const outSize = (inPopulation > THRES_L) ? 'L' : (inPopulation > THRES_M) ? 'M' : 'S'
        const outCity = (inPopulation > THRES_CITY) ? '1' : '0'
        count[outSize] += 1
        if(outCity == '1') count['C'] += 1
        result.push([inPopulation, normalizedName, outPopulation, outCity, outLatitude, outLongitude])
        if(++i % 10000 === 0) console.log(i)
    })
    rl.on('close', () => {
        console.log(count)
        const output = result
                .sort((a, b) => b[0] - a[0])
                .slice(0, THRES_COUNT)
                .map((items) => items.slice(1).join(','))
        fs.writeFileSync(outFile, header + '\n' + output.join('\n'))
        fs.writeFileSync('data/failed.tsv', failed.join('\n'))
    })
}

if(require.main === module) {
    main()
}

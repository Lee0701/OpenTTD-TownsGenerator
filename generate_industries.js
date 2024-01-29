
const fs = require('fs')
const readline = require('readline')
const {mergedCodeMap} = require('./industry_codes')

const north = 60.009580000
const east = 20.009580000
const south = 29.990420000
const west = -10.009580000
const header = [north, east, south, west].join(',')

const main = async () => {
    const inFile = 'data/allCountries.txt'
    const outFile = 'data/EUXXL_industries.csv'
    const result = []
    const failed = []
    const input = fs.createReadStream(inFile, 'utf8')
    const rl = readline.createInterface({input})
    let i = 0
    rl.on('line', (line) => {
        const [id, name, asciiName, alternateNames, latitude, longitude,
            featureClass, featureCode, countryCode, countryCodes2,
            admin1Code, admin2Code, admin3Code, admin4Code,
            population, elevation, timezone
        ] = line.split('\t')
        const outLatitude = parseFloat(latitude)
        const outLongitude = parseFloat(longitude)
        if(outLatitude > north || outLatitude < south
                || outLongitude > east || outLongitude < west) {
            return
        }
        const code = mergedCodeMap[featureCode]
        if(code === undefined) {
            return
        }
        result.push([code, outLatitude, outLongitude])
        if(++i % 10000 === 0) console.log(i)
    })
    rl.on('close', () => {
        const output = result.map((items) => items.join(','))
        fs.writeFileSync(outFile, header + '\n' + output.join('\n'))
        fs.writeFileSync('data/failed.tsv', failed.join('\n'))
    })
}

if(require.main === module) {
    main()
}

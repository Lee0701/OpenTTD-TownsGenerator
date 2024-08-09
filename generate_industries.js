
const fs = require('fs')
const readline = require('readline')
const {mergedCodeMap} = require('./geonames_industry_codes/trans-siberia')

const north = 60.0095840600000017
const east = 150.0104210009999974
const south = 29.9895833329999988
const west = -15.0095833580000004
const header = [north, east, south, west].join(',')

const main = async () => {
    const inFile = 'data/allCountries.txt'
    const outFile = 'data/industries_out.csv'
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

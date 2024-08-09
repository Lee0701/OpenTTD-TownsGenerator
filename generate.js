
const fs = require('fs')
const readline = require('readline')
const alternateNamesDict = require('./alternateNames/alternateNames_zh_dict.json')

const north = 60.0095840600000017
const east = 150.0104210009999974
const south = 29.9895833329999988
const west = -15.0095833580000004
const header = [north, east, south, west].join(',')

const main = async () => {
    const inFile = 'data/allCountries.txt'
    const outFile = 'data/allCountries_out.csv'
    const failedFile = 'data/failed.tsv'
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
        const outName = dictName || inDataName || name
        const normalizedName = outName.replace(/,/g, ' ').replace(/ +/, ' ').trim()
        const realPopulation = parseInt(population)
        result.push([realPopulation, normalizedName, outLatitude, outLongitude])
        if(++i % 10000 === 0) console.log(i)
    })
    rl.on('close', () => {
        const sorted = result.sort((a, b) => b[0] - a[0])
        const maxPopulation = sorted[0][0]
        const basePopulation = Math.round(Math.sqrt(maxPopulation / 4))
        const output = sorted.map(([realPopulation, normalizedName, outLatitude, outLongitude]) => {
            const outCity = '0'
            const outPopulation = Math.max(Math.round(realPopulation / basePopulation * 2), 20)
            const out = [normalizedName, outPopulation, outCity, outLatitude, outLongitude]
            return out.join(',')
        })
        fs.writeFileSync(outFile, header + '\n' + output.join('\n'))
        fs.writeFileSync(failedFile, failed.join('\n'))
    })
}

if(require.main === module) {
    main()
}

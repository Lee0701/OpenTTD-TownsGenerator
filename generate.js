
const fs = require('fs')
const readline = require('readline')
const alternateNamesDict = require('./alternateNames/alternateNames_zh_dict.json')

const north = 60.009580000
const east = 20.009580000
const south = 29.990420000
const west = -10.009580000
const header = [north, east, south, west].join(',')

const main = async () => {
    const inFile = 'allCountries.txt'
    const outFile = 'allCountries_out.csv'
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
        // const outName = alternateNames[id] || name
        const dictName = alternateNamesDict[id]
        const inDataName = alternateNames.split(',').find((n) => n.split('').filter((c) => c >= '\u4e00' && c <= '\u9fff').length > n.length/2)
        const outName = dictName || inDataName
        if(!outName || !population) {
            failed.push(line)
            return
        }
        const outPopulation = parseInt(population)
        const normalizedName = outName.replace(/,/g, ' ').replace(/ +/, ' ').trim()
        const outSize = (population > THRES_L) ? 'L' : (population > THRES_M) ? 'M' : 'S'
        const outCity = (population > THRES_CITY) ? '1' : '0'
        result.push([outPopulation, normalizedName, outSize, outCity, outLatitude, outLongitude])
        if(++i % 10000 === 0) console.log(i)
    })
    rl.on('close', () => {
        const output = result
                .sort((a, b) => b[0] - a[0])
                .map((items) => items.slice(1).join(','))
        fs.writeFileSync(outFile, header + '\n' + output.join('\n'))
        fs.writeFileSync('failed.tsv', failed.join('\n'))
    })
}

if(require.main === module) {
    main()
}

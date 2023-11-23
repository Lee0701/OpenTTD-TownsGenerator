
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
    const failed = []
    const input = fs.createReadStream(inFile, 'utf8')
    const rl = readline.createInterface({input})
    fs.writeFileSync(outFile, header + '\n')
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
        // const outName = alternateNames[id] || name
        const dictName = alternateNamesDict[id]
        const inDataName = alternateNames.split(',').find((n) => n.split('').filter((c) => c >= '\u4e00' && c <= '\u9fff').length > n.length/2)
        const outName = dictName || inDataName
        if(!outName || !population) {
            failed.push(line)
            return
        }
        const normalizedName = outName.replace(/,/g, ' ').replace(/ +/, ' ').trim()
        const outSize = 'S'
        const outCity = 0
        fs.appendFileSync(outFile, [normalizedName, outSize, outCity, outLatitude, outLongitude].join(',') + '\n')
        if(++i % 10000 === 0) console.log(i)
    })
    rl.on('close', () => {
        fs.writeFileSync('failed.tsv', failed.join('\n'))
    })
}

if(require.main === module) {
    main()
}

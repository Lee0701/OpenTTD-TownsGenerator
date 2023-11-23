
const fs = require('fs')
const readline = require('readline')

const north = 60.009584060
const east = 45.010418822
const south = 29.990416666
const west = -15.009583358
const header = [north, east, south, west].join(',')

const THRES_CITY = 500000
const THRES_L = 250000
const THRES_M = 100000

const main = async () => {
    const inFile = 'allCountries.txt'
    const outFile = 'allCountries_out_ascii_names.csv'
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
        // const outName = alternateNames[id] || name
        // const dictName = alternateNamesDict[id]
        // const inDataName = alternateNames.split(',').find((n) => n.split('').filter((c) => c >= '\u4e00' && c <= '\u9fff').length > n.length/2)
        // const outName = dictName || inDataName
        const outName = asciiName
        if(!outName || !population) {
            failed.push(line)
            return
        }
        const outPopulation = parseInt(population)
        const normalizedName = outName.replace(/,/g, ' ').replace(/ +/, ' ').trim()
        const outSize = (population > THRES_L) ? 'L' : (population > THRES_M) ? 'M' : 'S'
        const outCity = (population > THRES_CITY) ? '1' : '0'
        count[outSize] += 1
        if(outCity == '1') count['C'] += 1
        result.push([outPopulation, normalizedName, outSize, outCity, outLatitude, outLongitude])
        if(++i % 10000 === 0) console.log(i)
    })
    rl.on('close', () => {
        console.log(count)
        const output = result
                .sort((a, b) => b[0] - a[0])
                .slice(0, 64000)
                .map((items) => items.slice(1).join(','))
        fs.writeFileSync(outFile, header + '\n' + output.join('\n'))
        fs.writeFileSync('failed.tsv', failed.join('\n'))
    })
}

if(require.main === module) {
    main()
}

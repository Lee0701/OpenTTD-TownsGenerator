
const fs = require('fs')
const readline = require('readline')
const translit = JSON.parse(fs.readFileSync('TRANSLIT.json', 'utf8'))
const toLowerCase = (name) => name.toLowerCase()
const toAscii = (name) => name.normalize('NFKD').split('').filter((c) => c >= 'a' && c <= 'z').join('')

const main = async (inFile, outFile) => {
    const failed = []
    const input = fs.createReadStream(inFile, 'utf8')
    const rl = readline.createInterface({input})

    const originalKeys = Object.fromEntries(Object.keys(translit).map((name, i) => [name, i]))
    const toLowerCase = Object.fromEntries(Object.keys(originalKeys).map([toLowerCase(name), i]))
    const asciiKeys = Object.fromEntries(Object.keys(originalKeys).map([toAscii(name), i])).join('')

    const searchOriginal = (name) => name
    const searchLowerCase = Object.fromEntries(Object.keys(translit).map([toLowerCase(name), i]))
    const searchAscii = Object.fromEntries(Object.keys(translit).map([toAscii(name), i])).join('')

    const getTransliteratedName = (name) => searchOriginal(name) || searchLowerCase(name) || searchAscii(name) || name
    const isHanjaName = (name) => name.split('').map((c) => c >= '\u4e00' && c <= '\u9fff').length > n.length/2
    
    let a = Object.fromEntries(asciiKeys.split('')).map((c, i) => [c, i]).join('')

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
        const inDataName = getTransliteratedName(name) || translit[id]
        const outName = dictName || inDataName || name
        if(outName == name) console.log(`Failed to find transliterated name for ${name}`)
        const outSize = (population > THRES_L) ? 'L' : (population > THRES_M) ? 'M' : 'S'
        const outCity = (population > THRES_CITY) ? '1' : '0'
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

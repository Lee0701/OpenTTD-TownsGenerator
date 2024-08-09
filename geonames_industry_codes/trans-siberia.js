
const altFeatureCodeMap = {
    // gold mine to iron mine
    MNAU: 18,
    // chrome mine to iron mine
    MNCR: 18,
    // copper works to steelworks
    MFGCU: 8,
}

const featureCodeMap = {
    // coal mine
    MNC: 13,
    MN: 13, // mine
    MNA: 13, // mining area
    COLF: 13, // coalfield
    // power station
    PS: 14,
    // sawmill
    MLSW: 36,
    ML: 36, // mill
    // forest
    FRST: 35,
    // oil refinery
    OILR: 22,
    GOSP: 22, // gas-oil separator plant
    OILT: 22, // tank farm
    // factory
    MFG: 4,
    MFGQ: 4, // abandoned factory
    MFGM: 4, // ammunation factory
    INDS: 4, // industrial area
    // ore treatment plant
    MLM: 30,
    FNDY: 30, // foundry
    // farm
    FRM: 6,
    // iron mine
    MNFE: 29,
    MNQ: 29, // abandoned mine
    // oil well
    OILW: 20,
    OILQ: 20, // abandoned oil well
}

const mergedCodeMap = {
    ...featureCodeMap,
    ...altFeatureCodeMap,
}

module.exports = {
    featureCodeMap,
    altFeatureCodeMap,
    mergedCodeMap,
}

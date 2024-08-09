
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
    MNC: 0,
    MN: 0, // mine
    MNA: 0, // mining area
    COLF: 0, // coalfield
    // power station
    PS: 1,
    // sawmill
    MLSW: 2,
    ML: 2, // mill
    // forest
    FRST: 3,
    // oil refinery
    OILR: 4,
    GOSP: 4, // gas-oil separator plant
    OILT: 4, // tank farm
    // factory
    MFG: 6,
    MFGQ: 6, // abandoned factory
    MFGM: 6, // ammunation factory
    INDS: 6, // industrial area
    // ore treatment plant
    MLM: 8,
    FNDY: 8, // foundry
    // farm
    FRM: 9,
    // iron mine
    MNFE: 18,
    MNQ: 18, // abandoned mine
    // oil well
    OILW: 11,
    OILQ: 11, // abandoned oil well
    WLL: 11, // well
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

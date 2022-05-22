/**
 * returns some function that helps with pokemon data / color / types etc.
 */

const types = {
    "bug": "#83C300",
    "dark": "#5B5466",
    "dragon": "#006FC9",
    "electric": "#FBD100",
    "fairy": "#FB88EC",
    "fighting": "#DF3069",
    "fire": "#FF9740",
    "flying": "#8AAAE3",
    "ghost": "#4C6AB2",
    "grass": "#38BE4B",
    "ground": "#E87235",
    "ice": "#4CD1C0",
    "normal": "#919AA3",
    "poison": "#B666CE",
    "psychic": "#FF6375",
    "rock": "#C8B686",
    "steel": "#58909F",
    "water": "#3692DD",
}
const typesKeys = Object.keys(types)

const typeDeToEnMap = {
    "Käfer": "bug",
    "Unlicht": "dark",
    "Drachen": "dragon",
    "Elektro": "electric",
    "Fee": "fairy",
    "Kampf": "fighting",
    "Feuer": "fire",
    "Flug": "flying",
    "Geist": "ghost",
    "Pflanze": "grass",
    "Boden": "ground",
    "Eis": "ice",
    "Normal": "normal",
    "Gift": "poison",
    "Psycho": "psychic",
    "Gestein": "rock",
    "Stahl": "steel",
    "Wasser": "water",
}

function swap(json){
    var ret = {};
    for(var key in json){
        ret[json[key]] = key;
    }
    return ret;
}
const typeEnToDeMap = swap(typeDeToEnMap)

export default {
    getAllTypes: () => typesKeys,
    getAllTypesWithColorCode: () => types,
    getTypeColor: (type) => types[type],
    getTypeNameFromDeName: (type) => typeDeToEnMap[type],
    getTypeDENameFromEnName: (type) => typeEnToDeMap[type],
}

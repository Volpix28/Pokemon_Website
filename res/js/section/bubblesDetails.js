
String.prototype.pad = function(size) {
    let num = this;
    while (num.length < size) num = "0" + num;
    return num;
}

// Main Function
const updateDetails = (parentSelector, pokemonData, gen) => {
    const container = parentSelector().select('.poke-bubbles-details');

    // Update pic
    container.select('.poke-pic')
        .attr('src', `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemonData.id.pad(3)}.png`)

    // Update title
    const title = `#${pokemonData.id.pad(3)} ${pokemonData.ger_name}`;
    container.select('.poke-detail-title').html(`<span>${title}</span>`)

    // Update name
    container.select('.poke-detail-name').html(`<span>${pokemonData.ger_name}</span>`)

    // Update types
    container.select('.poke-detail-type1').html(`<span>${pokemonData.type1}</span>`)
    container.select('.poke-detail-type2').html(`<span>${pokemonData.type2}</span>`)

    // Update pokewiki link
    container.select('.poke-detail-wiki-link > a').attr('href', `https://www.pokewiki.de/?search=${pokemonData.ger_name}`)

}

export {
    updateDetails
}
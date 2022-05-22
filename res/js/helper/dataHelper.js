

const Dataset = {
    bubbles: 'bubbles'
}

const loaders = {
    'bubbles': async function(gen) {
        return (await d3.dsv(';', `../res/data/pokemon_gen${gen}.csv`)).map(it => {
            it.base_total = parseFloat(it.base_total)
            return it;
        });
    },
}


const Loader = {
    /**
     * @param {string} dataset_name
     * @param {Object} args
     * @return {Object}
     */
    get: async (dataset_name, ...args) => {
        const localRet = localStorage.getItem(dataset_name);
        if (localRet !== null) return JSON.parse(localRet);
        const ret = await (loaders[dataset_name].apply(undefined, args));
        localStorage.setItem(dataset_name, JSON.stringify(ret));
        return ret;
    }
}



export { Loader, Dataset }

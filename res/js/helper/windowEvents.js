
let registry = [];

window.onresize = function() {
    for (const foo of registry)
        foo.apply(this, arguments)
}

export default {
    registerOnWindowResize: (callback) => {
        registry.push(callback)
    }
}
const insert = function(lib) {
    var uri = ['https://unpkg.com', lib].join('/')

    return new Promise((resolve, reject) => {
        let id = '_insert-' + lib

        if (document.getElementById(id) !== null)
            resolve()

        let script = document.createElement('script')
            script.setAttribute('src', uri)
            script.setAttribute('id', id)

        script.addEventListener('load', function() {
            console.info(`Load ${uri}`)
            resolve()
        });

        script.addEventListener('error', function() {
            console.error(`Could not load ${uri}`)
            reject()
        })

        document.body.appendChild(script);
    });
}

export default function(lib) {
    if (typeof lib === "string") {
        return insert(lib);
    }
    else if (typeof lib === "object") {
        let libs = [];
        lib.forEach(library => {
            libs.push(insert(library))
        })
        
        return Promise.all(libs);
    }
}
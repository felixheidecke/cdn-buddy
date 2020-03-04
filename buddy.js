class buddy {

  constructor () {
    this._baseUrl = ''
    this._paths = {}
  }

  set config (config) {
    this._baseUrl = (config.baseUrl) || ''
    this._paths = (config.paths) || {}
  }

  set paths (path) {
    if (typeof path !== 'object')
      throw Error('path setter expecting object')

    Object.assign(this._paths, path)
  }

  get path () {
    return this._paths
  }

  _createLinkElement (uri) {
    let el = document.createElement('link')
    el.setAttribute('rel', 'stylesheet')
    el.setAttribute('href', uri)
    
    return el
  }

  _createScriptElement (uri) {
    let el = document.createElement('script')
    el.setAttribute('src', uri)

    return el
  }

  _insert (path) {
    let lib = (this._paths[path]) || path
    let uri = [this._baseUrl, lib].join('/')

    return new Promise((resolve, reject) => {
        let id = '__buddy__' + btoa(lib)
        let el = ''

        if (document.getElementById(id) !== null) {
            resolve()
            return
        }

        if (lib.search(/\.js$/) !== -1) {
          el = this._createScriptElement(uri)
          document.body.appendChild(el);
        }
        else if (lib.search(/\.css$/) !== -1) {
          el = this._createLinkElement(uri)
          document.head.appendChild(el);
        }
        else {
          reject('Something went wrong')
          return
        }

        el.setAttribute('id', id)

        el.addEventListener('load', function() {
            console.info(`😀 Buddy Loaded: ${uri}`)
            resolve()
        });

        el.addEventListener('error', function() {
            console.error(`😟 Buddy could not load: ${uri}`)
            reject()
            return
        })

    });
  }

  require (lib) {
    if (typeof lib === "string") {
      return this._insert(lib);
    }
    else if (typeof lib === "object") {
        let libs = [];
        lib.forEach(library => {
            libs.push(this._insert(library))
        })
        
        return Promise.all(libs);
    }
  }
}

module.exports = new buddy
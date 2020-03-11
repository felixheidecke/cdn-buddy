class buddy {

  constructor () {
    this.__ns_status = '__CDN_BUDDY_STATUS'
    this.__ns_queue  = '__CDN_BUDDY_QUEUE'
    this.__ns_config = '__CDN_BUDDY_CONFIG'

    if (!window[this.__ns_queue]) { window[this.__ns_queue] = [] }
    if (!window[this.__ns_status]) { window[this.__ns_status] = {} }
    if (!window[this.__ns_config]) {
      window[this.__ns_config] = {
        baseUrl: null,
        paths: {}
      }
    }
  }

  set config (config) {
    if (typeof config !== 'object')
      throw Error('path setter expecting object')

    window[this.__ns_config] = config
  }

  get queue () {
    return window[this.__ns_queue]
  }

  get config () {
    return window[this.__ns_config]
  }

  get status () {
    return window[this.__ns_status]
  }

  _createLinkElement (path) {
    let el = document.createElement('link')
    el.setAttribute('rel', 'stylesheet')
    el.setAttribute('data-cdn-buddy', true)
    el.setAttribute('href', path)
    
    return el
  }

  _createScriptElement (path) {
    let el = document.createElement('script')
    el.setAttribute('src', path)
    el.setAttribute('data-cdn-buddy', true)

    return el
  }

  _createPath (path) {

    const baseUrl = window[this.__ns_config].baseUrl
    const paths = window[this.__ns_config].paths

    if (path.search(/(http(s)?):\/\//) === 0) {
      return path
    }

    if (paths[path]) {
      return baseUrl + '/' + paths[path]
    }
    
    return baseUrl + '/' + path
  }

  _insert (library) {
    let path = this._createPath(library)

    return new Promise((resolve, reject) => {
        let el = ''

        if (window[this.__ns_status][path] === 'done') {
          resolve()
          return
        }

        if (path.search(/\.js$/) !== -1) {
          el = this._createScriptElement(path)
          document.body.appendChild(el);
        }
        else if (path.search(/\.css$/) !== -1) {
          el = this._createLinkElement(path)
          document.head.appendChild(el);
        }
        else {
          el = this._createScriptElement(path + '.js')
          document.body.appendChild(el);
        }

        el.addEventListener('load', () => {
            console.info(`😀 Buddy Loaded: ${path}`)
            window[this.__ns_status][path] = 'done'
            resolve()
        });

        el.addEventListener('error', error => {
            console.error(`😟 Buddy could not load: ${path}`)
            window[this.__ns_status][path] = 'error'
            reject(error)
        })
    });
  }

  require (lib) {
    lib.forEach(library => {
      library = this._createPath(library)

      if (!window[this.__ns_status][library]) {
        window[this.__ns_status][library] = 'loading'
        window[this.__ns_queue].push(this._insert(library))
      }
    })

    return Promise.all(window[this.__ns_queue]);
  }
}

module.exports = new buddy
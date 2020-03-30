/**
 *             __         __              __    __     
 *   _________/ /___     / /_  __  ______/ /___/ /_  __
 *  / ___/ __  / __ \   / __ \/ / / / __  / __  / / / /
 * / /__/ /_/ / / / /  / /_/ / /_/ / /_/ / /_/ / /_/ / 
 * \___/\__,_/_/ /_/  /_.___/\__,_/\__,_/\__,_/\__, /  
 *                                            /____/   
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies. 
 *
 * https://opensource.org/licenses/ISC
 * 
 * @author Felix Heidecke <felix@heidecke.me>
 * @copyright Felix Heidecke 2020
 */

import 'promise-polyfill/src/polyfill';

(() => {
  let _ns_status  = NAMESPACE + '__STATUS'
  let _ns_queue   = NAMESPACE + '__QUEUE'
  let _ns_baseUrl = NAMESPACE + '__BASEURL'
  let _ns_paths   = NAMESPACE + '__PATHS'

  const init = () => {
    if (!window || !document) {
      console.clear()
      console.error('😮 CDN-Buddy only runs in the browser!')
      return
    }

    if (window[NAMESPACE]) {
      console.warn('window.' + NAMESPACE, 'is already defined')
      return
    }

    window[NAMESPACE] = {
      setConfig,
      addPath,
      require
    }

    window[_ns_queue]   = []
    window[_ns_status]  = {}
    window[_ns_baseUrl] = ''
    window[_ns_paths]   = {}
  }

  const setConfig = config => {
    if (typeof config !== 'object')
      throw Error('config setter expecting object')

    if (config.baseUrl)
      window[_ns_baseUrl] = config.baseUrl

    if (config.paths)
      window[_ns_paths] = config.paths
  }

  const addPath = paths => {
    Object.assign(window[_ns_paths], paths)
  }

  /**
   * Creates a <link> DOM node
   * 
   * @param {string} path full CSS file URI
   * @returns {object} HTML element
   */

  const _createLinkElement = path => {
    let el = document.createElement('link')
    el.setAttribute('rel', 'stylesheet')
    el.setAttribute('data-cdn-buddy', true)
    el.setAttribute('href', path)
    
    return el
  }

  /**
   * Creates a <script> DOM node
   * 
   * @param {string} path full JS file URI
   * @returns {object} HTML element
   */

  const _createScriptElement = path => {
    let el = document.createElement('script')
    el.setAttribute('src', path)
    el.setAttribute('data-cdn-buddy', true)

    return el
  }

  /**
   * Returns the full qualified URI for a given path
   * 
   * @param {string} path paths key, realtive- or absolute URI
   * @returns {array}
   */

  const _createPath = path => {
    const baseUrl = window[_ns_baseUrl]
    const paths = window[_ns_paths]

    // Absolute URI
    if (path.search(/(http(s)?):\/\//) === 0) {
      return [path]
    }

    if (paths[path] && Array.isArray(paths[path])) {
      return paths[path].map(path => baseUrl + '/' + ((paths[path]) || path))
    }

    if (paths[path]) {
      return [baseUrl + '/' + paths[path]]
    }
    
    return [baseUrl + '/' + path]
  }

  const _insert = library => {
    let path = library

    return new Promise((resolve, reject) => {
        let el = ''

        if (window[_ns_status][path] === 'done') {
          resolve()
          return
        }

        if (path.search(/\.js$/) !== -1) {
          el = _createScriptElement(path)
          document.body.appendChild(el);
        }
        else if (path.search(/\.css$/) !== -1) {
          el = _createLinkElement(path)
          document.head.appendChild(el);
        }
        else {
          reject('wrong filetype for', path)
          return
        }

        el.addEventListener('load', () => {
          console.info('😎 CDN-Buddy loaded:', path)
            window[_ns_status][path] = 'done'
            resolve()
        });

        el.addEventListener('error', error => {
          console.info(`😡 CDN-Buddy could not load: ${path}`)
            window[_ns_status][path] = 'error'
            reject(error)
        })
    });
  }

  const require = function() {
    let library = (typeof arguments[0] === 'object') ? arguments[0] : [arguments[0]]
    let surplus = (arguments.length > 1) ?  Object.values(arguments).splice(1) : false

    for (let i = 0; i < library.length; i++) {
      let _l = _createPath(library[i])
      for (let o = 0; o < _l.length; o++) {
        let __l = _l[o]
        if (!window[_ns_status][__l]) {
          window[_ns_status][__l] = 'loading'
          window[_ns_queue].push(_insert(__l))
        }
      }
    }

    return Promise.all(window[_ns_queue]).then( () => {
      if (surplus) {
        require(...surplus)
      }
    });
  }

  init()
})()
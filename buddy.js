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

( () => {
  class buddy {

    constructor () {
      if (!window || !document) {
        console.clear()
        console.error('cdn-buddy only runs in the browser! 😶')
        return
      }

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
        throw Error('config setter expecting object')

      if (config.baseUrl)
        window[this.__ns_config].baseUrl = config.baseUrl

      if (config.paths)
        window[this.__ns_config].paths = config.paths
    }

    set addPath (paths) {
      Object.assign(window[this.__ns_config].paths, paths)
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


    /**
     * Creates a <link> DOM node
     * 
     * @param {string} path full CSS file URI
     * @returns {object} HTML element
     */

    _createLinkElement (path) {
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

    _createScriptElement (path) {
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

    _createPath (path) {
      const baseUrl = window[this.__ns_config].baseUrl
      const paths = window[this.__ns_config].paths

      // Absolute URI
      if (path.search(/(http(s)?):\/\//) === 0) {
        return [path]
      }

      if (paths[path] && Array.isArray(paths[path])) {
        return paths[path].map(path => baseUrl + '/' + path)
      }

      if (paths[path]) {
        return [baseUrl + '/' + paths[path]]
      }
      
      return [baseUrl + '/' + path]
    }

    _insert (library) {
      let path = library

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
            reject('wrong filetype')
            return
          }

          el.addEventListener('load', () => {
              console.info(`😀 Buddy Loaded: ${path}`)
              window[this.__ns_status][path] = 'done'
              resolve()
          });

          el.addEventListener('error', error => {
              console.info(`😡 Buddy could not load: ${path}`)
              window[this.__ns_status][path] = 'error'
              reject(error)
          })
      });
    }

    require (lib) {
      for( let library of Object.values(lib)) {
        let _l = this._createPath(library)
        for( let __l of Object.values(_l)) {
          if (!window[this.__ns_status][__l]) {
            window[this.__ns_status][__l] = 'loading'
            window[this.__ns_queue].push(this._insert(__l))
          }
        }
      }

      return Promise.all(window[this.__ns_queue]);
    }
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = new buddy
  } else {
    window.cdnBuddy = new buddy
  }
})()
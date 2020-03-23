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
      const reqFile = new Request(library)
      let url, file, element

      return fetch(reqFile).then(response => {

        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }

        url = response.url
        file = url.split('/').reverse()[0]

        return response.blob()

      }).then( blob => {
        let objectURL = URL.createObjectURL(blob);

        if (url.search(/\.js$/) !== -1) {
          element = document.createElement('script')
          element.setAttribute('src', objectURL)
          document.body.appendChild(element)
        }
        else if (url.search(/\.css$/) !== -1) {
          element = document.createElement('link')
          element.setAttribute('rel', 'stylesheet')
          element.setAttribute('href', objectURL)
          document.head.appendChild(element)
        }

        console.info('😀 Buddy Loaded:', url)
        window[this.__ns_status][library] = 'done'

      }).catch( error => {
        window[this.__ns_status][library] = 'error'
        console.info('😡 Buddy', 'Error:', error)
      })
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

  module.exports = new buddy
})()
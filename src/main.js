/**
 * Article parser
 * @ndaidong
 **/

global.Promise = require('promise-wtf');

var {
  md5
} = require('bellajs');

var {
  fetchOptions,
  configure
} = require('./config');

var {
  isValidURL,
  removeUTM,
  cache,
  loadHTML
} = require('./utils');

var parse = require('./parsers');

var extract = (url = '') => {
  return new Promise((resolve, reject) => {
    if (!isValidURL(url)) {
      return reject(new Error('Invalid URL'));
    }
    let _url = removeUTM(url);
    let id = md5(_url);
    let stored = cache.get(id);
    if (stored) {
      return resolve(stored);
    }

    return loadHTML(_url, fetchOptions).then((html) => {
      return parse({url: _url, html});
    }).then((article) => {
      return resolve(article);
    }).catch((err) => {
      return reject(err);
    });
  });
};

(() => {
  // let url = 'https://medium.com/@ndaidong/setup-rocket-chat-within-10-minutes-2b00f3366c6';
  let url = 'https://www.youtube.com/watch?v=dIiwFzFvsmw';
  extract(url).then((art) => {
    console.log(art);
  }).catch((err) => {
    console.log(err);
  });
})();

module.exports = {
  configure,
  extract
};

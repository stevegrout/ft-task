const axios = require('axios');

/**
 * Takes an array of urls that will return JSON data.
 * The responses are combined into one object that is returned as a Promise
 *
 * @param urls - the url's to be requested
 * @returns {Promise<{}>}
 */
module.exports = async (urls) => {
  const requests = [];
  for (const url of urls) {
    requests.push(get(url));
  }

  const responses = await Promise.all(requests).catch((error) => {
    return Promise.reject(Error(`Request failure with url: ${error.config.url}`))
  });

  let result = {}
  for (const response of responses) {
    result = { ...result, ...response.data };
  }
  return Promise.resolve(result);
}

const get = (url) => {
  return axios.get(url);
}
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
    throw Error(`Request failure with url: ${error.config.url}`)
  });

  let result = {}
  responses.forEach((response, index) => {
    if (!response.data) {
      throw Error(`Invalid url supplied : ${urls[index]}`)
    }
    result = { ...result, ...response.data };
  })
  return Promise.resolve(result);
}

const get = (url) => {
  return axios.get(url);
}
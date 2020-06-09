const axios = require('axios');
const requestMultipleUrls = require('./request-multiple-urls');

jest.mock('axios');

const getResponse = (id) => {
  return {
    data: {
      ['key_a'+id]: `value_a${id}`,
      ['key_b'+id]: `value_b${id}`,
    }
  }
}

describe('request-multiple-urls', () => {
  test('resolves with the combined responses when the urls all respond with JSON', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(getResponse(1)))
      .mockImplementationOnce(() => Promise.resolve(getResponse(2)))
      .mockImplementationOnce(() => Promise.resolve(getResponse(3)));

    const urls = ['http://req1', 'http://req2', 'http://req3']

    const expected = {
      "key_a1": "value_a1",
      "key_b1": "value_b1",
      "key_a2": "value_a2",
      "key_b2": "value_b2",
      "key_a3": "value_a3",
      "key_b3": "value_b3"
    }
    await expect(requestMultipleUrls(urls)).resolves.toEqual(expected);
  })

  test('rejects with an error containing details when one of the urls fails', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(getResponse(1)))
      .mockImplementationOnce(() => Promise.reject({ config: { url: 'http://invalid-url' } }));

    const urls = ['http://req1', 'http://req2']

    await expect(requestMultipleUrls(urls)).rejects.toThrowError('Request failure with url: http://invalid-url');
  })

  test('overwrites an attribute with subsequent response', async () => {
    const response2a = {
      data: {
        key_a1: 'changed_a1',
        key_a2: 'value_a2'
      }
    };

    axios.get.mockImplementationOnce(() => Promise.resolve(getResponse(1)))
      .mockImplementationOnce(() => Promise.resolve(response2a))

    const urls = ['http://req1', 'http://req2']

    const expected = {
      "key_a1": "changed_a1",
      "key_b1": "value_b1",
      "key_a2": "value_a2",
    }
    await expect(requestMultipleUrls(urls)).resolves.toEqual(expected);
  })

})
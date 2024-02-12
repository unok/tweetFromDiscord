import { getUrl } from '@geturl'
import { describe, test, expect } from 'bun:test'

describe('getUrl', () => {
  const cases = [
    ['ほげほげhttps://example.comほげほげ', 'https://example.com'],
    ['ほげほげhttps://example.com?aaa=bbbほげほげ', 'https://example.com?aaa=bbb'],
    ['ほげほげhttps://example.com?aaa=bbb%20cccほげほげ', 'https://example.com?aaa=bbb%20ccc'],
    ['ほげほげhttps://example.com?aaa=bbb ccccほげほげ', 'https://example.com?aaa=bbb'],
    [
      `ほげほげhttps://example.com
aaaほげほげ`,
      'https://example.com',
    ],
  ]
  test.each(cases)('%p has %p', (text, url) => {
    expect(getUrl(text)).toBe(url)
  })
})

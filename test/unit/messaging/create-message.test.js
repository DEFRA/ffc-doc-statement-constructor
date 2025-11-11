const createMessage = require('../../../app/messaging/create-message')

const body = { content: 'hello' }
const type = 'message'
const source = 'ffc-doc-statement-constructor'

describe('createMessage', () => {
  const result = createMessage(body, type, source)

  test.each([
    ['body', result.body, body],
    ['type', result.type, type],
    ['source', result.source, source]
  ])('includes %s', (_prop, received, expected) => {
    expect(received).toStrictEqual(expected)
  })
})

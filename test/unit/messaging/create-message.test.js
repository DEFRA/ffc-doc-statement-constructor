const createMessage = require('../../../app/messaging/create-message')
const body = {
  content: 'hello'
}
const type = 'message'
const source = 'ffc-doc-statement-constructor'

describe('create message', () => {
  test('includes body', () => {
    const result = createMessage(body, type, source)
    expect(result.body).toStrictEqual(body)
  })

  test('includes type', () => {
    const result = createMessage(body, type, source)
    expect(result.type).toBe('message')
  })

  test('includes source', () => {
    const result = createMessage(body, type, source)
    expect(result.source).toBe('ffc-doc-statement-constructor')
  })
})

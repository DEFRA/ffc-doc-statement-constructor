const { deriveAlertData } = require('../../../app/utility/processing-alerts')

describe('deriveAlertData', () => {
  test('keeps explicit non-empty message and preserves error', () => {
    const payload = { process: 'proc-keep', message: 'explicit', error: { code: 'X' } }
    const result = deriveAlertData(payload, 'proc-keep')
    expect(result.message).toBe('explicit')
    expect(result.error).toEqual(payload.error)
    expect(result.process).toBe('proc-keep')
  })

  test('adds fallback message when message missing and no error', () => {
    const payload = { process: 'proc-none' }
    const result = deriveAlertData(payload, 'proc-none')
    expect(result.message).toBe('Failed processing proc-none')
    expect(Object.prototype.hasOwnProperty.call(result, 'error')).toBe(false)
  })

  test('treats null message as missing and falls back when error has no message', () => {
    const errObj = { code: 'X' }
    const payload = { process: 'proc-nomsg', message: null, error: errObj }
    const result = deriveAlertData(payload, 'proc-nomsg')
    expect(result.message).toBe('Failed processing proc-nomsg')
    expect(result.error).toBe(errObj)
  })

  test('uses error string as message and clears error', () => {
    const payload = { process: 'proc-str', error: 'string-error' }
    const result = deriveAlertData(payload, 'proc-str')
    expect(result.message).toBe('string-error')
    expect(result.error).toBeNull()
  })

  test('uses Error.message when Error.message is non-empty', () => {
    const payload = { process: 'proc-err', error: new Error('boom') }
    const result = deriveAlertData(payload, 'proc-err')
    expect(result.message).toBe('boom')
    expect(result.error).toBeInstanceOf(Error)
  })

  test('falls back when Error.message is empty string', () => {
    const e = new Error('')
    const payload = { process: 'proc-empty', error: e }
    const result = deriveAlertData(payload, 'proc-empty')
    expect(result.message).toBe('Failed processing proc-empty')
    expect(result.error).toBeInstanceOf(Error)
  })

  test('replaces whitespace-only message with derived message from error', () => {
    const payload = { process: 'proc-space', message: '   ', error: new Error('derived') }
    const result = deriveAlertData(payload, 'proc-space')
    expect(result.message).toBe('derived')
  })
})

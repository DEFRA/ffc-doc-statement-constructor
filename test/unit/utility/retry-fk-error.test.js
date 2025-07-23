const { retryOnFkError } = require('../../../app/utility/retry-fk-error')
const { Sequelize } = require('../../../app/data')

jest.useFakeTimers()

describe('retryOnFkError', () => {
  let fn
  let context
  let identifier

  beforeEach(() => {
    context = 'testContext'
    identifier = 'testId'
    jest.clearAllTimers()
  })

  test('should return result if no error occurs', async () => {
    fn = jest.fn().mockResolvedValue('success')
    const result = await retryOnFkError(fn, context, identifier)
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should retry on ForeignKeyConstraintError and eventually succeed', async () => {
    const error = new Sequelize.ForeignKeyConstraintError()
    fn = jest
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('success')

    const promise = retryOnFkError(fn, context, identifier)

    // Fast-forward timers for the delay
    await Promise.resolve() // allow catch to run
    jest.runOnlyPendingTimers()
    await promise

    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('should throw if total delay would exceed MAX_TOTAL_DELAY_MS', async () => {
    const error = new Sequelize.ForeignKeyConstraintError()
    fn = jest.fn(() => Promise.reject(error))

    const promise = retryOnFkError(fn, context, identifier)

    // Fast-forward timers and microtasks for a reasonable number of cycles
    for (let i = 0; i < 20; i++) {
      jest.runOnlyPendingTimers()
      await Promise.resolve()
    }

    await expect(promise).rejects.toThrow(Sequelize.ForeignKeyConstraintError)
  }, 10000)

  test('should throw immediately on non-FK error', async () => {
    const error = new Error('Some other error')
    fn = jest.fn().mockRejectedValue(error)
    await expect(retryOnFkError(fn, context, identifier)).rejects.toThrow('Some other error')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

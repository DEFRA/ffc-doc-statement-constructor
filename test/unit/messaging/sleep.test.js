jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')
const sleep = require('../../../app/messaging/sleep')

describe('sleep', () => {
  test('should return a promise', () => {
    expect(sleep(1000)).toBeInstanceOf(Promise)
  })

  test('should call setTimeout with ms', () => {
    sleep(1000)
    expect(setTimeout).toHaveBeenCalledWith(expect.anything(), 1000)
  })
})

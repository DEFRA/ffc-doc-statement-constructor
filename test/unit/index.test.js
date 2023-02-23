jest.mock('../../app/messaging')
const mockMessaging = require('../../app/messaging')

jest.mock('../../app/processing')
const mockProcessing = require('../../app/processing')
jest.mock('../../app/messaging/wait-for-idle-messaging')

describe('app', () => {
  beforeEach(() => {
    require('../../app')
  })

  test('should call mockMessaging.start when app is imported', async () => {
    expect(mockMessaging.start).toHaveBeenCalled()
  })

  test('should call mockMessaging.start once when app is imported', async () => {
    expect(mockMessaging.start).toHaveBeenCalledTimes(1)
  })

  test('should call mockProcessing.start when app is imported', async () => {
    expect(mockProcessing.start).toHaveBeenCalled()
  })

  test('should call mockProcessing.start once when app is imported', async () => {
    expect(mockProcessing.start).toHaveBeenCalledTimes(1)
  })

  test('should not call mockMessaging.stop when app is imported', async () => {
    expect(mockMessaging.stop).not.toHaveBeenCalled()
  })
})

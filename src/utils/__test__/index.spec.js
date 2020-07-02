import { checkVersion, formatTime } from '../index'
test('checkVersion', () => {
  expect(checkVersion('2.0.1', '1.0.0')).toBe(true)
  expect(checkVersion('2.10.1', '2.10.0')).toBe(true)
  expect(checkVersion('2.1.11', '2.01.11')).toBe(true)
  expect(checkVersion('10.1.11', '20.01.11')).toBe(false)
})
test('formatTime', () => {
  expect(formatTime(3600)).toBe('01:00:00')
  expect(formatTime(3760)).toBe('01:02:40')
})

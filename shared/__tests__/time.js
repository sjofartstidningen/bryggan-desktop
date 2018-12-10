import * as time from '../time';

describe('Module: time', () => {
  it('should be able to transform times', () => {
    expect(time.days(1).toHours()).toBe(24);
    expect(time.hours(12).toSeconds()).toBe(60 * 60 * 12);
    expect(time.minutes(10).toMilliseconds()).toBe(1000 * 60 * 10);
    expect(time.seconds(100).toMinutes()).toBe(100 / 60);
  });
});

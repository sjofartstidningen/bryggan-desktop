/**
 * This might seem like magic. But put simply it will make it possible to write
 * like this:
 *   const { minutes, milliseconds } = require('./time');
 *   minutes(15).toMilliseconds(); // 900000
 *   milliseconds(900000).toMinutes() // 15
 *
 * It will take a number as an input and first convert it to milliseconds
 * Those milliseconds cand then be converted into any other format
 */

const multipliers = {
  days: 864e5,
  hours: 36e5,
  minutes: 6e4,
  seconds: 1e3,
  milliseconds: 1,
  microseconds: 1e-3,
  nanoseconds: 1e-6,
};

const reduceMultipliers = (reducer, initial = {}) =>
  Object.entries(multipliers).reduce(reducer, initial);

const capitalize = str => {
  const [first, ...rest] = str.split('');
  return [first.toUpperCase(), ...rest].join('');
};

const createConverter = multiplier => val => {
  const ms = val * multiplier;
  return reduceMultipliers((acc, [key, m]) => ({
    ...acc,
    [`to${capitalize(key)}`]: () => ms / m,
  }));
};

export const days = createConverter(multipliers.days);
export const hours = createConverter(multipliers.hours);
export const minutes = createConverter(multipliers.minutes);
export const seconds = createConverter(multipliers.seconds);
export const milliseconds = createConverter(multipliers.milliseconds);
export const microseconds = createConverter(multipliers.microseconds);
export const nanoseconds = createConverter(multipliers.nanoseconds);

import { rem, rgb } from 'polished';

const font = {
  family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif`,
  size: {
    normal: rem('12px'),
    large: rem('16px'),
  },
};

const color = {
  black: rgb(0, 0, 0),
  darkGrey: rgb(68, 68, 68),
  grey: rgb(114, 121, 129),
  lightGrey: rgb(250, 251, 252),
  green: rgb(52, 199, 73),
  red: rgb(252, 96, 92),
};

export { font, color };


const COLORS = {
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  cyan: '\x1b[36m%s\x1b[0m',
  green: '\x1b[32m',
  gray: '\x1b[90m',
  white: '\u001b[37;1m',
};

export type Color = keyof typeof COLORS;

const highlight = (text: string, color: Color) => {
  return `${COLORS[color]}${text}${COLORS.reset}`;
};

export {
  highlight,
  COLORS
};
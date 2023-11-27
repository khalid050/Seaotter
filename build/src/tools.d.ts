declare const COLORS: {
    blue: string;
    yellow: string;
    red: string;
    reset: string;
    cyan: string;
    green: string;
    gray: string;
    white: string;
};
export type Color = keyof typeof COLORS;
declare const highlight: (text: string, color: Color) => string;
export { highlight, COLORS };

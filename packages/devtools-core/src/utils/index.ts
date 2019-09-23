const macMatch = window.navigator.platform.match("Mac") || [];
export const isMac: boolean = macMatch.length > 0;

export const keys = {
  enter: 13,
  s: 83,
};

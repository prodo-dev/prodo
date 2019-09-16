import * as _ from "lodash";

const macMatch = window.navigator.platform.match("Mac") || [];
export const isMac: boolean = macMatch.length > 0;

export const keys = {
  enter: 13,
  s: 83,
};

export const isValidJson = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

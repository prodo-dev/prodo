import * as pathToRegexp from "path-to-regexp";

const cache = {};
const cacheLimit = 1000;
let cacheCount = 0;

const compilePattern = (
  pattern: string,
  options: pathToRegexp.RegExpOptions,
) => {
  const optionKey = `${options.end}.${options.strict}.${options.sensitive}`;
  const optionCache = cache[optionKey] || (cache[optionKey] = {});

  if (optionCache[pattern]) {
    return optionCache[pattern];
  }

  const keys = [];
  const regex = pathToRegexp(pattern, keys, options);
  const result = { keys, regex };

  if (cacheCount < cacheLimit) {
    optionCache[pattern] = result;
    cacheCount++;
  }

  return result;
};

export const matchRoute = (
  path: string,
  pattern: string,
  exact: boolean = false,
) => {
  const options = { end: exact, strict: false, sensitive: false };
  const { regex, keys } = compilePattern(pattern, options);

  const match = regex.exec(path);
  if (match == null) {
    return null;
  }

  const [url, ...values] = match;
  const isExact = url === path;

  if (exact && !isExact) {
    return null;
  }

  return keys.reduce(
    (acc, key, index) => ({ ...acc, [key.name]: values[index] }),
    {},
  );
};

export const createParamString = (params?: { [key: string]: string }) => {
  if (params == null) {
    return "";
  }
  const keys = Object.keys(params || {});
  if (keys.length === 0) {
    return "";
  }
  return `?${keys
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&")}`;
};

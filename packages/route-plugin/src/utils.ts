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

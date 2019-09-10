export const makeAnchor = (value: any) =>
  value.replace(/\s+/g, "-").toLowerCase();

export const removeTrailingSlash = (value: string): string =>
  value[value.length - 1] === "/"
    ? value.substring(0, value.length - 1)
    : value;

export const makeAnchor = (value: any) =>
  value.replace ? value.replace(/\s+/g, "-").toLowerCase() : "";

export const removeTrailingSlash = (value: string): string =>
  value[value.length - 1] === "/"
    ? value.substring(0, value.length - 1)
    : value;

export const capitalize = (s: string) => s[0].toUpperCase() + s.substring(1);

export const normalize = (s: string) =>
  s
    .replace(/-/g, " ")
    .split(" ")
    .map(capitalize)
    .join(" ");

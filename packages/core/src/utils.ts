export const splitChar = "・";

export const splitPath = (pathKey: string): string[] =>
  pathKey.split(splitChar);
export const joinPath = (path: string[]): string => path.join(splitChar);

export const isPromise = (x: any): x is Promise<any> => x instanceof Promise;

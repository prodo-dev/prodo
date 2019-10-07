export const splitChar = "・";

export const splitPath = (pathKey: string): string[] =>
  pathKey.split(splitChar);
export const joinPath = (path: string[]): string => path.join(splitChar);

export const isPromise = (x: any): x is Promise<any> => x instanceof Promise;

export const syncIfPossible = (
  ...funcs: Array<(arg: any) => Promise<any> | any>
) => (arg?: any): Promise<any> | any => {
  if (funcs.length === 0) {
    return arg;
  }
  const [first, ...rest] = funcs;
  const ret = first(arg);
  if (isPromise(ret)) {
    return ret.then(a => syncIfPossible(...rest)(a));
  } else {
    return syncIfPossible(...rest)(ret);
  }
};

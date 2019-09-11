export const action = <A extends any[]>(
  func: (c: any) => (...args: A) => void,
  name: string = "(anonymous action)",
): ((...args: A) => void) => {
  (func as any).__name = name;
  return func as any;
};

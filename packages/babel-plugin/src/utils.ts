export const isInUniverse = (name: string) =>
  !["initState", "model", "action", "connect"].includes(name);

export const isPossibleComponentName = (name: string) => /^[A-Z]/.test(name);

export const isPossibleActionName = (name: string) => /^[^A-Z]/.test(name);

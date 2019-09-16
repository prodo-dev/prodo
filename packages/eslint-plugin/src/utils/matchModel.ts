export const matchModel = (name: string) =>
  name.startsWith(".") && /model(\.ctx)?(\.(j|t)sx?)?$/.test(name);

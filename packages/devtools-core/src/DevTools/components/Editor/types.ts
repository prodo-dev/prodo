export interface File {
  path: string;
  value: string;
}

// Mapping from package name to version
export interface Dependencies {
  [name: string]: string;
}

// Mapping from package name to typing code
export interface Typings {
  [name: string]: string;
}

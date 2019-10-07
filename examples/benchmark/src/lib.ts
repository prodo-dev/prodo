function randomIntInclusive(min: number, max: number) {
  // The maximum is exclusive and the minimum is inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Knuth-Fischer-Yates
export function shuffle<T>(data: T[], n?: number) {
  if (n == null) {
    n = data.length;
  }

  for (let i = n - 1; i > 0; i--) {
    const j = randomIntInclusive(0, i);
    const tmp = data[i];
    data[i] = data[j];
    data[j] = tmp;
  }
}

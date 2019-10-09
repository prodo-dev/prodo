import { shuffle } from "../lib";

export interface State {
  value: boolean;
  next?: State;
}

function length(state: State): number {
  let l = 1;
  while (state.next != null) {
    l += 1;
    state = state.next;
  }
  return l;
}

export function toggle(state: State, fraction: number) {
  const l = length(state);
  let idxs = [...Array(l)].map((_, i) => i);
  shuffle(idxs);
  idxs = idxs.slice(Math.floor(fraction * l));
  const idxsSet = new Set<number>(idxs);

  for (let i = 0, ptr = state; ptr.next != null; i++, ptr = ptr.next) {
    if (idxsSet.has(i)) {
      ptr.value = !ptr.value;
    }
  }
}

export function newState(n: number): State {
  const state: State = { value: false };
  for (let i = 0, ptr = state; i < n; i++, ptr = ptr.next) {
    ptr.next = { value: false };
  }
  return state;
}

export function copy(state: State): State {
  const newState: State = { value: state.value };
  for (
    let ptrNew = newState, ptrOld = state;
    ptrOld.next != null;
    ptrNew = ptrNew.next, ptrOld = ptrOld.next
  ) {
    ptrNew.next = { value: ptrOld.next.value }
  }
  return newState;
}

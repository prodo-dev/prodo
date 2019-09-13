---
title: "dispatch"
order: 2
---

```ts
export type Dispatch = <A extends any[]>(
  func: (...args: A) => void,
) => (...args: A) => void;
```

Dispatch an action.

**Usage**

```ts
dispatch(myAction)(param1, param2);
```

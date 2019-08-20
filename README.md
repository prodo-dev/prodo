# V2 Framework

This repo contains the current version of v2 of the Prodo framework. It is
currently experimental and will most likely be merged into
https://github.com/prodo-ai/dogedit when it is ready.

## Architecture

- `packages/core`: The main part of the framework that handles state, actions,
  subscriptions, and connect
- `examples/`: Example apps that use the framework

## Running the examples

Navigate to the example and

``` shell
yarn start
```

To typecheck the example run `yarn build:watch` at the root of this repo. Some
of the examples also have tests that can be run with `yarn test`.

## Developing

- Checkout this repo.
- Run `yarn` at the root.
- Run `yarn build:watch` to build all the TypeScript. Check this console for
  type errors.
- To run a sanity check over everything, run `yarn verify`.

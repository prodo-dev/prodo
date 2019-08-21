# V2 Framework

This repo contains an experimental version v2 of the Prodo framework.

## Architecture

- `packages/core`: The main part of the framework that handles state, actions,
  subscriptions, and connect
- `examples/`: Example apps that use the framework

## Running the examples

Navigate to the example, run

``` shell
yarn start
```

and open [localhost:1234](http://localhost:1234).

To typecheck the example run `yarn build:watch` at the root of this repo. Some
of the examples also have tests that can be run with `yarn test`.

## Developing

- Checkout this repo.
- Run `yarn` at the root.
- Run `yarn build:watch` to build all the TypeScript. Check this console for
  type errors.
- Fix linting errors with `yarn lint --fix`.
- To run a sanity check over everything, run `yarn verify`.

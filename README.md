# Prodo

Prodo is a full-stack framework to build apps faster.

## Running the examples

Navigate to the example, run

``` shell
yarn start
```

and open [localhost:1234](http://localhost:1234).

To typecheck the example run `yarn build:watch` at the root of this repo. Some
of the examples also have tests that can be run with `yarn test`.

## Architecture

This is a [monorepo](https://en.wikipedia.org/wiki/Monorepo). Published packages
are in `packages/`. Example apps that use the framework are in `examples/`.

## Developing

- Checkout this repo.
- Run `yarn` at the root.
- Run `yarn build:watch` to build all the TypeScript. Check this console for
  type errors.
- Fix linting errors with `yarn lint --fix`.
- To run a sanity check over everything, run `yarn verify`.

## Publishing

[lerna](https://github.com/lerna/lerna) is used to publish all packages at the
same time. To publish just run `yarn publish`.

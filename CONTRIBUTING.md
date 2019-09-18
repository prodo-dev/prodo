# Contributing

We are open to any contributions made by the community.

## Bugs and Improvements

We use the [issue tracker](https://github.com/prodo-ai/prodo/issues) to keep
track of bugs and improvements to Prodo and encourage discussion on these issues.

## Development

Prodo is a [monorepo](https://en.wikipedia.org/wiki/Monorepo). Packages are in
`packages/`. Example apps that use the framework are in `examples/`.

Fork, then clone the repo:

```
git clone https://github.com/your-username/prodo.git
```

#### Building

Build all packages and examples with:

```
yarn build
```

This typechecks all TypeScript and converts it to JavaScript. When developing we
recommend building the project in watch mode:

```
yarn build:watch
```

#### Testing and Linting

Typecheck, lint, and test the entire project:

```
yarn verify
```

Only run typechecking and linting:

```
yarn lint
```

To apply suggested linting fixes:

```
yarn lint --fix
```

Only run tests

```
yarn test
```

## Sending a Pull Request

We recommend [opening an issue](https://github.com/prodo-ai/prodo/issues/new)
with a proposal for a new feature before starting on the work. However, we also
welcome pull requests.

The contribution workflow looks like

- Open an new issue in the [issue
  tracker](https://github.com/prodo-ai/prodo/issues/new)
- Fork the repo
- Create a new feature branch based off the `master` branch
- Make sure all tests pass and there are not linting errors
- Submit a pull request, referencing any issues it addresses

Thanks for contributing!

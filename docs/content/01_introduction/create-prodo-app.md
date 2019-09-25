---
title: "Create Prodo App"
order: 4
---

Create a [Prodo](https://prodo.dev) app with zero setup.

```shell
npx create-prodo-app my-app
cd my-app
npm install
npm start
```

# Features

- [Hot module
  replacement](https://webpack.js.org/concepts/hot-module-replacement/)
- Prodo [babel plugin](https://docs.prodo.dev/basics/babel-plugin/)
- Unit tests with [Jest](https://jestjs.io/) and
  [react-testing-library](https://github.com/testing-library/react-testing-library)
- JavaScript or TypeScript

# Creating an App

### npx

```shell
npx create-react-app my-app
```

### npm

```shell
npm init prodo-app my-app
```

### Yarn

```shell
yarn create prodo-app my-app
```

## TypeScript

To create an app with TypeScript, pass the `--typescript` flag to any of the
above commands.

```
npx create-prodo-app my-app --typescript
```

## Installing Dependencies

Navigate to your apps' directory and run either `npm install` or `yarn`.

```shell
cd my-app
npm install
```

# Running Your App

```shell
npm start
```

This will run the app in development mode. Open
[localhost:8080](http://localhost:8080) to view your app.

# Testing Your App

```shell
npm test
```

This will run the unit tests found in `tests/`.

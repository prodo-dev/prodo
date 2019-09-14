# Docs

Docs are available in `content/`. The docs site is built with
[GatsbyJS](https://www.gatsbyjs.org/).

To start the docs run `yarn start` from this directory.

## Table of Contents

- Introduction
  - philosophy, why does it exist
  - comparisons to redux, mobx, etc
  - docs use typescript
  - introduce transpiler
  - faq
  - community
- Getting Started
  - hello world
  - how to create a new project and get started
  - use create prodo app (or just clone repo)
  - walk through
    - create model with state type
    - render app with ProdoProvider (ReactDOM.render)
    - create component that watches state
    - create action that modifies state
    - dispatch action from component
- Examples
- Components
  - how to use state
  - watching stuff
  - dispatching actions
  - everything you can access here
- Actions
  - explain immer and modifying state
  - child actions and dispatch scheduling
- Testing
  - just use jest
  - testing actions
  - testing components
    - react-testing-library
- Plugins
  - (maybe use local plugin as example in this section)
  - how to add to model (types and such)
  - exporting more things from `model.ctx`
  - explain how they inject things to action/component
  - links to example plugins
  - how to write a plugin
    - ctxs/universe/watchers/etc
- Prodo plugins
  - Effects
  - Local
  - Streams
  - Routing
  - Firestore

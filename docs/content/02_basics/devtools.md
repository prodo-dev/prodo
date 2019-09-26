---
title: "Developer Tools"
order: 8
---

# Installation

Add the devtools plugin to your application so that your app and the devtools can communicate properly. You can find details [here](https://docs.prodo.dev/plugins/devtools/).

Once you have installed the developer tools and turned them on as described above, they will appear to the side of your application when you start it up as normal. If you want to hide them, just toggle `devtools` to `false`.

We are planning to add options to run the developer tools in a different way, for example as a browser extension. If that interests you, please let us know.

# Panels

## State

This panel shows the complete current internal state of your application.
It is interactive; if you change the state in the panel, your application will reflect the changes.

## Action Log

This panel shows all the actions triggered in your application in chronological order. You can also find a lot of metadata about each action, for example origin, arguments, state patches, and any recorded effects, re-renders or next actions that were triggered.

## Render Log

This panel helps you see which of your components got re-rendered, how often and why. You can use this to debug your application's performance.

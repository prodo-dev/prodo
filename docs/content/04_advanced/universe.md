---
title: "Universe"
order: 2
---

An important concept for plugins is the universe. The universe is an object on
the store that can be subscribed to by components. Any nested path on this object
can be subscribed to and when the data at that path changes, a component
re-render is triggered. In `@prodo/core` there is only a single element in the
universe, the `state`. However, plugins have the ability to add properties that can
also be subscribed to. For example, the local plugin adds a `local` property that
can be watched by components.

When any part of the universe is modified in an action, the framework will check
if any components are subscribed to the modified path. Any components that are
subscribed are re-rendered. See [below](#prepare-view-context) for the various
methods plugin authors can use to subscribe a component to part of the universe.

The universe should **always be serializable** as it may be stored to disk by
the devtools.

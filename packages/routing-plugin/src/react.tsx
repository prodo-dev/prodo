import { connect } from "@prodo/core";
import * as pathToRegexp from "path-to-regexp";
import * as React from "react";

const cache = {};
const cacheLimit = 1000;
let cacheCount = 0;

const compilePattern = (
  pattern: string,
  options: pathToRegexp.RegExpOptions,
) => {
  const optionKey = `${options.end}.${options.strict}.${options.sensitive}`;
  const optionCache = cache[optionKey] || (cache[optionKey] = {});

  if (optionCache[pattern]) {
    return optionCache[pattern];
  }

  const keys = [];
  const regex = pathToRegexp(pattern, keys, options);
  const result = { keys, regex };

  if (cacheCount < cacheLimit) {
    optionCache[pattern] = result;
    cacheCount++;
  }

  return result;
};

const routeMatches = (
  path: string,
  pattern: string,
  exact: boolean = false,
) => {
  const options = { end: exact, strict: false, sensitive: false };
  const { regex, keys } = compilePattern(pattern, options);

  const match = regex.exec(path);
  if (match == null) {
    return null;
  }

  const [url, ...values] = match;
  const isExact = url === path;

  if (exact && !isExact) {
    return null;
  }

  return keys.reduce(
    (acc, key, index) => ({ ...acc, [key.name]: values[index] }),
    {},
  );
};

export interface RouteProps {
  path: string;
  exact?: boolean;
  component?: React.ComponentType;
  children?: React.ReactNode;
}

export const Route = connect(
  ({ route, watch }) => ({
    path,
    exact,
    children,
    component,
  }: RouteProps): React.ReactElement => {
    const match = routeMatches(watch(route.path), path, exact);
    if (match != null) {
      if (children && React.Children.count(children) > 0) {
        return <>{children}</>;
      } else if (component != null) {
        return React.createElement(component, match);
      }
    }
    return null;
  },
);

export const Switch = connect(
  ({ route, watch }) => ({ children }: { children: React.ReactNode }) => {
    let element = null;
    React.Children.forEach(children, child => {
      if (element == null && React.isValidElement(child)) {
        const path = child.props.path;
        if (path != null) {
          if (routeMatches(watch(route.path), path, child.props.exact)) {
            element = child;
          }
        } else {
          element = child;
        }
      }
    });

    return element && React.cloneElement(element, {});
  },
);

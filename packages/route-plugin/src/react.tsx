import { connect } from "@prodo/core";
import * as pathToRegexp from "path-to-regexp";
import * as React from "react";
import * as actions from "./actions";
import { RouteParams } from "./types";
import { createParamString } from "./utils";

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
  path?: string;
  exact?: boolean;
  component?: React.ComponentType<any>;
  children?: React.ReactNode;
}

export const Route = connect(
  ({ route, watch }) => ({
    path,
    exact,
    children,
    component,
  }: RouteProps): React.ReactElement => {
    const match =
      path == null ? {} : routeMatches(watch(route.path), path, exact);
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

export const Redirect = connect(
  ({ dispatch }) => ({
    push = false,
    to,
  }: {
    push?: boolean;
    to: RouteParams;
  }) => {
    const action = push ? actions.push : actions.replace;
    React.useEffect(() => {
      dispatch(action)(to);
    }, [to.path, to.params]);
    return null;
  },
);

const Anchor = ({ onClick, navigate, ...rest }: any) => (
  <a
    {...rest}
    onClick={e => {
      try {
        if (onClick) {
          onClick(e);
        }
      } catch (ex) {
        e.preventDefault();
        throw ex;
      }
      if (
        !e.defaultPrevented &&
        e.button === 0 &&
        (rest.target || rest.target === "_self") &&
        !e.metaKey &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        navigate();
      }
    }}
  />
);

export const Link = connect(
  ({ dispatch }) => ({
    component = Anchor,
    replace = false,
    to,
    ...rest
  }: {
    component?: React.ComponentType;
    replace?: boolean;
    to: RouteParams;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return React.createElement(component, {
      ...rest,
      href: `${to.path}${
        to.params != null && Object.keys(to.params).length > 0
          ? createParamString(to.params)
          : ""
      }`,
      navigate: () => {
        const action = replace ? actions.replace : actions.push;
        dispatch(action)(to);
      },
    } as any);
  },
);

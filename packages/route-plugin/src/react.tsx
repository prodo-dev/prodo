import { connect } from "@prodo/core";
import * as React from "react";
import { RouteParams } from "./types";
import { createParamString, matchRoute } from "./utils";
import { push, replace } from "./plugin";

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
  }: RouteProps): React.ReactElement | null => {
    const match =
      path == null ? {} : matchRoute(watch(route.path), path, exact);
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
    let element: React.ReactNode | null = null;
    React.Children.forEach(children, (child: React.ReactNode) => {
      if (element == null && React.isValidElement(child)) {
        const path = child.props.path;
        if (path != null) {
          if (matchRoute(watch(route.path), path, child.props.exact)) {
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
    to: RouteParams | string;
  }) => {
    if (typeof to === "string") {
      to = { path: to };
    }
    if (to.params == null) {
      to.params = {};
    }
    const action = push ? push : replace;
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
        (!rest.target || rest.target === "_self") &&
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
    to: string | RouteParams;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (typeof to === "string") {
      to = { path: to, params: {} };
    }
    if (to.params == null) {
      to.params = {};
    }
    return React.createElement(component, {
      ...rest,
      href: `${to.path}${
        Object.keys(to.params).length > 0 ? createParamString(to.params) : ""
      }`,
      navigate: () => {
        const action = replace ? replace : push;
        dispatch(action)(to);
      },
    } as any);
  },
);

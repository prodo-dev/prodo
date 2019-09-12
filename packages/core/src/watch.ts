import logger from "./logger";
import { Event, Node, Store, WatchTree } from "./types";
import { splitPath } from "./utils";

export const subscribe = (
  store: Store<any, any>,
  path: string[],
  node: Node,
) => {
  // root tree
  let tree: WatchTree = store.watchTree;
  tree.subs.add(node);

  // watching the entire state
  if (path.length === 0) {
    tree.esubs.add(node);
    return;
  }

  // add node to subs of all child trees
  path.forEach(key => {
    if (!tree.children[key]) {
      tree.children[key] = {
        subs: new Set(),
        esubs: new Set(),
        children: {},
      };
    }

    tree = tree.children[key];
    tree.subs.add(node);
  });

  // add node to esubs of exact part of state tree that was subscribed
  tree.esubs.add(node);
};

export const unsubscribe = (
  store: Store<any, any>,
  path: string[],
  node: Node,
) => {
  let tree: WatchTree = store.watchTree;

  tree.subs.delete(node);
  if (path.length === 0) {
    tree.esubs.delete(node);
    return;
  }

  for (const pathKey of path) {
    const prev = tree;

    tree = tree.children[pathKey];

    if (node.unsubscribe) {
      node.unsubscribe({
        name: node.name,
        compId: node.compId,
      });
    }

    tree.subs.delete(node);

    // there are no more subscribers to children of this tree
    // cut the branch
    if (tree.subs.size === 0) {
      delete prev.children[pathKey];
      break;
    }
  }

  tree.esubs.delete(node);
};

export const get = (universe: any, pathKey: string): any =>
  splitPath(pathKey).reduce((x: any, y: any) => x && x[y], universe);

export const submitPatches = (
  store: Store<any, any>,
  universe: any,
  event: Event,
) => {
  const callbacksSet = new Set<Node>();
  const { patches } = event;

  patches.forEach(({ path }) => {
    let subtree = store.watchTree;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < path.length; i += 1) {
      const key = path[i];
      if (!subtree.children[key]) {
        break;
      }

      subtree = subtree.children[key];
      Array.from(i === path.length - 1 ? subtree.subs : subtree.esubs).forEach(
        x => callbacksSet.add(x),
      );
    }
  });

  const comps: { [key: string]: any } = {};
  const compIds: number[] = [];
  Array.from(callbacksSet)
    .sort((x: Node, y: Node) => x.compId - y.compId)
    .forEach((x: Node) => {
      if (!comps[x.compId]) {
        compIds.push(x.compId);
        comps[x.compId] = {
          setState: x.setState,
          status: x.status,
          name: x.name,
          newValues: {},
        };
      }

      comps[x.compId.toString()].newValues[x.pathKey] = get(
        universe,
        x.pathKey,
      );
    });

  logger.info("[update cycle]", comps);

  event.rerender = {};
  Object.keys(comps).forEach(compId => {
    const { setState, name, newValues, status } = comps[compId];
    if (!status.unmounted) {
      event.rerender![comps[compId].name] = true;
      logger.info(`[upcoming state update] ${name}`, newValues, status);
      setState(newValues);
    }
  });
};

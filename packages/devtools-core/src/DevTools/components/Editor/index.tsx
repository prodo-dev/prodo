import * as React from "react";

const MAX_LOAD_EDITOR_COUNT = 100;

const wait = (delay: number) =>
  new Promise(resolve => setTimeout(resolve, delay));

const loadEditor = async (count: number = 0) => {
  if (count > MAX_LOAD_EDITOR_COUNT) {
    return { default: () => <div>Editor not available</div> };
  }

  if ((window as any).monaco) {
    return import("./editor");
  }

  await wait(100);
  return loadEditor(count + 1);
};

const Editor = React.lazy(() => loadEditor());

export default (props: any) => (
  <React.Suspense fallback={<div />}>
    <Editor {...props} />
  </React.Suspense>
);

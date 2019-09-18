import * as React from "react";

export const findCheckboxes = (text: string) => {
  const checkboxes = text.match(/\[(\s|x)\]/g) || [];
  const checked = checkboxes.filter(checkbox => checkbox === "[x]").length;
  return { total: checkboxes.length, checked };
};

export const usePrevValue = <T>(object: T) => {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = object;
  }, [object]);
  return ref.current;
};

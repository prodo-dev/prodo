import * as shortid from "shortid";

export const findCheckboxes = (text: string) => {
  const checkboxes = text.match(/\[(\s|x)\]/g) || [];
  const checked = checkboxes.filter(checkbox => checkbox === "[x]").length;
  return { total: checkboxes.length, checked };
};

export const generateId = () => {
  return shortid.generate();
};

const isElementEditable = (element: HTMLElement) => {
  if (element.isContentEditable === false) return false;

  if (element.firstChild) return isElementEditable(element.firstChild as HTMLElement);

  return true;
};

export default isElementEditable;

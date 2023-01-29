const getElementTextRepresentation = (element: HTMLSpanElement) => {
  let output = '';

  const plaintextValue = element?.dataset?.plaintextKeybind;

  if (plaintextValue) {
    const childRepresentations = Array
      .from(element.childNodes)
      .map((child) => getElementTextRepresentation(child as HTMLSpanElement))
      .join('');

    output = `${plaintextValue}${childRepresentations}${plaintextValue}`;
  } else {
    output = element.textContent || '';
  }

  return output;
};

const getTextRepresentation = (element: HTMLSpanElement) => {
  return Array
    .from(element.childNodes)
    .map((child) => getElementTextRepresentation(child as HTMLSpanElement))
    .join('');
};

export default getTextRepresentation;

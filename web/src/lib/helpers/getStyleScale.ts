import React from 'react';

/**
 * Get the scale of a style property of an element in pixels
 * @param element The element to get the style scale from
 * @param style The css style property to get the scale from
 * @returns The scale of the style property in pixels
 */
const getStyleScale = (
  element: HTMLElement,
  style: keyof React.CSSProperties
) => (
  +window
    .getComputedStyle(element)
    .getPropertyValue(style.replace(/([A-Z])/g, '-$1'))
    .toLowerCase()
    .replace('px', '')
);

export default getStyleScale;

const changeIndex = (originalArray: unknown[], currentItemIndex: number, newItemIndex: number) => {
  originalArray.splice(newItemIndex, 0, originalArray[currentItemIndex]);
  originalArray.splice(currentItemIndex, 1);

  return originalArray;
};

export default changeIndex;

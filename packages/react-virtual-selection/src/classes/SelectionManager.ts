import { MutableRefObject, Dispatch, SetStateAction } from 'react';

class SelectionManger {
  private static instance: SelectionManger;

  private selectables: {
    [key: string]: {
      selectableRef: MutableRefObject<unknown>,
      item: () => unknown,
      setSelected: React.Dispatch<React.SetStateAction<boolean>>,
    }[]
  } = {};

  public selectableWatchers: {[key: string]: Dispatch<SetStateAction<unknown[]>>[]} = {};

  public static get Instance() {
    if (this.instance) return this.instance;

    this.instance = new this();
    return this.instance;
  }

  public getSelected(
    selector: { top: number; bottom: number, left: number, right: number },
    type: string,
  ) {
    const {
      top: selectorTop,
      bottom: selectorBottom,
      left: selectorLeft,
      right: selectorRight,
    } = selector;

    return this.selectables[type].map((selectableItem) => {
      const { selectableRef } = selectableItem;
      const {
        left,
        right,
        top,
        bottom,
      } = (selectableRef as MutableRefObject<HTMLElement>).current.getBoundingClientRect();

      return ({
        isSelected: (left <= selectorRight)
        && (right >= selectorLeft)
        && (top <= selectorBottom)
        && (bottom >= selectorTop),
        selectableItem,
      });
    });
  }

  public highlightSelected(
    selector: { top: number; bottom: number, left: number, right: number },
    type: string,
  ) {
    this.getSelected(selector, type).forEach(
      ({ isSelected, selectableItem }) => selectableItem.setSelected(isSelected),
    );
  }

  public clearSelectable(type: string) {
    this.selectables[type].every(({ setSelected }) => setSelected(false));
  }

  public addToSelectable(
    selectable: React.MutableRefObject<unknown>,
    type: string,
    item: () => unknown,
    setSelected: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    if (!this.selectables[type]) this.selectables[type] = [];

    this.selectables[type].push({
      selectableRef: selectable,
      item,
      setSelected,
    });
  }

  public removeFromSelectable(
    removedSelectableRef: React.MutableRefObject<unknown>,
    type: string,
  ) {
    const index = this.selectables[type].findIndex(
      ({ selectableRef: s }) => s === removedSelectableRef,
    );

    if (index === -1) return;

    this.selectables[type].splice(index, 1);
  }

  public registerSelectableWatcher(
    type: string,
    func: Dispatch<SetStateAction<unknown[]>>,
  ) {
    if (!this.selectableWatchers[type]) this.selectableWatchers[type] = [];

    this.selectableWatchers[type].push(func);
  }
}

export default SelectionManger;

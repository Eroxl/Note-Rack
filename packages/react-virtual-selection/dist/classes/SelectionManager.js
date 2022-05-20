"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectionManger {
    constructor() {
        this.selectables = {};
        this.selectableWatchers = {};
    }
    static get Instance() {
        if (this.instance)
            return this.instance;
        this.instance = new this();
        return this.instance;
    }
    getSelected(selector, type) {
        const { top: selectorTop, bottom: selectorBottom, left: selectorLeft, right: selectorRight, } = selector;
        return this.selectables[type].map((selectableItem) => {
            const { selectableRef } = selectableItem;
            const { left, right, top, bottom, } = selectableRef.current.getBoundingClientRect();
            return ({
                isSelected: (left <= selectorRight)
                    && (right >= selectorLeft)
                    && (top <= selectorBottom)
                    && (bottom >= selectorTop),
                selectableItem,
            });
        });
    }
    highlightSelected(selector, type) {
        this.getSelected(selector, type).forEach(({ isSelected, selectableItem }) => selectableItem.setSelected(isSelected));
    }
    clearSelectable(type) {
        this.selectables[type].every(({ setSelected }) => setSelected(false));
    }
    addToSelectable(selectable, type, item, setSelected) {
        if (!this.selectables[type])
            this.selectables[type] = [];
        this.selectables[type].push({
            selectableRef: selectable,
            item,
            setSelected,
        });
    }
    removeFromSelectable(removedSelectableRef, type) {
        const index = this.selectables[type].findIndex(({ selectableRef: s }) => s === removedSelectableRef);
        if (index === -1)
            return;
        this.selectables[type].splice(index, 1);
    }
    registerSelectableWatcher(type, func) {
        if (!this.selectableWatchers[type])
            this.selectableWatchers[type] = [];
        this.selectableWatchers[type].push(func);
    }
}
exports.default = SelectionManger;
//# sourceMappingURL=SelectionManager.js.map
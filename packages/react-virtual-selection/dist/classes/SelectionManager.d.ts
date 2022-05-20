import { MutableRefObject, Dispatch, SetStateAction } from 'react';
declare class SelectionManger {
    private static instance;
    private selectables;
    selectableWatchers: {
        [key: string]: Dispatch<SetStateAction<unknown[]>>[];
    };
    static get Instance(): SelectionManger;
    getSelected(selector: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }, type: string): {
        isSelected: boolean;
        selectableItem: {
            selectableRef: MutableRefObject<unknown>;
            item: () => unknown;
            setSelected: Dispatch<SetStateAction<boolean>>;
        };
    }[];
    highlightSelected(selector: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }, type: string): void;
    clearSelectable(type: string): void;
    addToSelectable(selectable: React.MutableRefObject<unknown>, type: string, item: () => unknown, setSelected: React.Dispatch<React.SetStateAction<boolean>>): void;
    removeFromSelectable(removedSelectableRef: React.MutableRefObject<unknown>, type: string): void;
    registerSelectableWatcher(type: string, func: Dispatch<SetStateAction<unknown[]>>): void;
}
export default SelectionManger;
//# sourceMappingURL=SelectionManager.d.ts.map
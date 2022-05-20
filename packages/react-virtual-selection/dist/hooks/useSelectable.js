"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SelectionManager_1 = __importDefault(require("../classes/SelectionManager"));
const useSelectable = (type, item) => {
    const [selected, setSelected] = (0, react_1.useState)(false);
    const selectableRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        SelectionManager_1.default.Instance.addToSelectable(selectableRef, type, item, setSelected);
        return () => SelectionManager_1.default.Instance.removeFromSelectable(selectableRef, type);
    });
    return [selected, selectableRef];
};
exports.default = useSelectable;
//# sourceMappingURL=useSelectable.js.map
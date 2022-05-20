"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const SelectionManager_1 = __importDefault(require("../classes/SelectionManager"));
const useSelectionCollector = (type) => {
    const [selectionData, setSelectionData] = (0, react_1.useState)([]);
    SelectionManager_1.default.Instance.registerSelectableWatcher(type, setSelectionData);
    return selectionData;
};
exports.default = useSelectionCollector;
//# sourceMappingURL=useSelectionCollector.js.map
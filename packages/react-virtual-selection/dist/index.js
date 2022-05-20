"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionManager = exports.Selectable = exports.useSelectionCollector = exports.useSelectable = void 0;
// -=- Hooks -=-
const useSelectable_1 = __importDefault(require("./hooks/useSelectable"));
exports.useSelectable = useSelectable_1.default;
const useSelectionCollector_1 = __importDefault(require("./hooks/useSelectionCollector"));
exports.useSelectionCollector = useSelectionCollector_1.default;
const Selectable_1 = __importDefault(require("./components/Selectable"));
exports.Selectable = Selectable_1.default;
const SelectionManager_1 = __importDefault(require("./classes/SelectionManager"));
exports.SelectionManager = SelectionManager_1.default;
//# sourceMappingURL=index.js.map
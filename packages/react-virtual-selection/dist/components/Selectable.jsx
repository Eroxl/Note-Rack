"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable jsx-a11y/no-static-element-interactions */
const react_1 = __importStar(require("react"));
const SelectionManager_1 = __importDefault(require("../classes/SelectionManager"));
const Selectable = (props) => {
    const { children, accepts, selectionClassName, selectionStyle, } = props;
    const [isSelecting, setIsSelecting] = (0, react_1.useState)(false);
    const [selectionArea, setSelectionArea] = (0, react_1.useState)({
        startY: 0,
        endY: 0,
        startX: 0,
        endX: 0,
    });
    const selectableRef = (0, react_1.useRef)(null);
    const selectionManager = SelectionManager_1.default.Instance;
    return (<div ref={selectableRef} onMouseMove={(e) => {
            if (!isSelecting || !accepts)
                return;
            const { clientX, clientY } = e;
            setSelectionArea(Object.assign(Object.assign({}, selectionArea), { endY: clientY, endX: clientX }));
            selectionManager.highlightSelected({
                top: Math.min(selectionArea.startY, clientY),
                left: Math.min(selectionArea.startX, clientX),
                bottom: Math.max(selectionArea.startY, clientY),
                right: Math.max(selectionArea.startX, clientX),
            }, accepts);
        }} onMouseDown={(e) => {
            setIsSelecting(true);
            const { clientX, clientY } = e;
            setSelectionArea({
                startY: clientY,
                endY: clientY,
                startX: clientX,
                endX: clientX,
            });
            selectionManager.highlightSelected({
                top: clientY,
                left: clientX,
                bottom: clientY,
                right: clientX,
            }, accepts);
        }} onMouseUp={() => {
            setIsSelecting(false);
            const selectedElements = selectionManager.getSelected({
                top: Math.min(selectionArea.startY, selectionArea.endY),
                left: Math.min(selectionArea.startX, selectionArea.endX),
                bottom: Math.max(selectionArea.startY, selectionArea.endY),
                right: Math.max(selectionArea.startX, selectionArea.endX),
            }, accepts).filter(({ isSelected }) => isSelected).map((el) => el.selectableItem.item);
            const selectedItemsData = selectedElements.map((el) => el());
            selectionManager.selectableWatchers[accepts].forEach((watcher) => {
                watcher(selectedItemsData);
            });
        }} draggable={false}>
      {children}
      {isSelecting && (<div draggable={false} className={selectionClassName} style={Object.assign(Object.assign({ position: 'absolute', backgroundColor: '#fff', opacity: 0.4 }, selectionStyle), { top: Math.min(selectionArea.startY, selectionArea.endY), left: Math.min(selectionArea.startX, selectionArea.endX), width: Math.abs(selectionArea.startX - selectionArea.endX), height: Math.abs(selectionArea.startY - selectionArea.endY) })}/>)}
    </div>);
};
exports.default = Selectable;
//# sourceMappingURL=Selectable.jsx.map
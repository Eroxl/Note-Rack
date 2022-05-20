"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _react = _interopRequireDefault(require("react"));
var _useSelectable = _interopRequireDefault(require("../../hooks/useSelectable"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ExampleSelectable = (props)=>{
    const { exampleData  } = props;
    const [isSelected, selectableElement] = (0, _useSelectable).default('selectable-1', ()=>({
            exampleData
        })
    );
    return /*#__PURE__*/ (0, _jsxRuntime).jsx("div", {
        draggable: false,
        className: `w-full h-full bg-gray-600 ${isSelected && 'outline outline-green-300'}`,
        ref: selectableElement
    });
};
var _default = ExampleSelectable;
exports.default = _default;

//# sourceMappingURL=ExampleSelectable.js.map
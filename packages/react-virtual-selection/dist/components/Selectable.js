"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _react = _interopRequireWildcard(require("react"));
var _selectionManager = _interopRequireDefault(require("../classes/SelectionManager"));
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
const Selectable = (props)=>{
    const { children , accepts , selectionClassName , selectionStyle ,  } = props;
    const [isSelecting, setIsSelecting] = (0, _react).useState(false);
    const [selectionArea, setSelectionArea] = (0, _react).useState({
        startY: 0,
        endY: 0,
        startX: 0,
        endX: 0
    });
    const selectableRef = (0, _react).useRef(null);
    const selectionManager = _selectionManager.default.Instance;
    return /*#__PURE__*/ (0, _jsxRuntime).jsxs("div", {
        ref: selectableRef,
        onMouseMove: (e)=>{
            if (!isSelecting || !accepts) return;
            const { clientX , clientY  } = e;
            setSelectionArea(_objectSpread({}, selectionArea, {
                endY: clientY,
                endX: clientX
            }));
            selectionManager.highlightSelected({
                top: Math.min(selectionArea.startY, clientY),
                left: Math.min(selectionArea.startX, clientX),
                bottom: Math.max(selectionArea.startY, clientY),
                right: Math.max(selectionArea.startX, clientX)
            }, accepts);
        },
        onMouseDown: (e)=>{
            setIsSelecting(true);
            const { clientX , clientY  } = e;
            setSelectionArea({
                startY: clientY,
                endY: clientY,
                startX: clientX,
                endX: clientX
            });
            selectionManager.highlightSelected({
                top: clientY,
                left: clientX,
                bottom: clientY,
                right: clientX
            }, accepts);
        },
        onMouseUp: ()=>{
            setIsSelecting(false);
            const selectedElements = selectionManager.getSelected({
                top: Math.min(selectionArea.startY, selectionArea.endY),
                left: Math.min(selectionArea.startX, selectionArea.endX),
                bottom: Math.max(selectionArea.startY, selectionArea.endY),
                right: Math.max(selectionArea.startX, selectionArea.endX)
            }, accepts).filter(({ isSelected  })=>isSelected
            ).map((el)=>el.selectableItem.item
            );
            const selectedItemsData = selectedElements.map((el)=>el()
            );
            selectionManager.selectableWatchers[accepts].forEach((watcher)=>{
                watcher(selectedItemsData);
            });
        },
        draggable: false,
        children: [
            children,
            isSelecting && /*#__PURE__*/ (0, _jsxRuntime).jsx("div", {
                draggable: false,
                className: selectionClassName,
                style: _objectSpread({
                    position: 'absolute',
                    backgroundColor: '#fff',
                    opacity: 0.4
                }, selectionStyle, {
                    top: Math.min(selectionArea.startY, selectionArea.endY),
                    left: Math.min(selectionArea.startX, selectionArea.endX),
                    width: Math.abs(selectionArea.startX - selectionArea.endX),
                    height: Math.abs(selectionArea.startY - selectionArea.endY)
                })
            })
        ]
    });
};
var _default = Selectable;
exports.default = _default;

//# sourceMappingURL=Selectable.js.map
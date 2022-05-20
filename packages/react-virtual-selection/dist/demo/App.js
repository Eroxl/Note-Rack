"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _jsxRuntime = require("react/jsx-runtime");
var _react = _interopRequireWildcard(require("react"));
var _useSelectionCollector = _interopRequireDefault(require("../hooks/useSelectionCollector"));
var _selectable = _interopRequireDefault(require("../components/Selectable"));
var _exampleSelectable = _interopRequireDefault(require("./components/ExampleSelectable"));
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
const App = ()=>{
    const selectionData = (0, _useSelectionCollector).default('selectable-1');
    (0, _react).useEffect(()=>{
        // eslint-disable-next-line no-console
        console.log(selectionData);
    }, [
        selectionData
    ]);
    return /*#__PURE__*/ (0, _jsxRuntime).jsx(_selectable.default, {
        accepts: "selectable-1",
        children: /*#__PURE__*/ (0, _jsxRuntime).jsx("div", {
            className: "w-screen h-screen bg-gray-700",
            children: /*#__PURE__*/ (0, _jsxRuntime).jsxs("div", {
                className: "grid w-full h-full grid-flow-row grid-cols-3 gap-10 p-10",
                children: [
                    /*#__PURE__*/ (0, _jsxRuntime).jsx(_exampleSelectable.default, {
                        exampleData: {
                            test: 1
                        }
                    }, "1"),
                    /*#__PURE__*/ (0, _jsxRuntime).jsx(_exampleSelectable.default, {
                        exampleData: {
                            test: 2
                        }
                    }, "2"),
                    /*#__PURE__*/ (0, _jsxRuntime).jsx(_exampleSelectable.default, {
                        exampleData: {
                            test: 3
                        }
                    }, "3"),
                    /*#__PURE__*/ (0, _jsxRuntime).jsx(_exampleSelectable.default, {
                        exampleData: {
                            test: 4
                        }
                    }, "4"),
                    /*#__PURE__*/ (0, _jsxRuntime).jsx(_exampleSelectable.default, {
                        exampleData: {
                            test: 5
                        }
                    }, "5"),
                    /*#__PURE__*/ (0, _jsxRuntime).jsx(_exampleSelectable.default, {
                        exampleData: {
                            test: 6
                        }
                    }, "6"),
                    /*#__PURE__*/ (0, _jsxRuntime).jsx(_exampleSelectable.default, {
                        exampleData: {
                            test: 7
                        }
                    }, "7"),
                    /*#__PURE__*/ (0, _jsxRuntime).jsx(_exampleSelectable.default, {
                        exampleData: {
                            test: 8
                        }
                    }, "8"),
                    /*#__PURE__*/ (0, _jsxRuntime).jsx(_exampleSelectable.default, {
                        exampleData: {
                            test: 9
                        }
                    }, "9")
                ]
            })
        })
    });
};
var _default = App;
exports.default = _default;

//# sourceMappingURL=App.js.map
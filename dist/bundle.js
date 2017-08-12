(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Fusion = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var jsx = function () {
  var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
  return function createRawReactElement(type, props, key, children) {
    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {};
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  };
}();

var asyncIterator = function (iterable) {
  if (typeof Symbol === "function") {
    if (Symbol.asyncIterator) {
      var method = iterable[Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (Symbol.iterator) {
      return iterable[Symbol.iterator]();
    }
  }

  throw new TypeError("Object is not async iterable");
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var asyncGeneratorDelegate = function (inner, awaitWrap) {
  var iter = {},
      waiting = false;

  function pump(key, value) {
    waiting = true;
    value = new Promise(function (resolve) {
      resolve(inner[key](value));
    });
    return {
      done: false,
      value: awaitWrap(value)
    };
  }

  

  if (typeof Symbol === "function" && Symbol.iterator) {
    iter[Symbol.iterator] = function () {
      return this;
    };
  }

  iter.next = function (value) {
    if (waiting) {
      waiting = false;
      return value;
    }

    return pump("next", value);
  };

  if (typeof inner.throw === "function") {
    iter.throw = function (value) {
      if (waiting) {
        waiting = false;
        throw value;
      }

      return pump("throw", value);
    };
  }

  if (typeof inner.return === "function") {
    iter.return = function (value) {
      return pump("return", value);
    };
  }

  return iter;
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineEnumerableProperties = function (obj, descs) {
  for (var key in descs) {
    var desc = descs[key];
    desc.configurable = desc.enumerable = true;
    if ("value" in desc) desc.writable = true;
    Object.defineProperty(obj, key, desc);
  }

  return obj;
};

var defaults = function (obj, defaults) {
  var keys = Object.getOwnPropertyNames(defaults);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = Object.getOwnPropertyDescriptor(defaults, key);

    if (value && value.configurable && obj[key] === undefined) {
      Object.defineProperty(obj, key, value);
    }
  }

  return obj;
};

var defineProperty = function (obj, key, value) {
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
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var _instanceof = function (left, right) {
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
};

var interopRequireDefault = function (obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
};

var interopRequireWildcard = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj.default = obj;
    return newObj;
  }
};

var newArrowCheck = function (innerThis, boundThis) {
  if (innerThis !== boundThis) {
    throw new TypeError("Cannot instantiate an arrow function");
  }
};

var objectDestructuringEmpty = function (obj) {
  if (obj == null) throw new TypeError("Cannot destructure undefined");
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var selfGlobal = typeof global === "undefined" ? self : global;

var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var slicedToArrayLoose = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else if (Symbol.iterator in Object(arr)) {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  } else {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
};

var taggedTemplateLiteral = function (strings, raw) {
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
};

var taggedTemplateLiteralLoose = function (strings, raw) {
  strings.raw = raw;
  return strings;
};

var temporalRef = function (val, name, undef) {
  if (val === undef) {
    throw new ReferenceError(name + " is not defined - temporal dead zone");
  } else {
    return val;
  }
};

var temporalUndefined = {};

var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};



var babelHelpers$1 = Object.freeze({
	jsx: jsx,
	asyncIterator: asyncIterator,
	asyncGenerator: asyncGenerator,
	asyncGeneratorDelegate: asyncGeneratorDelegate,
	asyncToGenerator: asyncToGenerator,
	classCallCheck: classCallCheck,
	createClass: createClass,
	defineEnumerableProperties: defineEnumerableProperties,
	defaults: defaults,
	defineProperty: defineProperty,
	get: get,
	inherits: inherits,
	interopRequireDefault: interopRequireDefault,
	interopRequireWildcard: interopRequireWildcard,
	newArrowCheck: newArrowCheck,
	objectDestructuringEmpty: objectDestructuringEmpty,
	objectWithoutProperties: objectWithoutProperties,
	possibleConstructorReturn: possibleConstructorReturn,
	selfGlobal: selfGlobal,
	set: set,
	slicedToArray: slicedToArray,
	slicedToArrayLoose: slicedToArrayLoose,
	taggedTemplateLiteral: taggedTemplateLiteral,
	taggedTemplateLiteralLoose: taggedTemplateLiteralLoose,
	temporalRef: temporalRef,
	temporalUndefined: temporalUndefined,
	toArray: toArray,
	toConsumableArray: toConsumableArray,
	typeof: _typeof,
	extends: _extends,
	instanceof: _instanceof
});

/**
*   @author }{yellow 2017/4/18
*   @returns {Object} 合并后对象
*/

/**
 * @func
 */
var merge = function merge() {
  var _babelHelpers;

  for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return (_babelHelpers = babelHelpers$1).extends.apply(_babelHelpers, [{}].concat(sources));
};

var merge_1 = merge;

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var isFunction_1 = createCommonjsModule(function (module) {
  /**
   * reference:
   *  http://www.css88.com/doc/underscore/docs/underscore.html
   */

  var isFunction = function isFunction(func) {
    return typeof func == 'function';
    // return toString.call(obj) === '[object Function]';
  };

  module.exports = isFunction;
});

/**
 * reference:
 * https://github.com/uber/luma.gl/blob/master/src/utils/is-browser.js
 */
var isNode = (typeof process === 'undefined' ? 'undefined' : _typeof(process)) === 'object' && String(process) === '[object process]' && !process.browser;

var isNode_1 = isNode;

/**
 * 解决js不能重载函数问题
 * refernece:
 * http://www.cnblogs.com/yugege/p/5539020.html
 */
/**
 * @func
 * @param {Object} ctx
 * @param {string} funcName,
 * @param {Function} fn
 */

var isObject_1 = createCommonjsModule(function (module) {
  /**
   * reference:
   * http://www.css88.com/doc/underscore/docs/underscore.html
   * 
   */

  var isObject = function isObject(obj) {
    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
    return type === 'function' || type === 'object' && !!obj;
  };

  module.exports = isObject;
});

var isString_1 = createCommonjsModule(function (module) {
  /**
   * reference:
   *  http://www.css88.com/doc/underscore/docs/underscore.html
   */

  var isString = function isString(str) {
    return typeof str == 'string' && str.constructor == String;
  };

  module.exports = isString;
});

var stamp_1 = createCommonjsModule(function (module) {
    /**
     * assign kiwi.gl object to be an unique id in the global
     * @author yellow 2017/5/26
     */

    var prefix = '_fusion_',
        prefixId = prefix + 'id_';

    var i = 1;

    var getId = function getId() {
        return prefixId + i++;
    };

    var setId = function setId(obj, id) {
        isObject_1(obj) && isString_1(id) ? obj._fusion_id_ = id : null;
    };

    /**
     * get the unique id
     * @method stamp
     * @param {Object} obj 
     * @return {String} error if returned 'null'
     */
    var stamp = function stamp(obj) {
        if (isObject_1(obj)) {
            obj._fusion_id_ = obj._fusion_id_ || getId();
            return obj._fusion_id_;
        } else if (isString_1(obj)) {
            return prefix + obj;
        } else return null;
    };

    module.exports = { stamp: stamp, prefix: prefix, getId: getId, setId: setId };
});

/**
 * 设计思路为.net framework 的 IDispose接口
 * 除此之外提供额外的属性：
 * -id
 * -handle
 * -create handle
 * -dispose
 */

var stamp$1 = stamp_1.stamp;

/**
 * @class
 */

var Dispose = function () {
  /**
   * 构建一个可被销毁的资源对象
   */
  function Dispose() {
    classCallCheck(this, Dispose);

    this._id = stamp$1(this);
  }
  /**
   * 资源销毁方法，执行完一段后，统一调用
   * must be implement be child class
   * @abstract
   */


  createClass(Dispose, [{
    key: 'dispose',
    value: function dispose() {
      throw new Error('no implementation of function dispose');
    }
    /**
     * 获取资源id
     */

  }, {
    key: '_createHandle',

    /**
     * 创建资源
     * @abstract
     */
    value: function _createHandle() {
      // arguments.callee.toString();
      throw new Error('no implementation of function _createHandle');
    }
  }, {
    key: 'id',
    get: function get$$1() {
      return this._id;
    }
    /**
     * 获取资源核心对象
     * @readonly
     * @member
     */

  }, {
    key: 'handle',
    get: function get$$1() {
      return this._handle;
    }
  }]);
  return Dispose;
}();

var Dispose_1 = Dispose;

/**
 * reference https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
 * reference https://github.com/uber/luma.gl/blob/master/src/webgl-utils/constants.js
 * reference https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types
 * Store GLEnum value the boost glContext setting
 * webgl2 used within a WebGL2RenderingContext,add GLint64(GLuint64EXT) 
 * @author yellow date 2017/6/15
 */
var GLConstants = {
    /**
     * 深度缓冲，常用与 gl.clear(gl.Enum)
     * Passed to clear to clear the current depth buffer.
     */
    DEPTH_BUFFER_BIT: 0x00000100,
    /**
     * 模版缓冲，常用与 gl.clear(gl.Enum)
     * Passed to clear to clear the current stencil buffer.
     */
    STENCIL_BUFFER_BIT: 0x00000400,
    /**
     * 当前可写的颜色缓冲，常用与 gl.clear(gl.Enum)
     *  Passed to clear to clear the current color buffer.
     */
    COLOR_BUFFER_BIT: 0x00004000, //
    // Rendering primitives
    // Constants passed to drawElements() or drawArrays() to specify what kind of primitive to render.
    POINTS: 0x0000, // Passed to drawElements or drawArrays to draw single points.
    LINES: 0x0001, // Passed to drawElements or drawArrays to draw lines. Each vertex connects to the one after it.
    LINE_LOOP: 0x0002, // Passed to drawElements or drawArrays to draw lines. Each set of two vertices is treated as a separate line segment.
    LINE_STRIP: 0x0003, // Passed to drawElements or drawArrays to draw a connected group of line segments from the first vertex to the last.
    TRIANGLES: 0x0004, // Passed to drawElements or drawArrays to draw triangles. Each set of three vertices creates a separate triangle.
    TRIANGLE_STRIP: 0x0005, // Passed to drawElements or drawArrays to draw a connected group of triangles.
    TRIANGLE_FAN: 0x0006, // Passed to drawElements or drawArrays to draw a connected group of triangles. Each vertex connects to the previous and the first vertex in the fan.
    // Blending modes
    // Constants passed to blendFunc() or blendFuncSeparate() to specify the blending mode (for both, RBG and alpha, or separately).
    ZERO: 0, // Passed to blendFunc or blendFuncSeparate to turn off a component.
    ONE: 1, // Passed to blendFunc or blendFuncSeparate to turn on a component.
    SRC_COLOR: 0x0300, // Passed to blendFunc or blendFuncSeparate to multiply a component by the source elements color.
    ONE_MINUS_SRC_COLOR: 0x0301, // Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source elements color.
    SRC_ALPHA: 0x0302, // Passed to blendFunc or blendFuncSeparate to multiply a component by the source's alpha.
    /**
     * 传递给BleandFunc或BlendFuncSeparate使用，用来指定混合计算颜色时，基于源颜色的aplha所占比。
     * Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the source's alpha.
     */
    ONE_MINUS_SRC_ALPHA: 0x0303,
    DST_ALPHA: 0x0304, // Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's alpha.
    ONE_MINUS_DST_ALPHA: 0x0305, // Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's alpha.
    DST_COLOR: 0x0306, // Passed to blendFunc or blendFuncSeparate to multiply a component by the destination's color.
    ONE_MINUS_DST_COLOR: 0x0307, // Passed to blendFunc or blendFuncSeparate to multiply a component by one minus the destination's color.
    SRC_ALPHA_SATURATE: 0x0308, // Passed to blendFunc or blendFuncSeparate to multiply a component by the minimum of source's alpha or one minus the destination's alpha.
    CONSTANT_COLOR: 0x8001, // Passed to blendFunc or blendFuncSeparate to specify a constant color blend function.
    ONE_MINUS_CONSTANT_COLOR: 0x8002, // Passed to blendFunc or blendFuncSeparate to specify one minus a constant color blend function.
    CONSTANT_ALPHA: 0x8003, // Passed to blendFunc or blendFuncSeparate to specify a constant alpha blend function.
    ONE_MINUS_CONSTANT_ALPHA: 0x8004, // Passed to blendFunc or blendFuncSeparate to specify one minus a constant alpha blend function.
    // Blending equations
    // Constants passed to blendEquation() or blendEquationSeparate() to control
    // how the blending is calculated (for both, RBG and alpha, or separately).
    FUNC_ADD: 0x8006, // Passed to blendEquation or blendEquationSeparate to set an addition blend function.
    FUNC_SUBSTRACT: 0x800A, // Passed to blendEquation or blendEquationSeparate to specify a subtraction blend function (source - destination).
    FUNC_REVERSE_SUBTRACT: 0x800B, // Passed to blendEquation or blendEquationSeparate to specify a reverse subtraction blend function (destination - source).
    // Getting GL parameter information
    // Constants passed to getParameter() to specify what information to return.
    BLEND_EQUATION: 0x8009, // Passed to getParameter to get the current RGB blend function.
    BLEND_EQUATION_RGB: 0x8009, // Passed to getParameter to get the current RGB blend function. Same as BLEND_EQUATION
    BLEND_EQUATION_ALPHA: 0x883D, // Passed to getParameter to get the current alpha blend function. Same as BLEND_EQUATION
    BLEND_DST_RGB: 0x80C8, // Passed to getParameter to get the current destination RGB blend function.
    BLEND_SRC_RGB: 0x80C9, // Passed to getParameter to get the current destination RGB blend function.
    BLEND_DST_ALPHA: 0x80CA, // Passed to getParameter to get the current destination alpha blend function.
    BLEND_SRC_ALPHA: 0x80CB, // Passed to getParameter to get the current source alpha blend function.
    BLEND_COLOR: 0x8005, // Passed to getParameter to return a the current blend color.
    ARRAY_BUFFER_BINDING: 0x8894, // Passed to getParameter to get the array buffer binding.
    ELEMENT_ARRAY_BUFFER_BINDING: 0x8895, // Passed to getParameter to get the current element array buffer.
    LINE_WIDTH: 0x0B21, // Passed to getParameter to get the current lineWidth (set by the lineWidth method).
    ALIASED_POINT_SIZE_RANGE: 0x846D, // Passed to getParameter to get the current size of a point drawn with gl.POINTS
    ALIASED_LINE_WIDTH_RANGE: 0x846E, // Passed to getParameter to get the range of available widths for a line. Returns a length-2 array with the lo value at 0, and hight at 1.
    CULL_FACE_MODE: 0x0B45, // Passed to getParameter to get the current value of cullFace. Should return FRONT, BACK, or FRONT_AND_BACK
    FRONT_FACE: 0x0B46, // Passed to getParameter to determine the current value of frontFace. Should return CW or CCW.
    DEPTH_RANGE: 0x0B70, // Passed to getParameter to return a length-2 array of floats giving the current depth range.
    DEPTH_WRITEMASK: 0x0B72, // Passed to getParameter to determine if the depth write mask is enabled.
    DEPTH_CLEAR_VALUE: 0x0B73, // Passed to getParameter to determine the current depth clear value.
    DEPTH_FUNC: 0x0B74, // Passed to getParameter to get the current depth function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL.
    STENCIL_CLEAR_VALUE: 0x0B91, // Passed to getParameter to get the value the stencil will be cleared to.
    STENCIL_FUNC: 0x0B92, // Passed to getParameter to get the current stencil function. Returns NEVER, ALWAYS, LESS, EQUAL, LEQUAL, GREATER, GEQUAL, or NOTEQUAL.
    STENCIL_FAIL: 0x0B94, // Passed to getParameter to get the current stencil fail function. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
    STENCIL_PASS_DEPTH_FAIL: 0x0B95, // Passed to getParameter to get the current stencil fail function should the depth buffer test fail. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
    STENCIL_PASS_DEPTH_PASS: 0x0B96, // Passed to getParameter to get the current stencil fail function should the depth buffer test pass. Should return KEEP, REPLACE, INCR, DECR, INVERT, INCR_WRAP, or DECR_WRAP.
    STENCIL_REF: 0x0B97, // Passed to getParameter to get the reference value used for stencil tests.
    STENCIL_VALUE_MASK: 0x0B93,
    STENCIL_WRITEMASK: 0x0B98,
    STENCIL_BACK_FUNC: 0x8800,
    STENCIL_BACK_FAIL: 0x8801,
    STENCIL_BACK_PASS_DEPTH_FAIL: 0x8802,
    STENCIL_BACK_PASS_DEPTH_PASS: 0x8803,
    STENCIL_BACK_REF: 0x8CA3,
    STENCIL_BACK_VALUE_MASK: 0x8CA4,
    STENCIL_BACK_WRITEMASK: 0x8CA5,
    VIEWPORT: 0x0BA2, // Returns an Int32Array with four elements for the current viewport dimensions.
    SCISSOR_BOX: 0x0C10, // Returns an Int32Array with four elements for the current scissor box dimensions.
    COLOR_CLEAR_VALUE: 0x0C22,
    COLOR_WRITEMASK: 0x0C23,
    UNPACK_ALIGNMENT: 0x0CF5,
    PACK_ALIGNMENT: 0x0D05,
    MAX_TEXTURE_SIZE: 0x0D33,
    MAX_VIEWPORT_DIMS: 0x0D3A,
    SUBPIXEL_BITS: 0x0D50,
    RED_BITS: 0x0D52,
    GREEN_BITS: 0x0D53,
    BLUE_BITS: 0x0D54,
    ALPHA_BITS: 0x0D55,
    DEPTH_BITS: 0x0D56,
    STENCIL_BITS: 0x0D57,
    POLYGON_OFFSET_UNITS: 0x2A00,
    POLYGON_OFFSET_FACTOR: 0x8038,
    TEXTURE_BINDING_2D: 0x8069,
    SAMPLE_BUFFERS: 0x80A8,
    SAMPLES: 0x80A9,
    SAMPLE_COVERAGE_VALUE: 0x80AA,
    SAMPLE_COVERAGE_INVERT: 0x80AB,
    COMPRESSED_TEXTURE_FORMATS: 0x86A3,
    VENDOR: 0x1F00,
    RENDERER: 0x1F01,
    VERSION: 0x1F02,
    IMPLEMENTATION_COLOR_READ_TYPE: 0x8B9A,
    IMPLEMENTATION_COLOR_READ_FORMAT: 0x8B9B,
    BROWSER_DEFAULT_WEBGL: 0x9244,

    // Buffers
    // Constants passed to bufferData(), bufferSubData(), bindBuffer(), or
    // getBufferParameter().

    STATIC_DRAW: 0x88E4, // Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and not change often.
    STREAM_DRAW: 0x88E0, // Passed to bufferData as a hint about whether the contents of the buffer are likely to not be used often.
    DYNAMIC_DRAW: 0x88E8, // Passed to bufferData as a hint about whether the contents of the buffer are likely to be used often and change often.
    ARRAY_BUFFER: 0x8892, // Passed to bindBuffer or bufferData to specify the type of buffer being used.
    ELEMENT_ARRAY_BUFFER: 0x8893, // Passed to bindBuffer or bufferData to specify the type of buffer being used.
    BUFFER_SIZE: 0x8764, // Passed to getBufferParameter to get a buffer's size.
    BUFFER_USAGE: 0x8765, // Passed to getBufferParameter to get the hint for the buffer passed in when it was created.

    // Vertex attributes
    // Constants passed to getVertexAttrib().

    CURRENT_VERTEX_ATTRIB: 0x8626, // Passed to getVertexAttrib to read back the current vertex attribute.
    VERTEX_ATTRIB_ARRAY_ENABLED: 0x8622,
    VERTEX_ATTRIB_ARRAY_SIZE: 0x8623,
    VERTEX_ATTRIB_ARRAY_STRIDE: 0x8624,
    VERTEX_ATTRIB_ARRAY_TYPE: 0x8625,
    VERTEX_ATTRIB_ARRAY_NORMALIZED: 0x886A,
    VERTEX_ATTRIB_ARRAY_POINTER: 0x8645,
    VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 0x889F,

    // Culling
    // Constants passed to cullFace().

    CULL_FACE: 0x0B44, // Passed to enable/disable to turn on/off culling. Can also be used with getParameter to find the current culling method.
    FRONT: 0x0404, // Passed to cullFace to specify that only front faces should be drawn.
    BACK: 0x0405, // Passed to cullFace to specify that only back faces should be drawn.
    FRONT_AND_BACK: 0x0408, // Passed to cullFace to specify that front and back faces should be drawn.

    // Enabling and disabling
    // Constants passed to enable() or disable().

    BLEND: 0x0BE2, // Passed to enable/disable to turn on/off blending. Can also be used with getParameter to find the current blending method.
    DEPTH_TEST: 0x0B71, // Passed to enable/disable to turn on/off the depth test. Can also be used with getParameter to query the depth test.
    DITHER: 0x0BD0, // Passed to enable/disable to turn on/off dithering. Can also be used with getParameter to find the current dithering method.
    POLYGON_OFFSET_FILL: 0x8037, // Passed to enable/disable to turn on/off the polygon offset. Useful for rendering hidden-line images, decals, and or solids with highlighted edges. Can also be used with getParameter to query the scissor test.
    SAMPLE_ALPHA_TO_COVERAGE: 0x809E, // Passed to enable/disable to turn on/off the alpha to coverage. Used in multi-sampling alpha channels.
    SAMPLE_COVERAGE: 0x80A0, // Passed to enable/disable to turn on/off the sample coverage. Used in multi-sampling.
    SCISSOR_TEST: 0x0C11, // Passed to enable/disable to turn on/off the scissor test. Can also be used with getParameter to query the scissor test.
    /**
     *  模版缓冲区测试，发生在透明度测试之后，和深度测试之前
     *  Passed to enable/disable to turn on/off the stencil test. Can also be used with getParameter to query the stencil test.
     */
    STENCIL_TEST: 0x0B90,

    // Errors
    // Constants returned from getError().

    NO_ERROR: 0, // Returned from getError.
    INVALID_ENUM: 0x0500, //  Returned from getError.
    INVALID_VALUE: 0x0501, //  Returned from getError.
    INVALID_OPERATION: 0x0502, //  Returned from getError.
    OUT_OF_MEMORY: 0x0505, //  Returned from getError.
    CONTEXT_LOST_WEBGL: 0x9242, //  Returned from getError.

    // Front face directions
    // Constants passed to frontFace().

    CW: 0x0900, //  Passed to frontFace to specify the front face of a polygon is drawn in the clockwise direction
    CCW: 0x0901, // Passed to frontFace to specify the front face of a polygon is drawn in the counter clockwise direction

    // Hints
    // Constants passed to hint()

    DONT_CARE: 0x1100, // There is no preference for this behavior.
    FASTEST: 0x1101, // The most efficient behavior should be used.
    NICEST: 0x1102, // The most correct or the highest quality option should be used.
    GENERATE_MIPMAP_HINT: 0x8192, // Hint for the quality of filtering when generating mipmap images with generateMipmap().

    // Data types

    BYTE: 0x1400,
    /**
     * 无符号byte,即每通道8bit 适合 gl.RGBA
     */
    UNSIGNED_BYTE: 0x1401,
    SHORT: 0x1402,
    UNSIGNED_SHORT: 0x1403,
    INT: 0x1404,
    UNSIGNED_INT: 0x1405,
    FLOAT: 0x1406,

    // Pixel formats

    DEPTH_COMPONENT: 0x1902,
    ALPHA: 0x1906,
    /**
     * RGB颜色表示Texture，Image颜色读取规则
     */
    RGB: 0x1907,
    RGBA: 0x1908,
    LUMINANCE: 0x1909,
    LUMINANCE_ALPHA: 0x190A,

    // Pixel types

    // UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT_4_4_4_4: 0x8033,
    UNSIGNED_SHORT_5_5_5_1: 0x8034,
    UNSIGNED_SHORT_5_6_5: 0x8363,

    // Shaders
    // Constants passed to createShader() or getShaderParameter()

    FRAGMENT_SHADER: 0x8B30, // Passed to createShader to define a fragment shader.
    VERTEX_SHADER: 0x8B31, // Passed to createShader to define a vertex shader
    /**
     * shader 编译状态，
     * Passed to getShaderParamter to get the status of the compilation. Returns false if the shader was not compiled. You can then query getShaderInfoLog to find the exact error
     */
    COMPILE_STATUS: 0x8B81,
    DELETE_STATUS: 0x8B80, // Passed to getShaderParamter to determine if a shader was deleted via deleteShader. Returns true if it was, false otherwise.
    LINK_STATUS: 0x8B82, // Passed to getProgramParameter after calling linkProgram to determine if a program was linked correctly. Returns false if there were errors. Use getProgramInfoLog to find the exact error.
    VALIDATE_STATUS: 0x8B83, // Passed to getProgramParameter after calling validateProgram to determine if it is valid. Returns false if errors were found.
    ATTACHED_SHADERS: 0x8B85, // Passed to getProgramParameter after calling attachShader to determine if the shader was attached correctly. Returns false if errors occurred.
    /**
     * 获取program里可用的attributes，【map到program里方便upload属性】
     */
    ACTIVE_ATTRIBUTES: 0x8B89, // Passed to getProgramParameter to get the number of attributes active in a program.
    /**
     * 获取program里可用的uniforms，【map到program里方便upload属性】
     */
    ACTIVE_UNIFORMS: 0x8B86, // Passed to getProgramParamter to get the number of uniforms active in a program.
    MAX_VERTEX_ATTRIBS: 0x8869,
    MAX_VERTEX_UNIFORM_VECTORS: 0x8DFB,
    MAX_VARYING_VECTORS: 0x8DFC,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8B4D,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8B4C,
    MAX_TEXTURE_IMAGE_UNITS: 0x8872, // Implementation dependent number of maximum texture units. At least 8.
    MAX_FRAGMENT_UNIFORM_VECTORS: 0x8DFD,
    SHADER_TYPE: 0x8B4F,
    SHADING_LANGUAGE_VERSION: 0x8B8C,
    CURRENT_PROGRAM: 0x8B8D,

    // Depth or stencil tests
    // Constants passed to depthFunc() or stencilFunc().

    NEVER: 0x0200, //  Passed to depthFunction or stencilFunction to specify depth or stencil tests will never pass. i.e. Nothing will be drawn.
    ALWAYS: 0x0207, //  Passed to depthFunction or stencilFunction to specify depth or stencil tests will always pass. i.e. Pixels will be drawn in the order they are drawn.
    LESS: 0x0201, //  Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than the stored value.
    EQUAL: 0x0202, //  Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is equals to the stored value.
    /**
     * 测试对比条件，当参考值小于等于模板值时，通过测试，常用于深度测试
     * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is less than or equal to the stored value.
     */
    LEQUAL: 0x0203,
    /**
     * 测试对比条件，当参考值大于模版值时，通过测试
     * Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than the stored value.
     */
    GREATER: 0x0204,
    GEQUAL: 0x0206, //  Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is greater than or equal to the stored value.
    NOTEQUAL: 0x0205, //  Passed to depthFunction or stencilFunction to specify depth or stencil tests will pass if the new depth value is not equal to the stored value.

    // Stencil actions
    // Constants passed to stencilOp().

    KEEP: 0x1E00,
    REPLACE: 0x1E01,
    INCR: 0x1E02,
    DECR: 0x1E03,
    INVERT: 0x150A,
    INCR_WRAP: 0x8507,
    DECR_WRAP: 0x8508,

    // Textures
    // Constants passed to texParameteri(),
    // texParameterf(), bindTexture(), texImage2D(), and others.

    NEAREST: 0x2600,
    LINEAR: 0x2601,
    NEAREST_MIPMAP_NEAREST: 0x2700,
    LINEAR_MIPMAP_NEAREST: 0x2701,
    NEAREST_MIPMAP_LINEAR: 0x2702,
    LINEAR_MIPMAP_LINEAR: 0x2703,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    TEXTURE_2D: 0x0DE1,
    TEXTURE: 0x1702,
    TEXTURE_CUBE_MAP: 0x8513,
    TEXTURE_BINDING_CUBE_MAP: 0x8514,
    TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515,
    TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851A,
    MAX_CUBE_MAP_TEXTURE_SIZE: 0x851C,
    // TEXTURE0 - 31 0x84C0 - 0x84DF A texture unit.
    TEXTURE0: 0x84C0, // A texture unit.
    ACTIVE_TEXTURE: 0x84E0, // The current active texture unit.
    REPEAT: 0x2901,
    CLAMP_TO_EDGE: 0x812F,
    MIRRORED_REPEAT: 0x8370,

    // Emulation
    TEXTURE_WIDTH: 0x1000,
    TEXTURE_HEIGHT: 0x1001,

    // Uniform types

    FLOAT_VEC2: 0x8B50,
    FLOAT_VEC3: 0x8B51,
    FLOAT_VEC4: 0x8B52,
    INT_VEC2: 0x8B53,
    INT_VEC3: 0x8B54,
    INT_VEC4: 0x8B55,
    BOOL: 0x8B56,
    BOOL_VEC2: 0x8B57,
    BOOL_VEC3: 0x8B58,
    BOOL_VEC4: 0x8B59,
    FLOAT_MAT2: 0x8B5A,
    FLOAT_MAT3: 0x8B5B,
    FLOAT_MAT4: 0x8B5C,
    SAMPLER_2D: 0x8B5E,
    SAMPLER_CUBE: 0x8B60,

    // Shader precision-specified types

    LOW_FLOAT: 0x8DF0,
    MEDIUM_FLOAT: 0x8DF1,
    HIGH_FLOAT: 0x8DF2,
    LOW_INT: 0x8DF3,
    MEDIUM_INT: 0x8DF4,
    HIGH_INT: 0x8DF5,

    // Framebuffers and renderbuffers
    /**
     * 绑定framebuffer
     */
    FRAMEBUFFER: 0x8D40,
    /**
     * 绑定 renderbuffer 
     */
    RENDERBUFFER: 0x8D41,
    RGBA4: 0x8056,
    RGB5_A1: 0x8057,
    RGB565: 0x8D62,
    DEPTH_COMPONENT16: 0x81A5,
    STENCIL_INDEX: 0x1901,
    STENCIL_INDEX8: 0x8D48,
    /**
     * 一般用于 bufferStorage，支持深度和缓冲区数据存储
     */
    DEPTH_STENCIL: 0x84F9,
    RENDERBUFFER_WIDTH: 0x8D42,
    RENDERBUFFER_HEIGHT: 0x8D43,
    RENDERBUFFER_INTERNAL_FORMAT: 0x8D44,
    RENDERBUFFER_RED_SIZE: 0x8D50,
    RENDERBUFFER_GREEN_SIZE: 0x8D51,
    RENDERBUFFER_BLUE_SIZE: 0x8D52,
    RENDERBUFFER_ALPHA_SIZE: 0x8D53,
    RENDERBUFFER_DEPTH_SIZE: 0x8D54,
    RENDERBUFFER_STENCIL_SIZE: 0x8D55,
    FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 0x8CD0,
    FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 0x8CD1,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 0x8CD2,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 0x8CD3,
    COLOR_ATTACHMENT0: 0x8CE0,
    DEPTH_ATTACHMENT: 0x8D00,
    STENCIL_ATTACHMENT: 0x8D20,
    /**
     * 深度和缓冲区附着，webgl2支持
     */
    DEPTH_STENCIL_ATTACHMENT: 0x821A,
    NONE: 0,
    FRAMEBUFFER_COMPLETE: 0x8CD5,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8CD6,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 0x8CD7,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 0x8CD9,
    FRAMEBUFFER_UNSUPPORTED: 0x8CDD,
    FRAMEBUFFER_BINDING: 0x8CA6,
    RENDERBUFFER_BINDING: 0x8CA7,
    MAX_RENDERBUFFER_SIZE: 0x84E8,
    INVALID_FRAMEBUFFER_OPERATION: 0x0506,

    // READ_FRAMEBUFFER: 0x8CA8,
    // DRAW_FRAMEBUFFER: 0x8CA9,

    // Pixel storage modes
    // Constants passed to pixelStorei().

    UNPACK_FLIP_Y_WEBGL: 0x9240,
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243,

    // /////////////////////////////////////////////////////
    // Additional constants defined WebGL 2
    // These constants are defined on the WebGL2RenderingContext interface.
    // All WebGL 1 constants are also available in a WebGL 2 context.
    // /////////////////////////////////////////////////////

    // Getting GL parameter information
    // Constants passed to getParameter()
    // to specify what information to return.

    READ_BUFFER: 0x0C02,
    UNPACK_ROW_LENGTH: 0x0CF2,
    UNPACK_SKIP_ROWS: 0x0CF3,
    UNPACK_SKIP_PIXELS: 0x0CF4,
    PACK_ROW_LENGTH: 0x0D02,
    PACK_SKIP_ROWS: 0x0D03,
    PACK_SKIP_PIXELS: 0x0D04,
    TEXTURE_BINDING_3D: 0x806A,
    UNPACK_SKIP_IMAGES: 0x806D,
    UNPACK_IMAGE_HEIGHT: 0x806E,
    MAX_3D_TEXTURE_SIZE: 0x8073,
    MAX_ELEMENTS_VERTICES: 0x80E8,
    MAX_ELEMENTS_INDICES: 0x80E9,
    MAX_TEXTURE_LOD_BIAS: 0x84FD,
    MAX_FRAGMENT_UNIFORM_COMPONENTS: 0x8B49,
    MAX_VERTEX_UNIFORM_COMPONENTS: 0x8B4A,
    MAX_ARRAY_TEXTURE_LAYERS: 0x88FF,
    MIN_PROGRAM_TEXEL_OFFSET: 0x8904,
    MAX_PROGRAM_TEXEL_OFFSET: 0x8905,
    MAX_VARYING_COMPONENTS: 0x8B4B,
    FRAGMENT_SHADER_DERIVATIVE_HINT: 0x8B8B,
    RASTERIZER_DISCARD: 0x8C89,
    VERTEX_ARRAY_BINDING: 0x85B5,
    MAX_VERTEX_OUTPUT_COMPONENTS: 0x9122,
    MAX_FRAGMENT_INPUT_COMPONENTS: 0x9125,
    MAX_SERVER_WAIT_TIMEOUT: 0x9111,
    MAX_ELEMENT_INDEX: 0x8D6B,

    // Textures
    // Constants passed to texParameteri(),
    // texParameterf(), bindTexture(), texImage2D(), and others.

    RED: 0x1903,
    RGB8: 0x8051,
    RGBA8: 0x8058,
    RGB10_A2: 0x8059,
    TEXTURE_3D: 0x806F,
    TEXTURE_WRAP_R: 0x8072,
    TEXTURE_MIN_LOD: 0x813A,
    TEXTURE_MAX_LOD: 0x813B,
    TEXTURE_BASE_LEVEL: 0x813C,
    TEXTURE_MAX_LEVEL: 0x813D,
    TEXTURE_COMPARE_MODE: 0x884C,
    TEXTURE_COMPARE_FUNC: 0x884D,
    SRGB: 0x8C40,
    SRGB8: 0x8C41,
    SRGB8_ALPHA8: 0x8C43,
    COMPARE_REF_TO_TEXTURE: 0x884E,
    RGBA32F: 0x8814,
    RGB32F: 0x8815,
    RGBA16F: 0x881A,
    RGB16F: 0x881B,
    TEXTURE_2D_ARRAY: 0x8C1A,
    TEXTURE_BINDING_2D_ARRAY: 0x8C1D,
    R11F_G11F_B10F: 0x8C3A,
    RGB9_E5: 0x8C3D,
    RGBA32UI: 0x8D70,
    RGB32UI: 0x8D71,
    RGBA16UI: 0x8D76,
    RGB16UI: 0x8D77,
    RGBA8UI: 0x8D7C,
    RGB8UI: 0x8D7D,
    RGBA32I: 0x8D82,
    RGB32I: 0x8D83,
    RGBA16I: 0x8D88,
    RGB16I: 0x8D89,
    RGBA8I: 0x8D8E,
    RGB8I: 0x8D8F,
    RED_INTEGER: 0x8D94,
    RGB_INTEGER: 0x8D98,
    RGBA_INTEGER: 0x8D99,
    R8: 0x8229,
    RG8: 0x822B,
    R16F: 0x822D,
    R32F: 0x822E,
    RG16F: 0x822F,
    RG32F: 0x8230,
    R8I: 0x8231,
    R8UI: 0x8232,
    R16I: 0x8233,
    R16UI: 0x8234,
    R32I: 0x8235,
    R32UI: 0x8236,
    RG8I: 0x8237,
    RG8UI: 0x8238,
    RG16I: 0x8239,
    RG16UI: 0x823A,
    RG32I: 0x823B,
    RG32UI: 0x823C,
    R8_SNORM: 0x8F94,
    RG8_SNORM: 0x8F95,
    RGB8_SNORM: 0x8F96,
    RGBA8_SNORM: 0x8F97,
    RGB10_A2UI: 0x906F,

    /* covered by extension
    COMPRESSED_R11_EAC : 0x9270,
    COMPRESSED_SIGNED_R11_EAC: 0x9271,
    COMPRESSED_RG11_EAC: 0x9272,
    COMPRESSED_SIGNED_RG11_EAC : 0x9273,
    COMPRESSED_RGB8_ETC2 : 0x9274,
    COMPRESSED_SRGB8_ETC2: 0x9275,
    COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 : 0x9276,
    COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC : 0x9277,
    COMPRESSED_RGBA8_ETC2_EAC: 0x9278,
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : 0x9279,
    */
    TEXTURE_IMMUTABLE_FORMAT: 0x912F,
    TEXTURE_IMMUTABLE_LEVELS: 0x82DF,

    // Pixel types

    UNSIGNED_INT_2_10_10_10_REV: 0x8368,
    UNSIGNED_INT_10F_11F_11F_REV: 0x8C3B,
    UNSIGNED_INT_5_9_9_9_REV: 0x8C3E,
    FLOAT_32_UNSIGNED_INT_24_8_REV: 0x8DAD,
    UNSIGNED_INT_24_8: 0x84FA,
    HALF_FLOAT: 0x140B,
    RG: 0x8227,
    RG_INTEGER: 0x8228,
    INT_2_10_10_10_REV: 0x8D9F,

    // Queries

    CURRENT_QUERY: 0x8865,
    QUERY_RESULT: 0x8866,
    QUERY_RESULT_AVAILABLE: 0x8867,
    ANY_SAMPLES_PASSED: 0x8C2F,
    ANY_SAMPLES_PASSED_CONSERVATIVE: 0x8D6A,

    // Draw buffers

    MAX_DRAW_BUFFERS: 0x8824,
    DRAW_BUFFER0: 0x8825,
    DRAW_BUFFER1: 0x8826,
    DRAW_BUFFER2: 0x8827,
    DRAW_BUFFER3: 0x8828,
    DRAW_BUFFER4: 0x8829,
    DRAW_BUFFER5: 0x882A,
    DRAW_BUFFER6: 0x882B,
    DRAW_BUFFER7: 0x882C,
    DRAW_BUFFER8: 0x882D,
    DRAW_BUFFER9: 0x882E,
    DRAW_BUFFER10: 0x882F,
    DRAW_BUFFER11: 0x8830,
    DRAW_BUFFER12: 0x8831,
    DRAW_BUFFER13: 0x8832,
    DRAW_BUFFER14: 0x8833,
    DRAW_BUFFER15: 0x8834,
    MAX_COLOR_ATTACHMENTS: 0x8CDF,
    COLOR_ATTACHMENT1: 0x8CE1,
    COLOR_ATTACHMENT2: 0x8CE2,
    COLOR_ATTACHMENT3: 0x8CE3,
    COLOR_ATTACHMENT4: 0x8CE4,
    COLOR_ATTACHMENT5: 0x8CE5,
    COLOR_ATTACHMENT6: 0x8CE6,
    COLOR_ATTACHMENT7: 0x8CE7,
    COLOR_ATTACHMENT8: 0x8CE8,
    COLOR_ATTACHMENT9: 0x8CE9,
    COLOR_ATTACHMENT10: 0x8CEA,
    COLOR_ATTACHMENT11: 0x8CEB,
    COLOR_ATTACHMENT12: 0x8CEC,
    COLOR_ATTACHMENT13: 0x8CED,
    COLOR_ATTACHMENT14: 0x8CEE,
    COLOR_ATTACHMENT15: 0x8CEF,

    // Samplers

    SAMPLER_3D: 0x8B5F,
    SAMPLER_2D_SHADOW: 0x8B62,
    SAMPLER_2D_ARRAY: 0x8DC1,
    SAMPLER_2D_ARRAY_SHADOW: 0x8DC4,
    SAMPLER_CUBE_SHADOW: 0x8DC5,
    INT_SAMPLER_2D: 0x8DCA,
    INT_SAMPLER_3D: 0x8DCB,
    INT_SAMPLER_CUBE: 0x8DCC,
    INT_SAMPLER_2D_ARRAY: 0x8DCF,
    UNSIGNED_INT_SAMPLER_2D: 0x8DD2,
    UNSIGNED_INT_SAMPLER_3D: 0x8DD3,
    UNSIGNED_INT_SAMPLER_CUBE: 0x8DD4,
    UNSIGNED_INT_SAMPLER_2D_ARRAY: 0x8DD7,
    MAX_SAMPLES: 0x8D57,
    SAMPLER_BINDING: 0x8919,

    // Buffers

    PIXEL_PACK_BUFFER: 0x88EB,
    PIXEL_UNPACK_BUFFER: 0x88EC,
    PIXEL_PACK_BUFFER_BINDING: 0x88ED,
    PIXEL_UNPACK_BUFFER_BINDING: 0x88EF,
    COPY_READ_BUFFER: 0x8F36,
    COPY_WRITE_BUFFER: 0x8F37,
    COPY_READ_BUFFER_BINDING: 0x8F36,
    COPY_WRITE_BUFFER_BINDING: 0x8F37,

    // Data types

    FLOAT_MAT2x3: 0x8B65,
    FLOAT_MAT2x4: 0x8B66,
    FLOAT_MAT3x2: 0x8B67,
    FLOAT_MAT3x4: 0x8B68,
    FLOAT_MAT4x2: 0x8B69,
    FLOAT_MAT4x3: 0x8B6A,
    UNSIGNED_INT_VEC2: 0x8DC6,
    UNSIGNED_INT_VEC3: 0x8DC7,
    UNSIGNED_INT_VEC4: 0x8DC8,
    UNSIGNED_NORMALIZED: 0x8C17,
    SIGNED_NORMALIZED: 0x8F9C,

    // Vertex attributes

    VERTEX_ATTRIB_ARRAY_INTEGER: 0x88FD,
    VERTEX_ATTRIB_ARRAY_DIVISOR: 0x88FE,

    // Transform feedback

    TRANSFORM_FEEDBACK_BUFFER_MODE: 0x8C7F,
    MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 0x8C80,
    TRANSFORM_FEEDBACK_VARYINGS: 0x8C83,
    TRANSFORM_FEEDBACK_BUFFER_START: 0x8C84,
    TRANSFORM_FEEDBACK_BUFFER_SIZE: 0x8C85,
    TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 0x8C88,
    MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 0x8C8A,
    MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 0x8C8B,
    INTERLEAVED_ATTRIBS: 0x8C8C,
    SEPARATE_ATTRIBS: 0x8C8D,
    TRANSFORM_FEEDBACK_BUFFER: 0x8C8E,
    TRANSFORM_FEEDBACK_BUFFER_BINDING: 0x8C8F,
    TRANSFORM_FEEDBACK: 0x8E22,
    TRANSFORM_FEEDBACK_PAUSED: 0x8E23,
    TRANSFORM_FEEDBACK_ACTIVE: 0x8E24,
    TRANSFORM_FEEDBACK_BINDING: 0x8E25,

    // Framebuffers and renderbuffers

    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 0x8210,
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 0x8211,
    FRAMEBUFFER_ATTACHMENT_RED_SIZE: 0x8212,
    FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 0x8213,
    FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 0x8214,
    FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 0x8215,
    FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 0x8216,
    FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 0x8217,
    FRAMEBUFFER_DEFAULT: 0x8218,
    // DEPTH_STENCIL_ATTACHMENT : 0x821A,
    // DEPTH_STENCIL: 0x84F9,
    DEPTH24_STENCIL8: 0x88F0,
    DRAW_FRAMEBUFFER_BINDING: 0x8CA6,
    // READ_FRAMEBUFFER : 0x8CA8,
    // DRAW_FRAMEBUFFER : 0x8CA9,
    READ_FRAMEBUFFER_BINDING: 0x8CAA,
    RENDERBUFFER_SAMPLES: 0x8CAB,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 0x8CD4,
    FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 0x8D56,

    // Uniforms

    UNIFORM_BUFFER: 0x8A11,
    UNIFORM_BUFFER_BINDING: 0x8A28,
    UNIFORM_BUFFER_START: 0x8A29,
    UNIFORM_BUFFER_SIZE: 0x8A2A,
    MAX_VERTEX_UNIFORM_BLOCKS: 0x8A2B,
    MAX_FRAGMENT_UNIFORM_BLOCKS: 0x8A2D,
    MAX_COMBINED_UNIFORM_BLOCKS: 0x8A2E,
    MAX_UNIFORM_BUFFER_BINDINGS: 0x8A2F,
    MAX_UNIFORM_BLOCK_SIZE: 0x8A30,
    MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 0x8A31,
    MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 0x8A33,
    UNIFORM_BUFFER_OFFSET_ALIGNMENT: 0x8A34,
    ACTIVE_UNIFORM_BLOCKS: 0x8A36,
    UNIFORM_TYPE: 0x8A37,
    UNIFORM_SIZE: 0x8A38,
    UNIFORM_BLOCK_INDEX: 0x8A3A,
    UNIFORM_OFFSET: 0x8A3B,
    UNIFORM_ARRAY_STRIDE: 0x8A3C,
    UNIFORM_MATRIX_STRIDE: 0x8A3D,
    UNIFORM_IS_ROW_MAJOR: 0x8A3E,
    UNIFORM_BLOCK_BINDING: 0x8A3F,
    UNIFORM_BLOCK_DATA_SIZE: 0x8A40,
    UNIFORM_BLOCK_ACTIVE_UNIFORMS: 0x8A42,
    UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 0x8A43,
    UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 0x8A44,
    UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 0x8A46,

    // Sync objects

    OBJECT_TYPE: 0x9112,
    SYNC_CONDITION: 0x9113,
    SYNC_STATUS: 0x9114,
    SYNC_FLAGS: 0x9115,
    SYNC_FENCE: 0x9116,
    SYNC_GPU_COMMANDS_COMPLETE: 0x9117,
    UNSIGNALED: 0x9118,
    SIGNALED: 0x9119,
    ALREADY_SIGNALED: 0x911A,
    TIMEOUT_EXPIRED: 0x911B,
    CONDITION_SATISFIED: 0x911C,
    WAIT_FAILED: 0x911D,
    SYNC_FLUSH_COMMANDS_BIT: 0x00000001,

    // Miscellaneous constants

    COLOR: 0x1800,
    DEPTH: 0x1801,
    STENCIL: 0x1802,
    MIN: 0x8007,
    MAX: 0x8008,
    DEPTH_COMPONENT24: 0x81A6,
    STREAM_READ: 0x88E1,
    STREAM_COPY: 0x88E2,
    STATIC_READ: 0x88E5,
    STATIC_COPY: 0x88E6,
    DYNAMIC_READ: 0x88E9,
    DYNAMIC_COPY: 0x88EA,
    DEPTH_COMPONENT32F: 0x8CAC,
    DEPTH32F_STENCIL8: 0x8CAD,
    INVALID_INDEX: 0xFFFFFFFF,
    TIMEOUT_IGNORED: -1,
    MAX_CLIENT_WAIT_TIMEOUT_WEBGL: 0x9247,

    // Constants defined in WebGL extensions

    // ANGLE_instanced_arrays

    VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 0x88FE, // Describes the frequency divisor used for instanced rendering.

    // WEBGL_debug_renderer_info

    UNMASKED_VENDOR_WEBGL: 0x9245, // Passed to getParameter to get the vendor string of the graphics driver.
    UNMASKED_RENDERER_WEBGL: 0x9246, // Passed to getParameter to get the renderer string of the graphics driver.

    // EXT_texture_filter_anisotropic

    MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84FF, // Returns the maximum available anisotropy.
    TEXTURE_MAX_ANISOTROPY_EXT: 0x84FE, // Passed to texParameter to set the desired maximum anisotropy for a texture.

    // WEBGL_compressed_texture_s3tc

    COMPRESSED_RGB_S3TC_DXT1_EXT: 0x83F0, // A DXT1-compressed image in an RGB image format.
    COMPRESSED_RGBA_S3TC_DXT1_EXT: 0x83F1, // A DXT1-compressed image in an RGB image format with a simple on/off alpha value.
    COMPRESSED_RGBA_S3TC_DXT3_EXT: 0x83F2, // A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression.
    COMPRESSED_RGBA_S3TC_DXT5_EXT: 0x83F3, // A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done.

    // WEBGL_compressed_texture_es3

    COMPRESSED_R11_EAC: 0x9270, // One-channel (red) unsigned format compression.
    COMPRESSED_SIGNED_R11_EAC: 0x9271, // One-channel (red) signed format compression.
    COMPRESSED_RG11_EAC: 0x9272, // Two-channel (red and green) unsigned format compression.
    COMPRESSED_SIGNED_RG11_EAC: 0x9273, // Two-channel (red and green) signed format compression.
    COMPRESSED_RGB8_ETC2: 0x9274, // Compresses RBG8 data with no alpha channel.
    COMPRESSED_RGBA8_ETC2_EAC: 0x9275, // Compresses RGBA8 data. The RGB part is encoded the same as RGB_ETC2, but the alpha part is encoded separately.
    COMPRESSED_SRGB8_ETC2: 0x9276, // Compresses sRBG8 data with no alpha channel.
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 0x9277, // Compresses sRGBA8 data. The sRGB part is encoded the same as SRGB_ETC2, but the alpha part is encoded separately.
    COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9278, // Similar to RGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.
    COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9279, // Similar to SRGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.

    // WEBGL_compressed_texture_pvrtc

    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 0x8C00, // RGB compression in 4-bit mode. One block for each 4×4 pixels.
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 0x8C02, // RGBA compression in 4-bit mode. One block for each 4×4 pixels.
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 0x8C01, // RGB compression in 2-bit mode. One block for each 8×4 pixels.
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 0x8C03, // RGBA compression in 2-bit mode. One block for each 8×4 pixe

    // WEBGL_compressed_texture_etc1

    COMPRESSED_RGB_ETC1_WEBGL: 0x8D64, // Compresses 24-bit RGB data with no alpha channel.

    // WEBGL_compressed_texture_atc

    COMPRESSED_RGB_ATC_WEBGL: 0x8C92, //  Compresses RGB textures with no alpha channel.
    COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 0x8C92, // Compresses RGBA textures using explicit alpha encoding (useful when alpha transitions are sharp).
    COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 0x87EE, // Compresses RGBA textures using interpolated alpha encoding (useful when alpha transitions are gradient).

    // WEBGL_depth_texture

    UNSIGNED_INT_24_8_WEBGL: 0x84FA, // Unsigned integer type for 24-bit depth texture data.

    // OES_texture_half_float

    HALF_FLOAT_OES: 0x8D61, // Half floating-point type (16-bit).

    // WEBGL_color_buffer_float

    RGBA32F_EXT: 0x8814, // RGBA 32-bit floating-point color-renderable format.
    RGB32F_EXT: 0x8815, // RGB 32-bit floating-point color-renderable format.
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 0x8211,
    UNSIGNED_NORMALIZED_EXT: 0x8C17,

    // EXT_blend_minmax

    MIN_EXT: 0x8007, // Produces the minimum color components of the source and destination colors.
    MAX_EXT: 0x8008, // Produces the maximum color components of the source and destination colors.

    // EXT_sRGB

    SRGB_EXT: 0x8C40, // Unsized sRGB format that leaves the precision up to the driver.
    SRGB_ALPHA_EXT: 0x8C42, // Unsized sRGB format with unsized alpha component.
    SRGB8_ALPHA8_EXT: 0x8C43, // Sized (8-bit) sRGB and alpha formats.
    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 0x8210, // Returns the framebuffer color encoding.

    // OES_standard_derivatives

    FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 0x8B8B, // Indicates the accuracy of the derivative calculation for the GLSL built-in functions: dFdx, dFdy, and fwidth.

    // WEBGL_draw_buffers

    COLOR_ATTACHMENT0_WEBGL: 0x8CE0, // Framebuffer color attachment point
    COLOR_ATTACHMENT1_WEBGL: 0x8CE1, // Framebuffer color attachment point
    COLOR_ATTACHMENT2_WEBGL: 0x8CE2, // Framebuffer color attachment point
    COLOR_ATTACHMENT3_WEBGL: 0x8CE3, // Framebuffer color attachment point
    COLOR_ATTACHMENT4_WEBGL: 0x8CE4, // Framebuffer color attachment point
    COLOR_ATTACHMENT5_WEBGL: 0x8CE5, // Framebuffer color attachment point
    COLOR_ATTACHMENT6_WEBGL: 0x8CE6, // Framebuffer color attachment point
    COLOR_ATTACHMENT7_WEBGL: 0x8CE7, // Framebuffer color attachment point
    COLOR_ATTACHMENT8_WEBGL: 0x8CE8, // Framebuffer color attachment point
    COLOR_ATTACHMENT9_WEBGL: 0x8CE9, // Framebuffer color attachment point
    COLOR_ATTACHMENT10_WEBGL: 0x8CEA, // Framebuffer color attachment point
    COLOR_ATTACHMENT11_WEBGL: 0x8CEB, // Framebuffer color attachment point
    COLOR_ATTACHMENT12_WEBGL: 0x8CEC, // Framebuffer color attachment point
    COLOR_ATTACHMENT13_WEBGL: 0x8CED, // Framebuffer color attachment point
    COLOR_ATTACHMENT14_WEBGL: 0x8CEE, // Framebuffer color attachment point
    COLOR_ATTACHMENT15_WEBGL: 0x8CEF, // Framebuffer color attachment point
    DRAW_BUFFER0_WEBGL: 0x8825, // Draw buffer
    DRAW_BUFFER1_WEBGL: 0x8826, // Draw buffer
    DRAW_BUFFER2_WEBGL: 0x8827, // Draw buffer
    DRAW_BUFFER3_WEBGL: 0x8828, // Draw buffer
    DRAW_BUFFER4_WEBGL: 0x8829, // Draw buffer
    DRAW_BUFFER5_WEBGL: 0x882A, // Draw buffer
    DRAW_BUFFER6_WEBGL: 0x882B, // Draw buffer
    DRAW_BUFFER7_WEBGL: 0x882C, // Draw buffer
    DRAW_BUFFER8_WEBGL: 0x882D, // Draw buffer
    DRAW_BUFFER9_WEBGL: 0x882E, // Draw buffer
    DRAW_BUFFER10_WEBGL: 0x882F, // Draw buffer
    DRAW_BUFFER11_WEBGL: 0x8830, // Draw buffer
    DRAW_BUFFER12_WEBGL: 0x8831, // Draw buffer
    DRAW_BUFFER13_WEBGL: 0x8832, // Draw buffer
    DRAW_BUFFER14_WEBGL: 0x8833, // Draw buffer
    DRAW_BUFFER15_WEBGL: 0x8834, // Draw buffer
    MAX_COLOR_ATTACHMENTS_WEBGL: 0x8CDF, // Maximum number of framebuffer color attachment points
    MAX_DRAW_BUFFERS_WEBGL: 0x8824, // Maximum number of draw buffers

    // OES_vertex_array_object

    VERTEX_ARRAY_BINDING_OES: 0x85B5, // The bound vertex array object (VAO).

    // EXT_disjoint_timer_query

    QUERY_COUNTER_BITS_EXT: 0x8864, // The number of bits used to hold the query result for the given target.
    CURRENT_QUERY_EXT: 0x8865, // The currently active query.
    QUERY_RESULT_EXT: 0x8866, // The query result.
    QUERY_RESULT_AVAILABLE_EXT: 0x8867, // A Boolean indicating whether or not a query result is available.
    TIME_ELAPSED_EXT: 0x88BF, // Elapsed time (in nanoseconds).
    TIMESTAMP_EXT: 0x8E28, // The current time.
    GPU_DISJOINT_EXT: 0x8FBB // A Boolean indicating whether or not the GPU performed any disjoint operation.
};

var GLConstants_1 = GLConstants;

/**
 * 提供shader程序创建，销毁，应用等
 * @author yellow 2017/6/12
 */

var setId = stamp_1.setId;

/** 
 * Shader抽象类
 * @class
 */

var GLShader = function (_Dispose) {
    inherits(GLShader, _Dispose);

    /**
     * Creates an instance of Shader.
     * @constructor
     * @param {WebGLRenderingContext} gl 
     * @param {Object} source
     * @param {String} [source.source]
     * @param {String} [source.name] 
     * @param {String} shaderType 
     * @param {GLExtension} extension
     */
    function GLShader(gl, source, shaderType, extension) {
        classCallCheck(this, GLShader);

        var _this = possibleConstructorReturn(this, (GLShader.__proto__ || Object.getPrototypeOf(GLShader)).call(this));

        _this._gl = gl;
        _this._extension = extension;
        _this._shaderType = shaderType;
        _this._handle = _this._createHandle();
        if (!!source) {
            _this.source = source;
            _this.compile();
        }
        return _this;
    }
    /**
     * return the complied source
     * @readonly
     * @memberof Shader
     */


    createClass(GLShader, [{
        key: 'compile',

        /**
         * use gl to compile the shader
         * @memberof Shader
         */
        value: function compile() {
            var gl = this._gl;
            gl.compileShader(this._handle);
            var compileStatus = gl.getShaderParameter(this._handle, GLConstants_1.COMPILE_STATUS);
            if (!compileStatus) {
                var infoLog = gl.getShaderInfoLog(this.handle);
                this.dispose();
                throw new Error(infoLog);
            }
        }
        /**
         * delete shader form gl
         */

    }, {
        key: 'dispose',
        value: function dispose() {
            this._gl.deleteShader(this._handle);
        }
        /**
         * overwrite 
         */

    }, {
        key: '_createHandle',
        value: function _createHandle() {
            var gl = this._gl;
            var shader = gl.createShader(this._shaderType);
            setId(shader, this._id);
            return shader;
        }
    }, {
        key: 'translateSource',
        get: function get$$1() {
            var ext = this._extension['WEBGL_debug_shaders'];
            return ext ? ext.getTranslatedShaderSource(this.handle) : 'No translated source available. WEBGL_debug_shaders not implemented';
        }
        /**
         * @readonly
         * @memberof Shader
         */

    }, {
        key: 'source',
        get: function get$$1() {
            return this._source;
        }
        /**
         * set the source
         */
        ,
        set: function set$$1(value) {
            var gl = this._gl;
            this._source = value;
            gl.shaderSource(this._handle, this._source);
        }
    }]);
    return GLShader;
}(Dispose_1);

var GLShader_1 = GLShader;

/**
 * vertex shader object
 * @author yellow date 2017/6/12
 */

/**
 * @class
 */

var GLVertexShader = function (_GLShader) {
  inherits(GLVertexShader, _GLShader);

  /**
   * 创建vertex shader
   * @param {WebGLRenderingContext} gl 
   * @param {String} source 
   * @param {GLExtension} extension
   */
  function GLVertexShader(gl, source, extension) {
    classCallCheck(this, GLVertexShader);
    return possibleConstructorReturn(this, (GLVertexShader.__proto__ || Object.getPrototypeOf(GLVertexShader)).call(this, gl, source, GLConstants_1.VERTEX_SHADER, extension));
  }

  return GLVertexShader;
}(GLShader_1);

var GLVertexShader_1 = GLVertexShader;

/**
 * fragment shader object
 * @author yellow date 2017/6/12
 */

/**
 * @class
 */

var GLFragmentShader = function (_GLShader) {
  inherits(GLFragmentShader, _GLShader);

  /**
   * 创建fragment shader
   * @param {WebGLRenderingContext} gl 
   * @param {String} source 
   * @param {GLExtension} extension
   */
  function GLFragmentShader(gl, source, extension) {
    classCallCheck(this, GLFragmentShader);
    return possibleConstructorReturn(this, (GLFragmentShader.__proto__ || Object.getPrototypeOf(GLFragmentShader)).call(this, gl, source, GLConstants_1.FRAGMENT_SHADER, extension));
  }

  return GLFragmentShader;
}(GLShader_1);

var GLFragmentShader_1 = GLFragmentShader;

/**
 * @author yellow date 2017/6/15
 * management of GLExtension
 */
var GL_STANDEXTENSIONS = {
    standardDerivatives: ['OES_standard_derivatives'],
    elementIndexUint: ['OES_element_index_uint'],
    depthTexture: ['WEBGL_depth_texture', 'WEBKIT_WEBGL_depth_texture'],
    textureFloat: ['OES_texture_float'],
    fragDepth: ['EXT_frag_depth'],
    debugShaders: ['WEBGL_debug_shaders'],
    s3tc: ['WEBGL_compressed_texture_s3tc', 'MOZ_WEBGL_compressed_texture_s3tc', 'WEBKIT_WEBGL_compressed_texture_s3tc'],
    pvrtc: ['WEBGL_compressed_texture_pvrtc', 'WEBKIT_WEBGL_compressed_texture_pvrtc'],
    etc1: ['WEBGL_compressed_texture_etc1'],
    textureFilterAnisotropic: ['EXT_texture_filter_anisotropic', 'MOZ_EXT_texture_filter_anisotropic', 'WEBKIT_EXT_texture_filter_anisotropic'],
    vertexArrayObject: ['OES_vertex_array_object', 'MOZ_OES_vertex_array_object', 'WEBKIT_OES_vertex_array_object'],
    angleInstancedArrays: ['ANGLE_instanced_arrays']
};
/**
 * 
 * @class
 * @example
 *  let extension = new GLExtension(gl);
 *  let standardDerivatives = extension['standardDerivatives']; 
 *  //or
 *  let standardDerivatives = extension.standardDerivatives; 
 */

var GLExtension = function () {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {Array} [names] the arry of extension names
     */
    function GLExtension(gl) {
        classCallCheck(this, GLExtension);

        this._gl = gl;
        this._extensions = {};
        this._includeExtension();
        this._map();
    }
    /**
     * @private
     */


    createClass(GLExtension, [{
        key: '_includeExtension',
        value: function _includeExtension() {
            var gl = this._gl;
            for (var key in GL_STANDEXTENSIONS) {
                if (GL_STANDEXTENSIONS.hasOwnProperty(key)) {
                    var extensionName = GL_STANDEXTENSIONS[key],
                        extension = this.getExtension(extensionName);
                    if (!!extension) this._extensions[key] = extension;
                }
            }
        }
        /**
         * 
         * @param {String[]} extNames 
         */

    }, {
        key: 'getExtension',
        value: function getExtension() {
            var _ref;

            var gl = this._gl,
                names = (_ref = []).concat.apply(_ref, arguments),
                len = names.length;
            for (var i = 0; i < len; ++i) {
                var name = names[i];
                var extension = gl.getExtension(name);
                if (extension) return extension;
            }
            return null;
        }
        /**
         * map gl.extension to GLContext instance
         */

    }, {
        key: '_map',
        value: function _map() {
            for (var key in this._extensions) {
                if (this._extensions.hasOwnProperty(key)) {
                    var target = this._extensions[key];
                    if (!this[key] && !!target) this[key] = target;
                }
            }
        }
    }]);
    return GLExtension;
}();

var GLExtension_1 = GLExtension;

/**
 * reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/NavigatorConcurrentHardware/hardwareConcurrency
 * 
 * detect hardware env to fix the number of Limits
 * @author yellow date 2017/6/15
 */

var Limits = {
    maximumCombinedTextureImageUnits: 0,
    maximumCubeMapSize: 0,
    maximumFragmentUniformVectors: 0,
    maximumTextureImageUnits: 0,
    maximumRenderbufferSize: 0,
    maximumTextureSize: 0,
    maximumVaryingVectors: 0,
    maximumVertexAttributes: 0,
    maximumVertexTextureImageUnits: 0,
    maximumVertexUniformVectors: 0,
    minimumAliasedLineWidth: 0,
    maximumAliasedLineWidth: 0,
    minimumAliasedPointSize: 0,
    maximumAliasedPointSize: 0,
    maximumViewportWidth: 0,
    maximumViewportHeight: 0,
    maximumTextureFilterAnisotropy: 0,
    maximumDrawBuffers: 0,
    maximumColorAttachments: 0,
    highpFloatSupported: false,
    highpIntSupported: false,
    hardwareConcurrency: 0
};

/**
 * @class
 */

var GLLimits = function () {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    function GLLimits(gl) {
        classCallCheck(this, GLLimits);

        this._gl = gl;
        this._limits = merge_1({}, Limits);
        this._includeParamter(this._gl);
        this._map();
    }

    createClass(GLLimits, [{
        key: '_includeParamter',
        value: function _includeParamter(gl) {
            this._limits.hardwareConcurrency = isNode_1 ? 2 : window.navigator.hardwareConcurrency || 2;
            this._limits.maximumCombinedTextureImageUnits = gl.getParameter(GLConstants_1.MAX_COMBINED_TEXTURE_IMAGE_UNITS); // min: 8
            this._limits.maximumCubeMapSize = gl.getParameter(GLConstants_1.MAX_CUBE_MAP_TEXTURE_SIZE); // min: 16
            this._limits.maximumFragmentUniformVectors = gl.getParameter(GLConstants_1.MAX_FRAGMENT_UNIFORM_VECTORS); // min: 16
            this._limits.maximumTextureImageUnits = gl.getParameter(GLConstants_1.MAX_TEXTURE_IMAGE_UNITS); // min: 8
            this._limits.maximumRenderbufferSize = gl.getParameter(GLConstants_1.MAX_RENDERBUFFER_SIZE); // min: 1
            this._limits.maximumTextureSize = gl.getParameter(GLConstants_1.MAX_TEXTURE_SIZE); // min: 64
            this._limits.maximumVaryingVectors = gl.getParameter(GLConstants_1.MAX_VARYING_VECTORS); // min: 8
            this._limits.maximumVertexAttributes = gl.getParameter(GLConstants_1.MAX_VERTEX_ATTRIBS); // min: 8
            this._limits.maximumVertexTextureImageUnits = gl.getParameter(GLConstants_1.MAX_VERTEX_TEXTURE_IMAGE_UNITS); // min: 0
            this._limits.maximumVertexUniformVectors = gl.getParameter(GLConstants_1.MAX_VERTEX_UNIFORM_VECTORS); // min: 128
            this._limits.highpFloatSupported = gl.getShaderPrecisionFormat(GLConstants_1.FRAGMENT_SHADER, GLConstants_1.HIGH_FLOAT) !== 0;
            this._limits.highpIntSupported = gl.getShaderPrecisionFormat(GLConstants_1.FRAGMENT_SHADER, GLConstants_1.HIGH_INT) !== 0;
            this._limits.minimumAliasedLineWidth = gl.getParameter(GLConstants_1.ALIASED_LINE_WIDTH_RANGE)[0]; //must include 1
            this._limits.maximumAliasedLineWidth = gl.getParameter(GLConstants_1.ALIASED_LINE_WIDTH_RANGE)[1];
            this._limits.minimumAliasedPointSize = gl.getParameter(GLConstants_1.ALIASED_POINT_SIZE_RANGE)[0];
            this._limits.maximumAliasedPointSize = gl.getParameter(GLConstants_1.ALIASED_POINT_SIZE_RANGE)[1]; //must include 1
            this._limits.maximumViewportWidth = gl.getParameter(GLConstants_1.MAX_VIEWPORT_DIMS)[0];
            this._limits.maximumViewportHeight = gl.getParameter(GLConstants_1.MAX_VIEWPORT_DIMS)[1];
        }
    }, {
        key: '_map',

        /**
         * map the limits to GLLimits instance
         */
        value: function _map() {
            for (var key in this._limits) {
                if (this._limits.hasOwnProperty(key)) {
                    var target = this._limits[key];
                    if (!this[key] && !!target) this[key] = target;
                }
            }
        }
    }]);
    return GLLimits;
}();

var GLLimits_1 = GLLimits;

/**
 * 
 * 提供 buffer,vertexbuffer,indexbuffer 三种类型
 * -vertexbuffer对应draw
 * -indexbuffer对应element draw
 */

var EMPTY_BUFFER = new ArrayBuffer(0);

/**
 * @class
 */

var GLBuffer = function (_Dispose) {
  inherits(GLBuffer, _Dispose);

  /**
   * 
   * @param {WebGLRenderingContext} gl 
   * @param {gl.ArrayBuffer|gl.ELEMENT_ARRAY_BUFFER} type 
   * @param {ArrayBuffer|SharedArrayBuffer|ArrayBufferView} data an array of data
   * @param {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW} drawType 
   */
  function GLBuffer(gl, type, data, drawType) {
    classCallCheck(this, GLBuffer);

    var _this = possibleConstructorReturn(this, (GLBuffer.__proto__ || Object.getPrototypeOf(GLBuffer)).call(this));

    _this._gl = gl;
    _this._type = type || GLConstants_1.ARRAY_BUFFER;
    _this._data = data || EMPTY_BUFFER;
    _this._drawType = drawType || GLConstants_1.STATIC_DRAW;
    _this._handle = _this._createHandle();
    return _this;
  }
  /**
   * 创建句柄/对象
   */


  createClass(GLBuffer, [{
    key: '_createHandle',
    value: function _createHandle() {
      var gl = this._gl;
      return gl.createBuffer();
    }
    /**
     * 资源销毁
     */

  }, {
    key: 'dispose',
    value: function dispose() {
      var gl = this._gl;
      gl.deleteBuffer(this.handle);
    }
    /**
     * bind buffer
     */

  }, {
    key: 'bind',
    value: function bind() {
      var gl = this._gl;
      gl.bindBuffer(this._type, this._handle);
    }
    /**
     * 获取buffer的长度
     */

  }, {
    key: 'len',
    get: function get$$1() {
      return this._data.length;
    }
    /**
     * 获取buffer data 的type,例如 gl.Float
     */

  }, {
    key: 'type',
    get: function get$$1() {
      return this._type;
    }
    /**
     * 绘制类型
     */

  }, {
    key: 'drawType',
    get: function get$$1() {
      return this._drawType;
    }
    /**
     * 获取buffer的Float32aArray类型数据
     * @readonly
     * @memberof GLBuffer
     * @return {Float32Array} 
     */

  }, {
    key: 'float32',
    get: function get$$1() {
      var array = this._data;
      return new Float32Array(array);
    }
  }]);
  return GLBuffer;
}(Dispose_1);



var GLBuffer_1 = GLBuffer;

/**
 * 
 */

/**
 * @class
 */

var GLVertexbuffer = function (_GLBuffer) {
  inherits(GLVertexbuffer, _GLBuffer);

  /**
   * 
   * @param {WebGLRenderingContext} gl 
   * @param {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} data 
   * @param {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW} drawType 
   */
  function GLVertexbuffer(gl, data, drawType) {
    classCallCheck(this, GLVertexbuffer);
    return possibleConstructorReturn(this, (GLVertexbuffer.__proto__ || Object.getPrototypeOf(GLVertexbuffer)).call(this, gl, GLConstants_1.ARRAY_BUFFER, data, drawType));
  }

  return GLVertexbuffer;
}(GLBuffer_1);

var GLVertexbuffer_1 = GLVertexbuffer;

/**
 *
 */

/**
 * @class
 */

var GLIndexbuffer = function (_GLBuffer) {
  inherits(GLIndexbuffer, _GLBuffer);

  /**
   * 
   * @param {WebGLRenderingContext} gl 
   * @param {ArrayBuffer| SharedArrayBuffer|ArrayBufferView} data 
   * @param {gl.STATIC_DRAW|gl.DYNAMIC_DRAW|gl.STREAM_DRAW} drawType 
   */
  function GLIndexbuffer(gl, data, drawType) {
    classCallCheck(this, GLIndexbuffer);
    return possibleConstructorReturn(this, (GLIndexbuffer.__proto__ || Object.getPrototypeOf(GLIndexbuffer)).call(this, gl, GLConstants_1.ELEMENT_ARRAY_BUFFER, data, drawType));
  }

  return GLIndexbuffer;
}(GLBuffer_1);

var GLIndexbuffer_1 = GLIndexbuffer;

/**
 * 使用 ext 扩展的VertexArrayObject
 * reference https://developer.mozilla.org/zh-CN/docs/Web/API/OES_vertex_array_object
 * 
 * @class GLVertexArrayObject
 */

/**
 * @class
 */

var GLVertexArrayObject = function (_Dispose) {
    inherits(GLVertexArrayObject, _Dispose);

    /**
     * @param {WebGLRenderingContext} gl 
     * @param {GLExtension} extension 
     * @param {GLLimits} limits
     */
    function GLVertexArrayObject(gl, extension, limits) {
        classCallCheck(this, GLVertexArrayObject);

        /**
         * @type {WebGLRenderingContext}
         */
        var _this = possibleConstructorReturn(this, (GLVertexArrayObject.__proto__ || Object.getPrototypeOf(GLVertexArrayObject)).call(this));

        _this._gl = gl;
        /**
         * 存储 indexbuffer ，用于重新排列 vertexbuffer顶点
         */
        _this._indexBuffer = null;
        /**
         * 存储 vertexbuffer和其相关属性
         */
        _this._attributes = [];

        /**
         * @type {GLExtension}
         */
        _this._ext = extension ? extension['vertexArrayObject'] : null;
        /**
         * @type {vertexArrayObject}
         */
        _this._handle = _this._createHandle();
        return _this;
    }
    /**
     * 创建vao对象
     * @description polyfill
     * @return va
     */


    createClass(GLVertexArrayObject, [{
        key: '_createHandle',
        value: function _createHandle() {
            var gl = this._gl,
                ext = this._ext;
            if (!!ext) return ext.createVertexArrayOES();
            if (!!gl.createVertexArray) return gl.createVertexArray();
            return null;
        }
        /**
         * 销毁vao对象
         */

    }, {
        key: 'dispose',
        value: function dispose() {}
        /**
         * 绑定上下文
         */

    }, {
        key: 'bind',
        value: function bind() {
            var ext = this._ext,
                gl = this._gl;
            if (!!ext) ext.bindVertexArrayOES(this._handle);else gl.bindVertexArray(this._handle);
        }
        /**
         * 解除上下文绑定
         */

    }, {
        key: 'unbind',
        value: function unbind() {
            var ext = this._ext,
                gl = this._gl;
            if (!!ext) ext.bindVertexArrayOES(null);else gl.bindVertexArray(null);
        }
        /**
         * 启动vertexbuffer和indexbuffer
         */

    }, {
        key: '_active',
        value: function _active() {
            this._activeVertexBuffer();
            this._activeIndexBuffer();
        }
        /**
         * 启用indexbuffer
         */

    }, {
        key: '_activeIndexBuffer',
        value: function _activeIndexBuffer() {
            this._indexBuffer.bind();
        }
        /**
         * bufferData到指定vao
         */

    }, {
        key: '_activeVertexBuffer',
        value: function _activeVertexBuffer() {
            var gl = this._gl;
            //设置 vertexbuffer 
            for (var i = 0, len = this._attributes.length; i < len; i++) {
                var att = this._attributes[i];
                //1.bind buffer
                att.buffer.bind();
                //2.setting vertexAttrib
                gl.vertexAttribPointer(att.location, att.size, att.type, att.normalized, att.stride, att.offset);
            }
        }
        /**
         * 
         * @param {GLVertexBuffer} buffer ,buffer数据存储器
         * @param {number} location ,需要修改的订单属性的索引值，例如 gPositionLocation
         * @param {number} size, 指定数据的纬度，如 [x,y] 则size=2 ,[x,y,z,w] 则size=4
         * @param {boolean} normalized 
         * @param {number} stride 指定连续顶点属性之间的偏移量。如果为0，那么顶点属性会被理解为：它们是紧密排列在一起的。初始值为0。
         * @param {number} offset 指定第一个组件在数组的第一个顶点属性中的偏移量。该数组与GL_ARRAY_BUFFER绑定，储存于缓冲区中。初始值为0；
         */

    }, {
        key: 'addAttribute',
        value: function addAttribute(buffer, location, size, normalized, stride, offset) {
            this._attributes.push({
                glBuffer: buffer,
                location: location,
                size: size,
                type: buffer.type || GLConstants_1.FLOAT,
                normalized: normalized || false,
                stride: stride || 0,
                offset: offset || 0
            });
        }
        /**
         * reference
         * http://www.cnblogs.com/excalibur/articles/1573892.html
         * 使用indexbuffer优势：
         * - 不改动vertexbuffer的情况下，排列绘制顶点顺序
         * - 复用转换后的顶点
         * 但是vertex cache数量有限，尽力将indexbuffer的数据放在相互靠近的地方。
         * @param {GLIndexBuffer} buffer 
         */

    }, {
        key: 'addIndex',
        value: function addIndex(buffer) {
            this._indexBuffer = buffer;
        }
        /**
         * 清空vao对象
         */

    }, {
        key: 'clear',
        value: function clear() {
            this.unbind();
            this.bind();
            this._attributes = [];
            this._indexBuffer = null;
        }
        /**
         * 
         * @param {*} type 
         * @param {*} size 
         * @param {number} offset 
         */

    }, {
        key: 'draw',
        value: function draw(type, size, offset) {
            var gl = this._gl;
            if (!!this._indexBuffer) {
                gl.drawElements(type, size || this._indexBuffer.length, this._indexBuffer.type, (offset || 0) << 1);
            } else {
                gl.drawArrays(type, offset, size || this.size);
            }
        }
        /**
         * 获取vao规格
         */

    }, {
        key: 'size',
        get: function get$$1() {
            var attrib = this._attributes[0];
            return attrib.buffer.length / (attrib.stride / 4 || attrib.size);
        }
    }]);
    return GLVertexArrayObject;
}(Dispose_1);

var GLVertexArrayObject_1 = GLVertexArrayObject;

var GLProgram_1 = createCommonjsModule(function (module) {
    /**
     * reference:
     * https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLProgram
     * https://github.com/pixijs/pixi-gl-core/blob/master/src/GLShader.js
     * https://github.com/pixijs/pixi-gl-core/blob/master/src/shader/extractAttributes.js
     * https://github.com/pixijs/pixi-gl-core/blob/master/src/shader/extractUniforms.js
     * 
     * 合并shader，并缓存进gl，便于之后使用
     * 不提倡luma.gl的写法，即对gl对象添加属性，形如 gl.luma = {}
     * 所以在此类提供两个方法，为不同的实例化
     *
     * -解决 uniform 和 attribute 通过属性即可设置的问题
     * -unifrom 涉及数据类型转换，所以规定属性使用 GLUniform
     * -attribuet 涉及数据转换，规定attribute使用 GLBuffer
     * 
     * @author yellow date 2017/6/12
     */
    var stamp = stamp_1.stamp,
        setId = stamp_1.setId;
    /**
     * 统一使用array方式调用， ..args
     */
    var GLSL_UNIFORM = {
        'float': 'uniform1fv', //(location, value)
        'vec2': 'uniform2fv', //(location, value)
        'vec3': 'uniform3fv', //(location, value)
        'vec4': 'uniform4fv', //(location, value)
        'int': 'uniform1iv', //(location, value)
        'ivec2': 'uniform2iv', //(location, value)
        'ivec3': 'uniform3iv', //(location, value)
        'ivec4': 'uniform4iv', //(location, value)
        'bool': 'uniform1iv', //(location, value)
        'bvec2': 'uniform2iv', //(location, value)
        'bvec3': 'uniform3iv', //(location, value)
        'bvec4': 'uniform4iv', //
        'sampler2D': 'uniform1iv' //(location, value)
    };
    /**
     * 
     */
    var GL_GLSL = {
        'FLOAT': 'float',
        'FLOAT_VEC2': 'vec2',
        'FLOAT_VEC3': 'vec3',
        'FLOAT_VEC4': 'vec4',
        'INT': 'int',
        'INT_VEC2': 'ivec2',
        'INT_VEC3': 'ivec3',
        'INT_VEC4': 'ivec4',
        'BOOL': 'bool',
        'BOOL_VEC2': 'bvec2',
        'BOOL_VEC3': 'bvec3',
        'BOOL_VEC4': 'bvec4',
        'FLOAT_MAT2': 'mat2',
        'FLOAT_MAT3': 'mat3',
        'FLOAT_MAT4': 'mat4',
        'SAMPLER_2D': 'sampler2D'
    };
    /**
     * 
     */
    var GLSL_SIZE = {
        'float': 1,
        'vec2': 2,
        'vec3': 3,
        'vec4': 4,
        'int': 1,
        'ivec2': 2,
        'ivec3': 3,
        'ivec4': 4,
        'bool': 1,
        'bvec2': 2,
        'bvec3': 3,
        'bvec4': 4,
        'mat2': 4,
        'mat3': 9,
        'mat4': 16,
        'sampler2D': 1
    };
    /**
     * 构建gl类型（number）和 glsl类型映射表
     */
    var NATIVE_GL_TABLE = function (keys) {
        var _gl_table = {};
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            _gl_table[GLConstants_1[key]] = GL_GLSL[key];
        }
        return _gl_table;
    }(Object.keys(GL_GLSL));
    /**
     * 获取glsl对象类型的size
     * @param {String} glslType 
     * @return {number}
     */
    var getGLSLTypeSize = function getGLSLTypeSize(glslType) {
        return GLSL_SIZE[glslType];
    };
    /**
     * 获取gltype对应glsl的type
     * @param {number} glType 
     */
    var getGLSLType = function getGLSLType(glType) {
        return NATIVE_GL_TABLE[glType];
    };
    /**
     * glsl类型转换成获取uniform设置属性的方法
     * @param {String} glslType 
     */
    var getUniformFunc = function getUniformFunc(glslType) {
        return GLSL_UNIFORM[glslType];
    };
    /**
     * @class
     */

    var GLProgram = function (_Dispose) {
        inherits(GLProgram, _Dispose);

        /**
         * 创建program
         * @param {WebGLRenderingContext} gl 
         * @param {GLVertexShader} fragmentSource glsl shader文本
         * @param {GLFragmentShader} vertexSource glsl shader文本
         * @param {GLExtension} extension
         * @param {GLLimits} [limits] the context limtis
         * @param {Boolean} [isWebGL2] detect the evn support webgl2
         */
        function GLProgram(gl) {
            var extension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var limits = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var vs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var fs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
            classCallCheck(this, GLProgram);

            /**
             * @type {WebGLRenderingContext}
             */
            var _this = possibleConstructorReturn(this, (GLProgram.__proto__ || Object.getPrototypeOf(GLProgram)).call(this));

            _this._gl = gl;
            /**
             *  program active attribute
             */
            _this._attributes = {};
            /**
             * program active 
             */
            _this._uniforms = {};
            /**
             * store the uniform ids
             */
            _this._uniformIds = {};
            /**
             * @type {GLExtension}
             */
            _this._extension = extension;
            /**
             * @type {GLLimits}
             */
            _this._limits = limits;
            /**
             * 混合存储 oes_vertex_array_object
             * @type {GLVertexArrayObject}
             * @memberof GLProgram
             */
            _this._vao = new GLVertexArrayObject_1(gl, extension, limits);
            /**
             * @type {WebGLProgram}
             */
            _this._handle = _this._createHandle();
            /**
             * vertex_shader
             * @type {GLVertexShader}
             */
            _this._vs = vs || null;
            /**
             * fragment_shader
             * @type {GLFragmentShader}
             */
            _this._fs = fs || null;
            /**
             * attacht shaders to program
             */
            _this._attachShader();
            /**
             * 处理队列
             */
            _this._taskQueue = [];
            return _this;
        }
        /**
         * @private
         */


        createClass(GLProgram, [{
            key: '_attachShader',
            value: function _attachShader() {
                this._vs && this._vs instanceof GLVertexShader_1 ? this._gl.attachShader(this._handle, this._vs.handle) : null;
                this._gl && this._fs instanceof GLFragmentShader_1 ? this._gl.attachShader(this._handle, this._fs.handle) : null;
            }
            /**
             * 获取attribues
             * @readonly
             * @memberof GLProgram
             */

        }, {
            key: 'attachShader',

            /**
             * attach shader
             * @param {GLVertexShader|GLFragmentShader} glShader 
             */
            value: function attachShader(glShader) {
                if (glShader instanceof GLVertexShader_1) {
                    this._vs = glShader;
                    this._gl.attachShader(this._handle, this._vs.handle);
                } else if (glShader instanceof GLFragmentShader_1) {
                    this._fs = glShader;
                    this._gl.attachShader(this._handle, this._fs.handle);
                }
                //
                if (this._vs && this._fs) {
                    this._gl.linkProgram(this._handle);
                    this._extractAttributes();
                    this._extractUniforms();
                }
            }
            /**
             * extract attributes
             * 展开attributes
             */

        }, {
            key: '_extractAttributes',
            value: function _extractAttributes() {
                var _this2 = this;

                var isWebGL2 = !!this._vao.handle,
                    gl = this._gl,
                    vao = this._vao,
                    attribLen = gl.getProgramParameter(this._handle, GLConstants_1.ACTIVE_ATTRIBUTES);
                var attributes = {};
                //get attributes and store mapdata

                var _loop = function _loop(i) {
                    var attrib = gl.getActiveAttrib(_this2._handle, i),
                        type = getGLSLType(attrib.type),
                        name = attrib.name,
                        size = getGLSLTypeSize(type),
                        location = gl.getAttribLocation(_this2._handle, name);
                    Object.defineProperty(attributes, name, {
                        get: function get$$1() {
                            return location;
                        },
                        set: function (gl2, loc, typ, ne, se) {
                            return gl2 ? function (value) {
                                var glBuffer = value;
                                gl.enableVertexAttribArray(location);
                                gl.bindBuffer(glBuffer.type, glBuffer.handle);
                                gl.bufferData(glBuffer.type, glBuffer.float32, glBuffer.drawType);
                                vao.addAttribute(glBuffer, loc, se);
                            } : function (value) {
                                var glBuffer = value;
                                gl.enableVertexAttribArray(location);
                                gl.bindBuffer(glBuffer.type, glBuffer.handle);
                                gl.bufferData(glBuffer.type, glBuffer.float32, glBuffer.drawType);
                                gl.vertexAttribPointer(loc, se, glBuffer.type, false, 0, 0);
                            };
                        }(isWebGL2, location, type, name, size)
                    });
                };

                for (var i = 0; i < attribLen; i++) {
                    _loop(i);
                }
                //
                this._attributes = attributes;
            }
            /**
             * 展开uniforms并map到对象
             * @memberof GLProgram
             */

        }, {
            key: '_extractUniforms',
            value: function _extractUniforms() {
                var _this3 = this;

                var isWebGL2 = !!this._vao.handle,
                    gl = this._gl,
                    uniformsLen = gl.getProgramParameter(this._handle, GLConstants_1.ACTIVE_UNIFORMS);
                var uniforms = {};
                //1.get uniforms and store mapdata

                var _loop2 = function _loop2(i) {
                    var uniform = gl.getActiveUniform(_this3._handle, i),
                        type = getGLSLType(uniform.type),
                        name = uniform.name.replace(/\[.*?\]/, ""),
                        size = uniform.size,
                        location = gl.getUniformLocation(_this3._handle, name);
                    //map the WebGLUniformLocation
                    setId(location, _this3._id);
                    //提供attribute属性访问
                    Object.defineProperty(uniforms, name, {
                        /**
                         * 
                         */
                        get: function get$$1() {
                            return location;
                        },
                        /**
                         * @param {glMatrix.*} value
                         */
                        set: function set$$1(value) {
                            var funcName = getUniformFunc(type);
                            gl[funcName](location, value);
                        }
                    });
                };

                for (var i = 0; i < uniformsLen; i++) {
                    _loop2(i);
                }
                //
                this._uniforms = uniforms;
            }
        }, {
            key: '_createHandle',
            value: function _createHandle() {
                var gl = this._gl,
                    program = gl.createProgram();
                setId(program, this.id);
                return program;
            }
        }, {
            key: 'useProgram',
            value: function useProgram() {
                var gl = this._gl;
                gl.useProgram(this.handle);
                // this._extractAttributes();
                // this._extractUniforms();
            }
        }, {
            key: 'drawElements',
            value: function drawElements(mode, count, type, offset) {
                var gl = this._gl;
                gl.drawElements(mode, count, type, offset);
            }
            /**
             * @param {number} index 
             */

        }, {
            key: 'getActiveAttrib',
            value: function getActiveAttrib(index) {
                var gl = this._gl;
                return gl.getActiveAttrib(this._handle, index);
            }
            /**
             * 获取attribute地址
             * @param {String} name
             * @return {number} 
             */

        }, {
            key: 'getAttribLocation',
            value: function getAttribLocation(name) {
                var attributeLocation = this._gl.getAttribLocation(this.handle, name);
                return attributeLocation;
            }
            /**
             * 获取uniform地址
             * @param {String} name 
             * @return {number} 
             */

        }, {
            key: 'getUniformLocation',
            value: function getUniformLocation(name) {
                var uniformLocation = this._gl.getUniformLocation(this.handle, name);
                return uniformLocation;
            }
            /**
             * 清理绑定信息，销毁program对象
             */

        }, {
            key: 'dispose',
            value: function dispose() {
                var gl = this._gl;
                gl.deleteProgram(this._handle);
            }
            /**
             * 绘制
             * @param {gl.TRIANGLES|gl.POINTS} primitiveType 
             * @param {number} offset 
             * @param {number} count 
             */

        }, {
            key: 'drawArrays',
            value: function drawArrays(primitiveType, offset, count) {
                var gl = this._gl;
                gl.drawArrays(primitiveType || GLConstants_1.TRIANGLES, offset || 0, count || 6);
            }
            /**
             * 处理队列更新操作
             */

        }, {
            key: 'update',
            value: function update() {
                var taskQueue = this._taskQueue,
                    gl = this._gl;
                var task = taskQueue.shift();
                while (!!task) {
                    gl[task.name].apply(gl, toConsumableArray(task.args));
                    task = taskQueue.shift();
                }
            }
        }, {
            key: 'enQueue',
            value: function enQueue(name, args) {
                this._taskQueue.push({ name: name, args: args });
            }
        }, {
            key: 'attributes',
            get: function get$$1() {
                return this._attributes;
            }
        }, {
            key: 'uniforms',

            /**
             * 获取unfiroms
             * @readonly
             * @memberof GLProgram
             */
            get: function get$$1() {
                return this._uniforms;
            }
        }]);
        return GLProgram;
    }(Dispose_1);

    

    module.exports = GLProgram;
});

/**
 * warpped the WebGLRenderingContext
 * 管理
 * -cache
 * -program
 * -matrix
 * -extension
 * -limits
 * 
 * 特点：
 * reference https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmapRenderingContext/transferFromImageBitmap
 * 使用 OffscreenCanvas 创建不可见绘制canvas,后基于此canvas绘制图像，并保存成bitmap缓存帧
 * var htmlCanvas = document.getElementById("htmlCanvas").getContext("bitmaprenderer");
 * //
 * var offscreen = new OffscreenCanvas(256, 256);
 * var gl = offscreen.getContext("webgl");
 * var bitmap = offscreen.transferToImageBitmap();
 * //
 * 预留一定的帧数后，使用bitmaprender绘制bitmap到前端canvas即可
 * htmlCanvas.transferFromImageBitmap(bitmap);
 * 
 * context相当于webglRender
 * 
 * @author yellow 2017/6/11
 * @modify yellow 2017/8/8
 * 
 * 
 */
var stamp = stamp_1.stamp;
/**
 * @class
 * @example
 * let cvs = document.createElement('canvas'),
 *  ctx = new Context(cvs);
 */

var GLContext = function (_Dispose) {
    inherits(GLContext, _Dispose);

    /**
     * @param {htmlCanvas} canvas
     * @param {Object} [options]
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {String} [options.renderType] 'webgl'、'webgl2'
     * @param {boolean} [options.alpha] default is false,but gl default is true
     * @param {boolean} [options.stencil] default is true,but gl default is false.the stencilBuffer to draw color and depth
     * @param {boolean} [options.depth] enable gl depth
     * @param {boolean} [options.antialias] enable antialias,default is false
     * @param {boolean} [options.premultipliedAlpha] enable premultipliedAlpha,default is true , webgl2
     * @param {boolean} [options.preserveDrawingBuffer] enable preserveDrawingBuffer,default is false , webgl2
     */
    function GLContext() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, GLContext);

        /**
         * @type {HtmlCanvas}
         */
        var _this = possibleConstructorReturn(this, (GLContext.__proto__ || Object.getPrototypeOf(GLContext)).call(this));

        _this._canvas = options.canvas || null;
        /**
         * context类型，支持webgl,webgl2
         * @type {String} default is 'webgl'
         */
        _this._renderType = options.renderType || 'webgl';
        /**
         * 设置允许透明度
         * @type {boolean}
         */
        _this._alpha = options.alpha || false;
        /**
         * 是否启用缓冲区
         * @type {boolean}
         */
        _this._stencil = options.stencil || true;
        /**
         * 设置绘制depth属性
         * @type {boolean}
         */
        _this._depth = options.depth || true;
        /**
         * 抗锯齿
         * @type {boolean}
         */
        _this._antialias = options.antialias || false;
        /**
         * 设置材质属性
         */
        _this._premultipliedAlpha = options.premultipliedAlpha || true;
        /**
         * get context setting
         * @memberof Context
         */
        _this._preserveDrawingBuffer = options.preserveDrawingBuffer || false;
        /**
         * @type {boolean}
         */
        _this._allowTextureFilterAnisotropic = options.allowTextureFilterAnisotropic || true;
        /**
         *  @type {WebGLRenderingContext}
         */
        _this._gl = options.gl || _this._createHandle();
        /**
         * webgl扩展
         * @type {GLExtension}
         */
        _this._glExtension = _this._includeExtension();
        /**
         * get parameter and extensions
         */
        _this._glLimits = _this._includeLimits();
        /**
         * the program cache
         * @type {Object}
         */
        _this._programCache = {};
        /**
         * the shader cache
         * @type {Object}
         */
        _this._shaderCache = {};
        /**
         * @type {GLProgram}
         */
        _this._currentProgram = null;
        /**
         * setup env
         */
        _this._setup();
        /**
         * map glContext to Context
         */
        _this._map();
        return _this;
    }

    createClass(GLContext, [{
        key: '_createHandle',

        /**
         * 兼容写法，创建非可见区域canvas，用户做缓冲绘制
         * 待绘制完成后，使用bitmaprender绘制到实际页面上
         * @memberof Context
         */
        value: function _createHandle() {
            if (!isNode_1) {
                var gl = this._canvas.getContext(this._renderType, this.getContextAttributes()) || this._canvas.getContext('experimental-' + this._renderType, this.getContextAttributes());
                return gl;
            } else {
                // const GL = require('gl'),
                // return GL(this._width, this._height);
            }
        }
    }, {
        key: '_includeExtension',

        /**
         * Query and initialize extensions
         */
        value: function _includeExtension() {
            var gl = this._gl;
            return new GLExtension_1(gl);
        }
    }, {
        key: '_includeLimits',

        /**
         * hardware
         */
        value: function _includeLimits() {
            var gl = this._gl;
            return new GLLimits_1(gl);
        }
    }, {
        key: 'renderToCanvas',

        /**
         * 兼容写法
         * -如果支持最新的bitmaprenderer则使用此方法
         * -如果不支持，则使用 canvas2d 贴图绘制
         * @param {HTMLCanvasElement} canvas
         * @memberof Context
         */
        value: function renderToCanvas(canvas) {
            //}{debug adjust canvas to fit the output
            canvas.width = this._width;
            canvas.height = this._height;
            var _canvas = this._canvas;
            //
            var image = new Image();
            image.src = _canvas.toDataURL("image/png");
            //
            var renderContext = canvas.getContext('bitmaprenderer') || canvas.getContext('2d');
            !!renderContext.transferFromImageBitmap ? renderContext.transferFromImageBitmap(image) : renderContext.drawImage(image, 0, 0);
        }
        /**
         * get context attributes
         * include webgl2 attributes
         * reference https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
         * 
         */

    }, {
        key: 'getContextAttributes',
        value: function getContextAttributes() {
            return {
                alpha: this._alpha,
                depth: this._depth,
                stencil: this._stencil,
                antialias: this._antialias,
                premultipliedAlpha: this._premultipliedAlpha,
                preserveDrawingBuffer: this._preserveDrawingBuffer,
                //如果系统性能较低，也会创建context
                failIfMajorPerformanceCaveat: true
            };
        }
    }, {
        key: '_setup',

        /**
         * 设置绘制区域的规则
         * 1. 混合颜色
         * 2. 深度
         * 3.
         */
        value: function _setup() {
            var gl = this._gl;
            //reference http://www.cppblog.com/wc250en007/archive/2012/07/18/184088.html
            //gl.ONE 使用1.0作为因子，相当于完全使用了这种颜色参与混合运算
            //gl.ONE_MINUS_SRC_ALPHA 使用1.0-源颜色alpha值作为因子，
            //作用为：源颜色的alpha作为不透明度，即源颜色alpha值越大，混合时占比越高，混合时最常用的方式
            gl.enable(GLConstants_1.BLEND);
            gl.blendFunc(GLConstants_1.ONE, GLConstants_1.ONE_MINUS_SRC_ALPHA);
            //为了模仿真实物体和透明物体的混合颜色，需要使用深度信息
            //http://www.cnblogs.com/aokman/archive/2010/12/13/1904723.html
            //模版缓存区测试，用来对比当前值与预设值，用以判断是否更新此值
            //顺序为：(framment + associated data) - pixel ownership test - scissor test
            //       - alpha test - stencil test - depth test
            //       - blending - dithering - logic op - framebuffer
            //在模板测试的过程中，可以先使用一个比较用掩码（comparison mask）与模板缓冲区中的值进行位与运算，
            //再与参考值进行比较，从而实现对模板缓冲区中的值的某一位上的置位状态的判断。
            gl.enable(GLConstants_1.STENCIL_TEST);
            //gl.stencilFunc(gl)
            gl.enable(GLConstants_1.DEPTH_TEST);
            gl.depthFunc(GLConstants_1.LEQUAL); //深度参考值小于模版值时，测试通过
            gl.depthMask(false);
        }
        /**
         * map相关属性与方法
         */

    }, {
        key: '_map',
        value: function _map() {
            //map constant
            for (var key in GLConstants_1) {
                if (!this.hasOwnProperty(key)) {
                    var target = GLConstants_1[key];
                    if (!this[key] && !!target) this[key] = target;
                }
            }
        }
        /**
         *  加载shaders
         */

    }, {
        key: '_includeShaders',
        value: function _includeShaders() {
            var gl = this._gl,
                names = shadersName,

            //limits=this._glLimits,
            extension = this._glExtension;

            for (var i = 0, len = names.length; i < len; i++) {
                var name = names[i];
                this._shaderCache[name] = ShaderFactory.create(name, gl, extension);
            }
        }
        /**
         * 加载prgorams
         */

    }, {
        key: '_includePrograms',
        value: function _includePrograms() {
            var gl = this._gl,
                limits = this._glLimits,
                names = shadersName,
                extension = this._glExtension,
                shaderCache = this._shaderCache;

            for (var i = 0, len = names.length; i < len; i++) {
                var name = names[i];
                var shaders = shaderCache[name];
                var program = new GLProgram_1(gl, shaders[0], shaders[1], extension, limits);
                this._programCache[name] = program;
                gl.linkProgram(program.handle);
            }
        }
        /**
         * 
         * @param {GLProgram} programs 
         */

    }, {
        key: 'mergeProrgam',
        value: function mergeProrgam() {
            var _ref;

            var gl = this._gl,
                _programList = (_ref = []).concat.apply(_ref, arguments),
                len = _programList.length;
            //map to programs
            for (var i = 0; i < len; i++) {
                var _program = _programList[i],
                    _id = _program.id;
                if (!this._programCache[_id]) {
                    this._programCache[_id] = _program;
                    gl.linkProgram(_program.handle);
                }
            }
        }
        /**
         * @param {WebGLProgram} program
         */

    }, {
        key: 'useProgram',
        value: function useProgram(program) {
            var gl = this._gl;
            this._program = program;
            gl.program = program;
            gl.useProgram(program);
        }
        /**
         * @return {WebGLProgram}
         */

    }, {
        key: 'createProgram',
        value: function createProgram() {
            var gl = this._gl;
            //1.创建GLProgram
            var glProgram = new GLProgram_1(gl);
            //2.缓存program
            this._programCache[glProgram.id] = glProgram;
            //3.兼容，返回句柄
            return glProgram.handle;
        }
        /**
         * 获取canvas
         */

    }, {
        key: 'getExtension',

        /**
         * 获取extension
         */
        value: function getExtension(name) {
            var glExtension = this._glExtension;
            return glExtension.getExtension(name);
        }
        /**
         * 
         * @param {number|GLConstants} number 枚举
         */

    }, {
        key: 'getParameter',
        value: function getParameter(number) {
            var gl = this._gl;
            return gl.getParameter(number);
        }
        /**
         * map to texture
         */

    }, {
        key: 'createTexture',
        value: function createTexture() {
            var gl = this._gl;
            return gl.createTexture();
        }
        /**
         * 
         * @param {number} target 
         * @param {texture} texture 
         */

    }, {
        key: 'bindTexture',
        value: function bindTexture(target, texture) {
            var gl = this._gl;
            gl.bindTexture(target, texture);
        }
        /**
         * 
         * @param {number} target 
         * @param {number} pname 
         * @param {number} param 
         */

    }, {
        key: 'texParameteri',
        value: function texParameteri(target, pname, param) {
            var gl = this._gl;
            gl.texParameteri(target, pname, param);
        }
        /**
         * @param {number} target 
         * @param {number} level 
         * @param {number} internalformat 
         * @param {number} width 
         * @param {number} height 
         * @param {number} border 
         * @param {number} format 
         * @param {number} type 
         * @param {ArrayBufferView} pixels 
         */

    }, {
        key: 'texImage2D',
        value: function texImage2D(target, level, internalformat, width, height, border, format, type, pixels) {
            var gl = this._gl;
            gl.texImage2D(target, level, internalformat, width, height, border, format, type, pixels);
        }
        /**
         * 
         * @param {number} cap 
         */

    }, {
        key: 'enable',
        value: function enable(cap) {
            var gl = this._gl;
            gl.enable(cap);
        }
        /**
         * 
         * @param {number} cap 
         */

    }, {
        key: 'disable',
        value: function disable(cap) {
            var gl = this._gl;
            gl.disable(cap);
        }
        /**
         * 
         * @param {number} func 
         */

    }, {
        key: 'depthFunc',
        value: function depthFunc(func) {
            var gl = this._gl;
            gl.depthFunc(func);
        }
        /**
         * 
         * @param {number} red 
         * @param {number} green 
         * @param {number} blue 
         * @param {number} alpha 
         */

    }, {
        key: 'clearColor',
        value: function clearColor(red, green, blue, alpha) {
            var gl = this._gl;
            //gl.clearColor(red,green,blue,alpha);
        }
        /**
         * 
         * @param {number} depth 
         */

    }, {
        key: 'clearDepth',
        value: function clearDepth(depth) {
            var gl = this._gl;
            //gl.clearDepth(depth);
        }
        /**
         * 
         * @param {number} mask 
         */

    }, {
        key: 'clear',
        value: function clear(mask) {
            var gl = this._gl;
            //gl.clear(mask);
        }
        /**
         * 
         * @param {GLenum} s 
         */

    }, {
        key: 'clearStencil',
        value: function clearStencil(s) {
            var gl = this._gl;
            //gl.clearStencil(s);
        }
        /**
         * 
         * @param {number} mode 
         */

    }, {
        key: 'frontFace',
        value: function frontFace(mode) {
            var gl = this._gl;
            gl.frontFace(mode);
        }
        /**
         * 
         * @param {number} mode 
         */

    }, {
        key: 'cullFace',
        value: function cullFace(mode) {
            var gl = this._gl;
            gl.cullFace(mode);
        }
        /**
         * 
         * @param {number} type 
         */

    }, {
        key: 'createShader',
        value: function createShader(type) {
            var gl = this._gl,
                glExtension = this._glExtension;
            var glShader = null;
            if (type === GLConstants_1.VERTEX_SHADER) {
                glShader = new GLVertexShader_1(gl, null, glExtension);
            } else if (type === GLConstants_1.FRAGMENT_SHADER) {
                glShader = new GLFragmentShader_1(gl, null, glExtension);
            }
            if (!!glShader) {
                this._shaderCache[glShader.id] = glShader;
                return glShader.handle;
            }
            return null;
        }
        /**
         * 
         * @param {WebGLShader} shader 
         * @param {String} source 
         */

    }, {
        key: 'shaderSource',
        value: function shaderSource(shader, source) {
            var glShader = this._shaderCache[stamp(shader)];
            glShader.source = source;
        }
        /**
         * @param {WebGLShader} shader 
         */

    }, {
        key: 'compileShader',
        value: function compileShader(shader) {
            var glShader = this._shaderCache[stamp(shader)];
            glShader.compile();
        }
        /**
         * 
         * @param {WebGLShader} shader 
         * @param {number} pname 
         */

    }, {
        key: 'getShaderParameter',
        value: function getShaderParameter(shader, pname) {
            var gl = this._gl;
            return gl.getShaderParameter(shader, pname);
        }
        /**
         * 
         * @param {WebGLShader} shader 
         */

    }, {
        key: 'deleteShader',
        value: function deleteShader(shader) {
            var gl = this._gl;
            gl.deleteShader(shader);
        }
        /**
         * @return {WebGLBuffer}
         */

    }, {
        key: 'createBuffer',
        value: function createBuffer() {
            var gl = this._gl;
            return gl.createBuffer();
        }
        /**
         * 
         * @param {number} target 
         * @param {WebGLBuffer} buffer 
         */

    }, {
        key: 'bindBuffer',
        value: function bindBuffer(target, buffer) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            return gl.bindBuffer(target, buffer);
        }
        /**
         * 
         * @param {number} target 
         * @param {number | ArrayBufferView | ArrayBuffer} size 
         * @param {number} usage 
         */

    }, {
        key: 'bufferData',
        value: function bufferData(target, size, usage) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.bufferData(target, size, usage);
        }
        /**
         * 
         * @param {number} pname 
         * @param {number|boolean} param 
         */

    }, {
        key: 'pixelStorei',
        value: function pixelStorei(pname, param) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.pixelStorei(pname, param);
        }
        /**
         * 
         * @param {number} target 
         */

    }, {
        key: 'generateMipmap',
        value: function generateMipmap(target) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.generateMipmap(target);
        }
        /**
         * 
         * @param {number} x 
         * @param {number} y 
         * @param {number} width 
         * @param {number} height 
         */

    }, {
        key: 'viewport',
        value: function viewport(x, y, width, height) {
            var gl = this._gl;
            gl.viewport(x, y, width, height);
        }
        /**
         * 
         * @param {WebGLProgram} program 
         * @param {WebGLShader} shader 
         */

    }, {
        key: 'attachShader',
        value: function attachShader(program, shader) {
            var gl = this._gl;
            //1.获取shader和program
            var glProgram = this._programCache[stamp(program)];
            var glShader = this._shaderCache[stamp(shader)];
            glProgram.attachShader(glShader);
        }
        /**
         * no needs to implement this function
         * @param {WebGLProgram} program 
         */

    }, {
        key: 'linkProgram',
        value: function linkProgram(program) {}
        /**
         * 
         * @param {WebGLProgram} program 
         * @param {number} pnam 
         * @return {any}
         */

    }, {
        key: 'getProgramParameter',
        value: function getProgramParameter(program, pnam) {
            var gl = this._gl;
            return gl.getProgramParameter(program, pnam);
        }
        /**
         * 
         * @param {WebGLProgram} program 
         * @param {number} index 
         * @return {WebGLActiveInfo}
         */

    }, {
        key: 'getActiveUniform',
        value: function getActiveUniform(program, index) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            return gl.getActiveUniform(program, index);
        }
        /**
         * 
         * @param {WebGLProgram} program 
         * @param {number} name 
         * @return {WebGLUniformLocation}
         */

    }, {
        key: 'getUniformLocation',
        value: function getUniformLocation(program, name) {
            var glProgram = this._programCache[stamp(program)];
            return glProgram.uniforms[name];
        }
        /**
         * 
         * @param {WebGLProgram} program 
         * @param {number} index 
         * @return {WebGLActiveInfo}
         */

    }, {
        key: 'getActiveAttrib',
        value: function getActiveAttrib(program, index) {
            var glProgram = this._programCache[stamp(program)];
            return glProgram.getActiveAttrib(index);
        }
        /**
         * 
         * @param {WebGLProgram} program 
         * @param {number} name 
         * @return {number}
         */

    }, {
        key: 'getAttribLocation',
        value: function getAttribLocation(program, name) {
            var glProgram = this._programCache[stamp(program)];
            return glProgram.attributes[name];
        }
        /**
         * 
         * @param {number} index 
         */

    }, {
        key: 'enableVertexAttribArray',
        value: function enableVertexAttribArray(index) {
            var gl = this._gl;
            gl.enableVertexAttribArray(index);
        }
        /**
         * 
         * @param {number} index 
         * @param {number} size 
         * @param {number} type 
         * @param {boolean} normalize 
         * @param {number} stride 
         * @param {number} offset 
         */

    }, {
        key: 'vertexAttribPointer',
        value: function vertexAttribPointer(index, size, type, normalize, stride, offset) {
            var gl = this._gl;
            gl.vertexAttribPointer(index, size, type, normalize, stride, offset);
        }
        /**
         * 
         * @param {WebGLUniformLocation} location 
         * @param {number} x 
         * @param {number} y 
         * @param {number} z 
         */

    }, {
        key: 'uniform3f',
        value: function uniform3f(location, x, y, z) {
            //const glProgram = this._programCache[stamp(location)];
            //glProgram.enQueue('uniform3f',[location,x,y,z]);
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.uniform3f(location, x, y, z);
        }
        /**
         * 
         * @param {WebGLUniformLocation} location 
         * @param {Float32Array|number[]} v 
         */

    }, {
        key: 'uniform3fv',
        value: function uniform3fv(location, v) {
            //const glProgram = this._programCache[stamp(location)];
            //glProgram.enQueue('uniform3fv',[location, v]);
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.uniform3fv(location, v);
        }
        /**
         * 
         * @param {WebGLUniformLocation} location 
         * @param {Float32Array|number[]} v 
         */

    }, {
        key: 'uniform4fv',
        value: function uniform4fv(location, v) {
            //const glProgram = this._programCache[stamp(location)];
            //glProgram.enQueue('uniform4fv',[location, v]);
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.uniform4fv(location, v);
        }
        /**
         * 
         * @param {WebGLUniformLocation} location 
         * @param {number} x 
         */

    }, {
        key: 'uniform1f',
        value: function uniform1f(location, x) {
            //const glProgram = this._programCache[stamp(location)];
            //glProgram.enQueue('uniform1f',[location, x]);
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.uniform1f(location, x);
        }
        /**
         * 
         * @param {WebGLUniformLocation} location 
         * @param {Float32Array|number[]} v 
         */

    }, {
        key: 'uniform1fv',
        value: function uniform1fv(location, v) {
            //const glProgram = this._programCache[stamp(location)];
            //glProgram.enQueue('uniform1fv',[location, v]);
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.uniform1fv(location, v);
        }
        /**
         * 
         * @param {WebGLUniformLocation} location 
         * @param {boolean} transpose
         * @param {Float32Array | number[]} v
         */

    }, {
        key: 'uniformMatrix3fv',
        value: function uniformMatrix3fv(location, transpose, v) {
            //const glProgram = this._programCache[stamp(location)];
            //glProgram.enQueue('uniformMatrix3fv',[location,transpose,v]);
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.uniformMatrix3fv(location, transpose, v);
        }
        /**
         * 
         * @param {WebGLUniformLocation} location 
         * @param {boolean} transpose
         * @param {Float32Array | number[]} v
         */

    }, {
        key: 'uniformMatrix4fv',
        value: function uniformMatrix4fv(location, transpose, v) {
            //const glProgram = this._programCache[stamp(location)];
            //glProgram.enQueue('uniformMatrix4fv',[location,transpose,v]);
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.uniformMatrix4fv(location, transpose, v);
        }
        /**
         * 
         * @param {WebGLUniformLocation} location 
         * @param {number} x 
         */

    }, {
        key: 'uniform1i',
        value: function uniform1i(location, x) {
            //const glProgram = this._programCache[stamp(location)];
            //glProgram.enQueue('uniform1i',[location,x]);
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.uniform1i(location, x);
        }
        /**
         * 
         * @param {number} texture 
         */

    }, {
        key: 'activeTexture',
        value: function activeTexture(texture) {
            var gl = this._gl;
            gl.activeTexture(texture);
        }
        /**
         * 
         * @param {number} mode 
         * @param {number} count 
         * @param {number} type 
         * @param {number} offset 
         */

    }, {
        key: 'drawElements',
        value: function drawElements(mode, count, type, offset) {
            // const programCache = this._programCache;
            // for(const key in programCache){
            //     const glProgram = programCache[key];
            //     glProgram.useProgram();
            //     glProgram.update();
            //     glProgram.drawElements(mode, count, type, offset);
            // }
            //
            var gl = this._gl;
            gl.drawElements(mode, count, type, offset);
        }
        /**
         * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendEquationSeparate
         * used to set the RGB blend equation and alpha blend equation separately.
         * The blend equation determines how a new pixel is combined with a pixel already in the WebGLFramebuffer
         * @param {GLenum} modeRGB 
         * @param {GLenum} modeAlpha 
         */

    }, {
        key: 'blendEquationSeparate',
        value: function blendEquationSeparate(modeRGB, modeAlpha) {
            var gl = this._gl;
            gl.blendEquationSeparate(modeRGB, modeAlpha);
        }
        /**
         * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate
         * defines which function is used for blending pixel arithmetic for RGB and alpha components separately.
         * 
         * @param {number|GLenum} srcRGB 
         * @param {number|GLenum} dstRGB 
         * @param {number|GLenum} srcAlpha 
         * @param {number|GLenum} dstAlpha 
         */

    }, {
        key: 'blendFuncSeparate',
        value: function blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha) {
            var gl = this._gl;
            gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
        }
        /**
         * 
         * @param {number} mode 
         */

    }, {
        key: 'blendEquation',
        value: function blendEquation(mode) {
            var gl = this._gl;
            gl.blendEquation(mode);
        }
        /**
         * 
         * @param {number} sfactor 
         * @param {number} dfactor 
         */

    }, {
        key: 'blendFunc',
        value: function blendFunc(sfactor, dfactor) {
            var gl = this._gl;
            gl.blendFunc(sfactor, dfactor);
        }
        /**
         * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/scissor
         * sets a scissor box, which limits the drawing to a specified rectangle.
         * 
         * turn on scissor test to open
         * gl.enable(gl.SCISSSOR_TEST);
         * 
         * @param {number} x 
         * @param {number} y 
         * @param {number} widht 
         * @param {number} height 
         */

    }, {
        key: 'scissor',
        value: function scissor(x, y, widht, height) {
            var gl = this._gl;
            gl.scissor(x, y, widht, height);
        }
    }, {
        key: 'stencilOp',
        value: function stencilOp(fail, zfail, zpass) {
            var gl = this._gl;
            gl.stencilOp(fail, zfail, zpass);
        }
    }, {
        key: 'stencilFunc',
        value: function stencilFunc(func, ref, mask) {
            var gl = this._gl;
            gl.stencilFunc(func, ref, mask);
        }
    }, {
        key: 'stencilMask',
        value: function stencilMask(mask) {
            var gl = this._gl;
            gl.stencilMask(mask);
        }
        /**
         * 
         * @param {boolean} flag 
         */

    }, {
        key: 'depthMask',
        value: function depthMask(flag) {
            var gl = this._gl;
            gl.depthMask(flag);
        }
        /**
         * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/colorMask
         * sets which color components to enable or to disable when drawing or rendering to a WebGLFramebuffer
         * @param {boolean} red 
         * @param {boolean} green 
         * @param {boolean} blue 
         * @param {boolean} alpha 
         */

    }, {
        key: 'colorMask',
        value: function colorMask(red, green, blue, alpha) {
            var gl = this._gl;
            gl.colorMask(red, green, blue, alpha);
        }
        /**
         * @param {WebGLProgram} program
         * @return {String}
         */

    }, {
        key: 'getProgramInfoLog',
        value: function getProgramInfoLog(program) {
            var gl = this._gl;
            return gl.getProgramInfoLog(program);
        }
        /**
         * @param {WebGLShader} shader 
         * @return {String}
         */

    }, {
        key: 'getShaderInfoLog',
        value: function getShaderInfoLog(shader) {
            var gl = this._gl;
            return gl.getShaderInfoLog(shader);
        }
        /**
         * 
         * @param {number} width 
         */

    }, {
        key: 'lineWidth',
        value: function lineWidth(width) {
            var gl = this._gl;
            gl.lineWidth(width);
        }
        /**
         * 
         * @param {number} target 
         * @param {number} mode 
         */

    }, {
        key: 'hint',
        value: function hint(target, mode) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.hint(target, mode);
        }
        /**
         * webgl2 support
         */

    }, {
        key: 'createTransformFeedback',
        value: function createTransformFeedback() {
            var gl = this._gl;
            return gl.createTransformFeedback ? gl.createTransformFeedback() : null;
        }
        /**
         * webgl2 support
         * @param {*} target 
         * @param {*} transformFeedback 
         */

    }, {
        key: 'bindTransformFeedback',
        value: function bindTransformFeedback(target, transformFeedback) {
            var gl = this._gl;
            return gl.bindTransformFeedback ? gl.bindTransformFeedback(target, transformFeedback) : null;
        }
    }, {
        key: 'getError',
        value: function getError() {
            var gl = this._gl;
            return gl.getError();
        }
    }, {
        key: 'deleteBuffer',
        value: function deleteBuffer(buffer) {
            var gl = this._gl;
            gl.deleteBuffer(buffer);
        }
    }, {
        key: 'deleteShader',
        value: function deleteShader(shader) {
            var gl = this._gl;
            gl.deleteShader(shader);
        }
    }, {
        key: 'deleteProgram',
        value: function deleteProgram(program) {
            var gl = this._gl;
            gl.deleteProgram(program);
        }
    }, {
        key: 'deleteFramebuffer',
        value: function deleteFramebuffer(framebuffer) {
            var gl = this._gl;
            gl.deleteFramebuffer(framebuffer);
        }
    }, {
        key: 'deleteRenderbuffer',
        value: function deleteRenderbuffer(renderbuffer) {
            var gl = this._gl;
            gl.deleteRenderbuffer(renderbuffer);
        }
    }, {
        key: 'deleteTexture',
        value: function deleteTexture(texture) {
            var gl = this._gl;
            gl.deleteTexture(texture);
        }
    }, {
        key: 'createFramebuffer',
        value: function createFramebuffer() {
            var gl = this._gl;
            return gl.createFramebuffer();
        }
    }, {
        key: 'bindFramebuffer',
        value: function bindFramebuffer(target, framebuffer) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            return gl.bindFramebuffer(target, framebuffer);
        }
    }, {
        key: 'texParameterf',
        value: function texParameterf(target, pname, param) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.texParameterf(target, pname, param);
        }
    }, {
        key: 'framebufferTexture2D',
        value: function framebufferTexture2D(target, attachment, textarget, texture, level) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.framebufferTexture2D(target, attachment, textarget, texture, level);
        }
    }, {
        key: 'drawArrays',
        value: function drawArrays(mode, first, count) {
            var gl = this._gl;
            if (gl.program !== this._program) {
                this.useProgram(this._program);
            }
            gl.drawArrays(mode, first, count);
        }
    }, {
        key: 'readPixels',
        value: function readPixels(x, y, width, height, format, type, pixels) {
            var gl = this._gl;
            gl.readPixels(x, y, width, height, format, type, pixels);
        }
    }, {
        key: 'canvas',
        get: function get$$1() {
            var gl = this._gl;
            return gl.canvas;
        }
    }]);
    return GLContext;
}(Dispose_1);

var GLContext_1 = GLContext;

/**
 *
 */

var GLCanvas = function () {

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    function GLCanvas(canvas) {
        classCallCheck(this, GLCanvas);

        /**
         * @type {HTMLCanvasElement}
         */
        this._canvas = canvas;
    }

    createClass(GLCanvas, [{
        key: 'getContext',
        value: function getContext(renderType, options) {
            this._gl = this._gl || new GLContext_1(merge_1({}, { renderType: renderType, gl: this._gl, canvas: this._canvas }, options || {}));
            return this._gl;
        }
    }, {
        key: 'getBoundingClientRect',
        value: function getBoundingClientRect() {
            var canvas = this._canvas;
            return canvas.getBoundingClientRect();
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(type, Listener, useCapture) {
            var canvas = this._canvas;
            canvas.addEventListener(type, Listener, useCapture);
        }
    }, {
        key: 'style',
        get: function get$$1() {
            var canvas = this._canvas;
            return canvas.style;
        }
    }]);
    return GLCanvas;
}();

var GLCanvas_1 = GLCanvas;

/**
 * use texture soruce to create the texture form
 * reference:
 * https://webgl2fundamentals.org/webgl/lessons/webgl-2-textures.html
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/texImage3D
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
 * 
 * -mipmap
 * -支持非2的n次方规格的textures
 * 
 */

/**
 * @class
 */

var GLTexture = function (_Dispose) {
    inherits(GLTexture, _Dispose);

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     * @param {GLExtension} extenson 
     * @param {*} limits 
     * @param {*} format 
     * @param {*} type 
     */
    function GLTexture(gl, width, height, extension, limits, format, type) {
        classCallCheck(this, GLTexture);

        var _this = possibleConstructorReturn(this, (GLTexture.__proto__ || Object.getPrototypeOf(GLTexture)).call(this));

        _this._gl = gl;
        _this._extension = extension;
        _this._limits = limits;
        _this._width = width || -1;
        _this._height = height || -1;
        _this._handle = _this._createHandle();
        //usually, UNSINGED_BYTE use 8bit per channel,which suit for RGBA.
        _this._format = format || GLConstants_1.RGBA;
        _this._type = type || GLConstants_1.UNSIGNED_BYTE;
        return _this;
    }

    createClass(GLTexture, [{
        key: '_createHandle',

        /**
         * overwrite
         */
        value: function _createHandle() {
            return this._gl.createTexture();
        }
    }, {
        key: 'dispose',

        /**
         * 释放texture资源
         */
        value: function dispose() {
            this._gl.deleteTexture(this.handle);
        }
    }, {
        key: 'loadImage',

        /**
         * 
         * @param {Image|Html} element 
         */
        value: function loadImage(image) {
            this.bind();
            var gl = this._gl,
                mipmapLevel = 0;
            gl.texImage2D(gl.TEXTURE_2D, mipmapLevel, this._format, this._format, this._type, image);
        }
        /**
         * Use a data source and uploads this texture to the GPU
         * @param {TypedArray} data the data to upload to the texture
         */

    }, {
        key: 'loadData',
        value: function loadData(data) {
            this.bind();
            var gl = this._gl,
                ext = this._extension['textureFloat'];
            this._type = data instanceof Float32Array ? gl.FLOAT : this._type;
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._premultiplyAlpha);
            gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, data || null);
        }
        /**
         * 对纹理做插值，在不同分辨率下，当获取不到纹理原始值时，可以根据点位置和周围点的值插值计算。
         * 建议优先调用此方法
         */

    }, {
        key: 'enableMipmap',
        value: function enableMipmap() {
            var gl = this._gl;
            this.bind();
            this._mipmap = true;
            gl.generateMipmap(GLConstants_1.TEXTURE_2D);
        }
        /**
         * 纹理延展到边界
         */

    }, {
        key: 'enableWrapClamp',
        value: function enableWrapClamp() {
            var gl = this._gl;
            this.bind();
            gl.texParameteri(GLConstants_1.TEXTURE_2D, GLConstants_1.TEXTURE_WRAP_S, GLConstants_1.CLAMP_TO_EDGE);
            gl.texParameteri(GLConstants_1.TEXTURE_2D, GLConstants_1.TEXTURE_WRAP_T, GLConstants_1.CLAMP_TO_EDGE);
        }
        /**
         * 纹理超过边际，镜像repeat
         */

    }, {
        key: 'enableWrapMirrorRepeat',
        value: function enableWrapMirrorRepeat() {
            var gl = this._gl;
            this.bind();
            gl.texParameteri(GLConstants_1.TEXTURE_2D, GLConstants_1.TEXTURE_WRAP_S, GLConstants_1.MIRRORED_REPEAT);
            gl.texParameteri(GLConstants_1.TEXTURE_2D, GLConstants_1.TEXTURE_WRAP_T, GLConstants_1.MIRRORED_REPEAT);
        }
        /**
         * 纹理显现拉伸，使用线性插值法
         */

    }, {
        key: 'enableLinearScaling',
        value: function enableLinearScaling() {
            var gl = this._gl;
            this.bind();
            gl.texParameteri(GLConstants_1.TEXTURE_2D, GLConstants_1.TEXTURE_MIN_FILTER, this._mipmap ? GLConstants_1.LINEAR_MIPMAP_LINEAR : GLConstants_1.LINEAR);
            gl.texParameteri(GLConstants_1.TEXTURE_2D, GLConstants_1.TEXTURE_MAG_FILTER, GLConstants_1.LINEAR);
        }
        /**
         * 纹理临近拉伸，使用最临近插值法
         */

    }, {
        key: 'enableNearstScaling',
        value: function enableNearstScaling() {
            var gl = this._gl;
            this.bind();
            gl.texParameteri(GLConstants_1.TEXTURE_2D, GLConstants_1.TEXTURE_MIN_FILTER, this._mipmap ? GLConstants_1.NEAREST_MIPMAP_NEAREST : GLConstants_1.NEAREST);
            gl.texParameteri(GLConstants_1.TEXTURE_2D, GLConstants_1.TEXTURE_MAG_FILTER, GLConstants_1.NEAREST);
        }
        /**
         * binds the texture
         * @type {texture}
         */

    }, {
        key: 'bind',
        value: function bind(location) {
            var gl = this._gl;
            if (location !== undefined) gl.activeTexture(GLConstants_1.TEXTURE0 + location);
            gl.bindTexture(GLConstants_1.TEXTURE_2D, this.handle);
        }
    }, {
        key: 'unbind',

        /**
         * unbinds the texture
         */
        value: function unbind() {
            var gl = this._gl;
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    }, {
        key: 'mipmap',

        /**
         * return the flag mipmap
         * @member
         */
        get: function get$$1() {
            return this._mipmap;
        }
    }]);
    return GLTexture;
}(Dispose_1);

var GLTexture_1 = GLTexture;

var glsl = "\nprecision mediump float;\nvoid main() {\n  gl_FragColor  = vec4(1, 0, 0.5, 1);\n}\n\n";

var default_fragment_glsl = glsl;

var glsl$1 = "\nattribute vec4 a_position;\nvoid main() {\n  gl_Position = a_position;\n}\n";

var default_vertex_glsl = glsl$1;

/**
 * 
 * @author yellow date 2017/8/4
 */

/**
 * import glsl from shaderlib
 */
var shaderLib = {
  default_fragment: default_fragment_glsl,
  default_vertex: default_vertex_glsl
  /**
   * @class
   * @static
   */
};
var GLShaderFactory = function () {
  function GLShaderFactory() {
    classCallCheck(this, GLShaderFactory);
  }

  createClass(GLShaderFactory, null, [{
    key: 'create',

    /**
     * create shaders
     * @param {String} name 
     * @param {WebGLRenderingContext} gl 
     * @param {GLExtension} extension 
     * @return {Array} [VertexShader,FragmentShader]
     */
    value: function create(name, gl, extension) {
      var vertexKey = name + '_vertex',
          fragmentKey = name + '_fragment';

      return [new GLVertexShader_1(gl, shaderLib[vertexKey], extension), new GLFragmentShader_1(gl, shaderLib[fragmentKey], extension)];
    }
  }]);
  return GLShaderFactory;
}();

var GLShaderFactory_1 = GLShaderFactory;

// use polyfill
// import './../node_modules/babel-polyfill/dist/polyfill';
/**
 * import from namespace renderer
 */

var init = {
    gl: {
        GLCanvas: GLCanvas_1,
        GLContext: GLContext_1,
        GLIndexbuffer: GLIndexbuffer_1,
        GLVertexbuffer: GLVertexbuffer_1,
        GLProgram: GLProgram_1,
        GLFragmentShader: GLFragmentShader_1,
        GLVertexShader: GLVertexShader_1,
        GLTexture: GLTexture_1,
        GLShaderFactory: GLShaderFactory_1,
        GLVertexArrayObject: GLVertexArrayObject_1
    }
};

return init;

})));

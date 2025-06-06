var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/rangy/lib/rangy-core.js
var require_rangy_core = __commonJS((exports, module) => {
  (function(factory, root) {
    if (typeof define == "function" && define.amd) {
      define(factory);
    } else if (typeof module != "undefined" && typeof exports == "object") {
      module.exports = factory();
    } else {
      root.rangy = factory();
    }
  })(function() {
    var OBJECT = "object", FUNCTION = "function", UNDEFINED = "undefined";
    var domRangeProperties = [
      "startContainer",
      "startOffset",
      "endContainer",
      "endOffset",
      "collapsed",
      "commonAncestorContainer"
    ];
    var domRangeMethods = [
      "setStart",
      "setStartBefore",
      "setStartAfter",
      "setEnd",
      "setEndBefore",
      "setEndAfter",
      "collapse",
      "selectNode",
      "selectNodeContents",
      "compareBoundaryPoints",
      "deleteContents",
      "extractContents",
      "cloneContents",
      "insertNode",
      "surroundContents",
      "cloneRange",
      "toString",
      "detach"
    ];
    var textRangeProperties = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];
    var textRangeMethods = [
      "collapse",
      "compareEndPoints",
      "duplicate",
      "moveToElementText",
      "parentElement",
      "select",
      "setEndPoint",
      "getBoundingClientRect"
    ];
    function isHostMethod(o, p) {
      var t = typeof o[p];
      return t == FUNCTION || !!(t == OBJECT && o[p]) || t == "unknown";
    }
    function isHostObject(o, p) {
      return !!(typeof o[p] == OBJECT && o[p]);
    }
    function isHostProperty(o, p) {
      return typeof o[p] != UNDEFINED;
    }
    function createMultiplePropertyTest(testFunc) {
      return function(o, props) {
        var i = props.length;
        while (i--) {
          if (!testFunc(o, props[i])) {
            return false;
          }
        }
        return true;
      };
    }
    var areHostMethods = createMultiplePropertyTest(isHostMethod);
    var areHostObjects = createMultiplePropertyTest(isHostObject);
    var areHostProperties = createMultiplePropertyTest(isHostProperty);
    function isTextRange(range) {
      return range && areHostMethods(range, textRangeMethods) && areHostProperties(range, textRangeProperties);
    }
    function getBody(doc) {
      return isHostObject(doc, "body") ? doc.body : doc.getElementsByTagName("body")[0];
    }
    var forEach = [].forEach ? function(arr, func) {
      arr.forEach(func);
    } : function(arr, func) {
      for (var i = 0, len = arr.length;i < len; ++i) {
        func(arr[i], i);
      }
    };
    var modules = {};
    var isBrowser = typeof window != UNDEFINED && typeof document != UNDEFINED;
    var util = {
      isHostMethod,
      isHostObject,
      isHostProperty,
      areHostMethods,
      areHostObjects,
      areHostProperties,
      isTextRange,
      getBody,
      forEach
    };
    var api = {
      version: "1.3.2",
      initialized: false,
      isBrowser,
      supported: true,
      util,
      features: {},
      modules,
      config: {
        alertOnFail: false,
        alertOnWarn: false,
        preferTextRange: false,
        autoInitialize: typeof rangyAutoInitialize == UNDEFINED ? true : rangyAutoInitialize
      }
    };
    function consoleLog(msg) {
      if (typeof console != UNDEFINED && isHostMethod(console, "log")) {
        console.log(msg);
      }
    }
    function alertOrLog(msg, shouldAlert) {
      if (isBrowser && shouldAlert) {
        alert(msg);
      } else {
        consoleLog(msg);
      }
    }
    function fail(reason) {
      api.initialized = true;
      api.supported = false;
      alertOrLog("Rangy is not supported in this environment. Reason: " + reason, api.config.alertOnFail);
    }
    api.fail = fail;
    function warn(msg) {
      alertOrLog("Rangy warning: " + msg, api.config.alertOnWarn);
    }
    api.warn = warn;
    var extend;
    if ({}.hasOwnProperty) {
      util.extend = extend = function(obj, props, deep) {
        var o, p;
        for (var i in props) {
          if (i === "__proto__" || i === "constructor" || i === "prototype") {
            continue;
          }
          if (props.hasOwnProperty(i)) {
            o = obj[i];
            p = props[i];
            if (deep && o !== null && typeof o == "object" && p !== null && typeof p == "object") {
              extend(o, p, true);
            }
            obj[i] = p;
          }
        }
        if (props.hasOwnProperty("toString")) {
          obj.toString = props.toString;
        }
        return obj;
      };
      util.createOptions = function(optionsParam, defaults) {
        var options = {};
        extend(options, defaults);
        if (optionsParam) {
          extend(options, optionsParam);
        }
        return options;
      };
    } else {
      fail("hasOwnProperty not supported");
    }
    if (!isBrowser) {
      fail("Rangy can only run in a browser");
    }
    (function() {
      var toArray;
      if (isBrowser) {
        var el = document.createElement("div");
        el.appendChild(document.createElement("span"));
        var slice = [].slice;
        try {
          if (slice.call(el.childNodes, 0)[0].nodeType == 1) {
            toArray = function(arrayLike) {
              return slice.call(arrayLike, 0);
            };
          }
        } catch (e) {}
      }
      if (!toArray) {
        toArray = function(arrayLike) {
          var arr = [];
          for (var i = 0, len = arrayLike.length;i < len; ++i) {
            arr[i] = arrayLike[i];
          }
          return arr;
        };
      }
      util.toArray = toArray;
    })();
    var addListener;
    if (isBrowser) {
      if (isHostMethod(document, "addEventListener")) {
        addListener = function(obj, eventType, listener) {
          obj.addEventListener(eventType, listener, false);
        };
      } else if (isHostMethod(document, "attachEvent")) {
        addListener = function(obj, eventType, listener) {
          obj.attachEvent("on" + eventType, listener);
        };
      } else {
        fail("Document does not have required addEventListener or attachEvent method");
      }
      util.addListener = addListener;
    }
    var initListeners = [];
    function getErrorDesc(ex) {
      return ex.message || ex.description || String(ex);
    }
    function init() {
      if (!isBrowser || api.initialized) {
        return;
      }
      var testRange;
      var implementsDomRange = false, implementsTextRange = false;
      if (isHostMethod(document, "createRange")) {
        testRange = document.createRange();
        if (areHostMethods(testRange, domRangeMethods) && areHostProperties(testRange, domRangeProperties)) {
          implementsDomRange = true;
        }
      }
      var body = getBody(document);
      if (!body || body.nodeName.toLowerCase() != "body") {
        fail("No body element found");
        return;
      }
      if (body && isHostMethod(body, "createTextRange")) {
        testRange = body.createTextRange();
        if (isTextRange(testRange)) {
          implementsTextRange = true;
        }
      }
      if (!implementsDomRange && !implementsTextRange) {
        fail("Neither Range nor TextRange are available");
        return;
      }
      api.initialized = true;
      api.features = {
        implementsDomRange,
        implementsTextRange
      };
      var module2, errorMessage;
      for (var moduleName in modules) {
        if ((module2 = modules[moduleName]) instanceof Module) {
          module2.init(module2, api);
        }
      }
      for (var i = 0, len = initListeners.length;i < len; ++i) {
        try {
          initListeners[i](api);
        } catch (ex) {
          errorMessage = "Rangy init listener threw an exception. Continuing. Detail: " + getErrorDesc(ex);
          consoleLog(errorMessage);
        }
      }
    }
    function deprecationNotice(deprecated, replacement, module2) {
      if (module2) {
        deprecated += " in module " + module2.name;
      }
      api.warn("DEPRECATED: " + deprecated + " is deprecated. Please use " + replacement + " instead.");
    }
    function createAliasForDeprecatedMethod(owner, deprecated, replacement, module2) {
      owner[deprecated] = function() {
        deprecationNotice(deprecated, replacement, module2);
        return owner[replacement].apply(owner, util.toArray(arguments));
      };
    }
    util.deprecationNotice = deprecationNotice;
    util.createAliasForDeprecatedMethod = createAliasForDeprecatedMethod;
    api.init = init;
    api.addInitListener = function(listener) {
      if (api.initialized) {
        listener(api);
      } else {
        initListeners.push(listener);
      }
    };
    var shimListeners = [];
    api.addShimListener = function(listener) {
      shimListeners.push(listener);
    };
    function shim(win) {
      win = win || window;
      init();
      for (var i = 0, len = shimListeners.length;i < len; ++i) {
        shimListeners[i](win);
      }
    }
    if (isBrowser) {
      api.shim = api.createMissingNativeApi = shim;
      createAliasForDeprecatedMethod(api, "createMissingNativeApi", "shim");
    }
    function Module(name, dependencies, initializer) {
      this.name = name;
      this.dependencies = dependencies;
      this.initialized = false;
      this.supported = false;
      this.initializer = initializer;
    }
    Module.prototype = {
      init: function() {
        var requiredModuleNames = this.dependencies || [];
        for (var i = 0, len = requiredModuleNames.length, requiredModule, moduleName;i < len; ++i) {
          moduleName = requiredModuleNames[i];
          requiredModule = modules[moduleName];
          if (!requiredModule || !(requiredModule instanceof Module)) {
            throw new Error("required module '" + moduleName + "' not found");
          }
          requiredModule.init();
          if (!requiredModule.supported) {
            throw new Error("required module '" + moduleName + "' not supported");
          }
        }
        this.initializer(this);
      },
      fail: function(reason) {
        this.initialized = true;
        this.supported = false;
        throw new Error(reason);
      },
      warn: function(msg) {
        api.warn("Module " + this.name + ": " + msg);
      },
      deprecationNotice: function(deprecated, replacement) {
        api.warn("DEPRECATED: " + deprecated + " in module " + this.name + " is deprecated. Please use " + replacement + " instead");
      },
      createError: function(msg) {
        return new Error("Error in Rangy " + this.name + " module: " + msg);
      }
    };
    function createModule(name, dependencies, initFunc) {
      var newModule = new Module(name, dependencies, function(module2) {
        if (!module2.initialized) {
          module2.initialized = true;
          try {
            initFunc(api, module2);
            module2.supported = true;
          } catch (ex) {
            var errorMessage = "Module '" + name + "' failed to load: " + getErrorDesc(ex);
            consoleLog(errorMessage);
            if (ex.stack) {
              consoleLog(ex.stack);
            }
          }
        }
      });
      modules[name] = newModule;
      return newModule;
    }
    api.createModule = function(name) {
      var initFunc, dependencies;
      if (arguments.length == 2) {
        initFunc = arguments[1];
        dependencies = [];
      } else {
        initFunc = arguments[2];
        dependencies = arguments[1];
      }
      var module2 = createModule(name, dependencies, initFunc);
      if (api.initialized && api.supported) {
        module2.init();
      }
    };
    api.createCoreModule = function(name, dependencies, initFunc) {
      createModule(name, dependencies, initFunc);
    };
    function RangePrototype() {}
    api.RangePrototype = RangePrototype;
    api.rangePrototype = new RangePrototype;
    function SelectionPrototype() {}
    api.selectionPrototype = new SelectionPrototype;
    api.createCoreModule("DomUtil", [], function(api2, module2) {
      var UNDEF = "undefined";
      var util2 = api2.util;
      var getBody2 = util2.getBody;
      if (!util2.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"])) {
        module2.fail("document missing a Node creation method");
      }
      if (!util2.isHostMethod(document, "getElementsByTagName")) {
        module2.fail("document missing getElementsByTagName method");
      }
      var el = document.createElement("div");
      if (!util2.areHostMethods(el, ["insertBefore", "appendChild", "cloneNode"])) {
        module2.fail("Incomplete Element implementation");
      }
      if (!util2.isHostProperty(el, "innerHTML")) {
        module2.fail("Element is missing innerHTML property");
      }
      var textNode = document.createTextNode("test");
      if (!util2.areHostMethods(textNode, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"])) {
        module2.fail("Incomplete Text Node implementation");
      }
      var arrayContains = function(arr, val) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === val) {
            return true;
          }
        }
        return false;
      };
      function isHtmlNamespace(node2) {
        var ns;
        return typeof node2.namespaceURI == UNDEF || ((ns = node2.namespaceURI) === null || ns == "http://www.w3.org/1999/xhtml");
      }
      function parentElement(node2) {
        var parent = node2.parentNode;
        return parent.nodeType == 1 ? parent : null;
      }
      function getNodeIndex(node2) {
        var i = 0;
        while (node2 = node2.previousSibling) {
          ++i;
        }
        return i;
      }
      function getNodeLength(node2) {
        switch (node2.nodeType) {
          case 7:
          case 10:
            return 0;
          case 3:
          case 8:
            return node2.length;
          default:
            return node2.childNodes.length;
        }
      }
      function getCommonAncestor(node1, node2) {
        var ancestors = [], n;
        for (n = node1;n; n = n.parentNode) {
          ancestors.push(n);
        }
        for (n = node2;n; n = n.parentNode) {
          if (arrayContains(ancestors, n)) {
            return n;
          }
        }
        return null;
      }
      function isAncestorOf(ancestor, descendant, selfIsAncestor) {
        var n = selfIsAncestor ? descendant : descendant.parentNode;
        while (n) {
          if (n === ancestor) {
            return true;
          } else {
            n = n.parentNode;
          }
        }
        return false;
      }
      function isOrIsAncestorOf(ancestor, descendant) {
        return isAncestorOf(ancestor, descendant, true);
      }
      function getClosestAncestorIn(node2, ancestor, selfIsAncestor) {
        var p, n = selfIsAncestor ? node2 : node2.parentNode;
        while (n) {
          p = n.parentNode;
          if (p === ancestor) {
            return n;
          }
          n = p;
        }
        return null;
      }
      function isCharacterDataNode(node2) {
        var t = node2.nodeType;
        return t == 3 || t == 4 || t == 8;
      }
      function isTextOrCommentNode(node2) {
        if (!node2) {
          return false;
        }
        var t = node2.nodeType;
        return t == 3 || t == 8;
      }
      function insertAfter(node2, precedingNode) {
        var { nextSibling: nextNode, parentNode: parent } = precedingNode;
        if (nextNode) {
          parent.insertBefore(node2, nextNode);
        } else {
          parent.appendChild(node2);
        }
        return node2;
      }
      function splitDataNode(node2, index, positionsToPreserve) {
        var newNode = node2.cloneNode(false);
        newNode.deleteData(0, index);
        node2.deleteData(index, node2.length - index);
        insertAfter(newNode, node2);
        if (positionsToPreserve) {
          for (var i = 0, position;position = positionsToPreserve[i++]; ) {
            if (position.node == node2 && position.offset > index) {
              position.node = newNode;
              position.offset -= index;
            } else if (position.node == node2.parentNode && position.offset > getNodeIndex(node2)) {
              ++position.offset;
            }
          }
        }
        return newNode;
      }
      function getDocument(node2) {
        if (node2.nodeType == 9) {
          return node2;
        } else if (typeof node2.ownerDocument != UNDEF) {
          return node2.ownerDocument;
        } else if (typeof node2.document != UNDEF) {
          return node2.document;
        } else if (node2.parentNode) {
          return getDocument(node2.parentNode);
        } else {
          throw module2.createError("getDocument: no document found for node");
        }
      }
      function getWindow(node2) {
        var doc = getDocument(node2);
        if (typeof doc.defaultView != UNDEF) {
          return doc.defaultView;
        } else if (typeof doc.parentWindow != UNDEF) {
          return doc.parentWindow;
        } else {
          throw module2.createError("Cannot get a window object for node");
        }
      }
      function getIframeDocument(iframeEl) {
        if (typeof iframeEl.contentDocument != UNDEF) {
          return iframeEl.contentDocument;
        } else if (typeof iframeEl.contentWindow != UNDEF) {
          return iframeEl.contentWindow.document;
        } else {
          throw module2.createError("getIframeDocument: No Document object found for iframe element");
        }
      }
      function getIframeWindow(iframeEl) {
        if (typeof iframeEl.contentWindow != UNDEF) {
          return iframeEl.contentWindow;
        } else if (typeof iframeEl.contentDocument != UNDEF) {
          return iframeEl.contentDocument.defaultView;
        } else {
          throw module2.createError("getIframeWindow: No Window object found for iframe element");
        }
      }
      function isWindow(obj) {
        return obj && util2.isHostMethod(obj, "setTimeout") && util2.isHostObject(obj, "document");
      }
      function getContentDocument(obj, module3, methodName) {
        var doc;
        if (!obj) {
          doc = document;
        } else if (util2.isHostProperty(obj, "nodeType")) {
          doc = obj.nodeType == 1 && obj.tagName.toLowerCase() == "iframe" ? getIframeDocument(obj) : getDocument(obj);
        } else if (isWindow(obj)) {
          doc = obj.document;
        }
        if (!doc) {
          throw module3.createError(methodName + "(): Parameter must be a Window object or DOM node");
        }
        return doc;
      }
      function getRootContainer(node2) {
        var parent;
        while (parent = node2.parentNode) {
          node2 = parent;
        }
        return node2;
      }
      function comparePoints(nodeA, offsetA, nodeB, offsetB) {
        var nodeC, root, childA, childB, n;
        if (nodeA == nodeB) {
          return offsetA === offsetB ? 0 : offsetA < offsetB ? -1 : 1;
        } else if (nodeC = getClosestAncestorIn(nodeB, nodeA, true)) {
          return offsetA <= getNodeIndex(nodeC) ? -1 : 1;
        } else if (nodeC = getClosestAncestorIn(nodeA, nodeB, true)) {
          return getNodeIndex(nodeC) < offsetB ? -1 : 1;
        } else {
          root = getCommonAncestor(nodeA, nodeB);
          if (!root) {
            throw new Error("comparePoints error: nodes have no common ancestor");
          }
          childA = nodeA === root ? root : getClosestAncestorIn(nodeA, root, true);
          childB = nodeB === root ? root : getClosestAncestorIn(nodeB, root, true);
          if (childA === childB) {
            throw module2.createError("comparePoints got to case 4 and childA and childB are the same!");
          } else {
            n = root.firstChild;
            while (n) {
              if (n === childA) {
                return -1;
              } else if (n === childB) {
                return 1;
              }
              n = n.nextSibling;
            }
          }
        }
      }
      var crashyTextNodes = false;
      function isBrokenNode(node2) {
        var n;
        try {
          n = node2.parentNode;
          return false;
        } catch (e) {
          return true;
        }
      }
      (function() {
        var el2 = document.createElement("b");
        el2.innerHTML = "1";
        var textNode2 = el2.firstChild;
        el2.innerHTML = "<br />";
        crashyTextNodes = isBrokenNode(textNode2);
        api2.features.crashyTextNodes = crashyTextNodes;
      })();
      function inspectNode(node2) {
        if (!node2) {
          return "[No node]";
        }
        if (crashyTextNodes && isBrokenNode(node2)) {
          return "[Broken node]";
        }
        if (isCharacterDataNode(node2)) {
          return '"' + node2.data + '"';
        }
        if (node2.nodeType == 1) {
          var idAttr = node2.id ? ' id="' + node2.id + '"' : "";
          return "<" + node2.nodeName + idAttr + ">[index:" + getNodeIndex(node2) + ",length:" + node2.childNodes.length + "][" + (node2.innerHTML || "[innerHTML not supported]").slice(0, 25) + "]";
        }
        return node2.nodeName;
      }
      function fragmentFromNodeChildren(node2) {
        var fragment = getDocument(node2).createDocumentFragment(), child;
        while (child = node2.firstChild) {
          fragment.appendChild(child);
        }
        return fragment;
      }
      var getComputedStyleProperty;
      if (typeof window.getComputedStyle != UNDEF) {
        getComputedStyleProperty = function(el2, propName) {
          return getWindow(el2).getComputedStyle(el2, null)[propName];
        };
      } else if (typeof document.documentElement.currentStyle != UNDEF) {
        getComputedStyleProperty = function(el2, propName) {
          return el2.currentStyle ? el2.currentStyle[propName] : "";
        };
      } else {
        module2.fail("No means of obtaining computed style properties found");
      }
      function createTestElement(doc, html, contentEditable) {
        var body = getBody2(doc);
        var el2 = doc.createElement("div");
        el2.contentEditable = "" + !!contentEditable;
        if (html) {
          el2.innerHTML = html;
        }
        var bodyFirstChild = body.firstChild;
        if (bodyFirstChild) {
          body.insertBefore(el2, bodyFirstChild);
        } else {
          body.appendChild(el2);
        }
        return el2;
      }
      function removeNode(node2) {
        return node2.parentNode.removeChild(node2);
      }
      function NodeIterator(root) {
        this.root = root;
        this._next = root;
      }
      NodeIterator.prototype = {
        _current: null,
        hasNext: function() {
          return !!this._next;
        },
        next: function() {
          var n = this._current = this._next;
          var child, next;
          if (this._current) {
            child = n.firstChild;
            if (child) {
              this._next = child;
            } else {
              next = null;
              while (n !== this.root && !(next = n.nextSibling)) {
                n = n.parentNode;
              }
              this._next = next;
            }
          }
          return this._current;
        },
        detach: function() {
          this._current = this._next = this.root = null;
        }
      };
      function createIterator(root) {
        return new NodeIterator(root);
      }
      function DomPosition(node2, offset) {
        this.node = node2;
        this.offset = offset;
      }
      DomPosition.prototype = {
        equals: function(pos) {
          return !!pos && this.node === pos.node && this.offset == pos.offset;
        },
        inspect: function() {
          return "[DomPosition(" + inspectNode(this.node) + ":" + this.offset + ")]";
        },
        toString: function() {
          return this.inspect();
        }
      };
      function DOMException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "DOMException: " + this.codeName;
      }
      DOMException.prototype = {
        INDEX_SIZE_ERR: 1,
        HIERARCHY_REQUEST_ERR: 3,
        WRONG_DOCUMENT_ERR: 4,
        NO_MODIFICATION_ALLOWED_ERR: 7,
        NOT_FOUND_ERR: 8,
        NOT_SUPPORTED_ERR: 9,
        INVALID_STATE_ERR: 11,
        INVALID_NODE_TYPE_ERR: 24
      };
      DOMException.prototype.toString = function() {
        return this.message;
      };
      api2.dom = {
        arrayContains,
        isHtmlNamespace,
        parentElement,
        getNodeIndex,
        getNodeLength,
        getCommonAncestor,
        isAncestorOf,
        isOrIsAncestorOf,
        getClosestAncestorIn,
        isCharacterDataNode,
        isTextOrCommentNode,
        insertAfter,
        splitDataNode,
        getDocument,
        getWindow,
        getIframeWindow,
        getIframeDocument,
        getBody: getBody2,
        isWindow,
        getContentDocument,
        getRootContainer,
        comparePoints,
        isBrokenNode,
        inspectNode,
        getComputedStyleProperty,
        createTestElement,
        removeNode,
        fragmentFromNodeChildren,
        createIterator,
        DomPosition
      };
      api2.DOMException = DOMException;
    });
    api.createCoreModule("DomRange", ["DomUtil"], function(api2, module2) {
      var dom = api2.dom;
      var util2 = api2.util;
      var DomPosition = dom.DomPosition;
      var DOMException = api2.DOMException;
      var isCharacterDataNode = dom.isCharacterDataNode;
      var getNodeIndex = dom.getNodeIndex;
      var isOrIsAncestorOf = dom.isOrIsAncestorOf;
      var getDocument = dom.getDocument;
      var comparePoints = dom.comparePoints;
      var splitDataNode = dom.splitDataNode;
      var getClosestAncestorIn = dom.getClosestAncestorIn;
      var getNodeLength = dom.getNodeLength;
      var arrayContains = dom.arrayContains;
      var getRootContainer = dom.getRootContainer;
      var crashyTextNodes = api2.features.crashyTextNodes;
      var removeNode = dom.removeNode;
      function isNonTextPartiallySelected(node2, range) {
        return node2.nodeType != 3 && (isOrIsAncestorOf(node2, range.startContainer) || isOrIsAncestorOf(node2, range.endContainer));
      }
      function getRangeDocument(range) {
        return range.document || getDocument(range.startContainer);
      }
      function getRangeRoot(range) {
        return getRootContainer(range.startContainer);
      }
      function getBoundaryBeforeNode(node2) {
        return new DomPosition(node2.parentNode, getNodeIndex(node2));
      }
      function getBoundaryAfterNode(node2) {
        return new DomPosition(node2.parentNode, getNodeIndex(node2) + 1);
      }
      function insertNodeAtPosition(node2, n, o) {
        var firstNodeInserted = node2.nodeType == 11 ? node2.firstChild : node2;
        if (isCharacterDataNode(n)) {
          if (o == n.length) {
            dom.insertAfter(node2, n);
          } else {
            n.parentNode.insertBefore(node2, o == 0 ? n : splitDataNode(n, o));
          }
        } else if (o >= n.childNodes.length) {
          n.appendChild(node2);
        } else {
          n.insertBefore(node2, n.childNodes[o]);
        }
        return firstNodeInserted;
      }
      function rangesIntersect(rangeA, rangeB, touchingIsIntersecting) {
        assertRangeValid(rangeA);
        assertRangeValid(rangeB);
        if (getRangeDocument(rangeB) != getRangeDocument(rangeA)) {
          throw new DOMException("WRONG_DOCUMENT_ERR");
        }
        var startComparison = comparePoints(rangeA.startContainer, rangeA.startOffset, rangeB.endContainer, rangeB.endOffset), endComparison = comparePoints(rangeA.endContainer, rangeA.endOffset, rangeB.startContainer, rangeB.startOffset);
        return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
      }
      function cloneSubtree(iterator) {
        var partiallySelected;
        for (var node2, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator;node2 = iterator.next(); ) {
          partiallySelected = iterator.isPartiallySelectedSubtree();
          node2 = node2.cloneNode(!partiallySelected);
          if (partiallySelected) {
            subIterator = iterator.getSubtreeIterator();
            node2.appendChild(cloneSubtree(subIterator));
            subIterator.detach();
          }
          if (node2.nodeType == 10) {
            throw new DOMException("HIERARCHY_REQUEST_ERR");
          }
          frag.appendChild(node2);
        }
        return frag;
      }
      function iterateSubtree(rangeIterator, func, iteratorState) {
        var it, n;
        iteratorState = iteratorState || { stop: false };
        for (var node2, subRangeIterator;node2 = rangeIterator.next(); ) {
          if (rangeIterator.isPartiallySelectedSubtree()) {
            if (func(node2) === false) {
              iteratorState.stop = true;
              return;
            } else {
              subRangeIterator = rangeIterator.getSubtreeIterator();
              iterateSubtree(subRangeIterator, func, iteratorState);
              subRangeIterator.detach();
              if (iteratorState.stop) {
                return;
              }
            }
          } else {
            it = dom.createIterator(node2);
            while (n = it.next()) {
              if (func(n) === false) {
                iteratorState.stop = true;
                return;
              }
            }
          }
        }
      }
      function deleteSubtree(iterator) {
        var subIterator;
        while (iterator.next()) {
          if (iterator.isPartiallySelectedSubtree()) {
            subIterator = iterator.getSubtreeIterator();
            deleteSubtree(subIterator);
            subIterator.detach();
          } else {
            iterator.remove();
          }
        }
      }
      function extractSubtree(iterator) {
        for (var node2, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator;node2 = iterator.next(); ) {
          if (iterator.isPartiallySelectedSubtree()) {
            node2 = node2.cloneNode(false);
            subIterator = iterator.getSubtreeIterator();
            node2.appendChild(extractSubtree(subIterator));
            subIterator.detach();
          } else {
            iterator.remove();
          }
          if (node2.nodeType == 10) {
            throw new DOMException("HIERARCHY_REQUEST_ERR");
          }
          frag.appendChild(node2);
        }
        return frag;
      }
      function getNodesInRange(range, nodeTypes, filter) {
        var filterNodeTypes = !!(nodeTypes && nodeTypes.length), regex;
        var filterExists = !!filter;
        if (filterNodeTypes) {
          regex = new RegExp("^(" + nodeTypes.join("|") + ")$");
        }
        var nodes = [];
        iterateSubtree(new RangeIterator(range, false), function(node2) {
          if (filterNodeTypes && !regex.test(node2.nodeType)) {
            return;
          }
          if (filterExists && !filter(node2)) {
            return;
          }
          var sc = range.startContainer;
          if (node2 == sc && isCharacterDataNode(sc) && range.startOffset == sc.length) {
            return;
          }
          var ec = range.endContainer;
          if (node2 == ec && isCharacterDataNode(ec) && range.endOffset == 0) {
            return;
          }
          nodes.push(node2);
        });
        return nodes;
      }
      function inspect(range) {
        var name = typeof range.getName == "undefined" ? "Range" : range.getName();
        return "[" + name + "(" + dom.inspectNode(range.startContainer) + ":" + range.startOffset + ", " + dom.inspectNode(range.endContainer) + ":" + range.endOffset + ")]";
      }
      function RangeIterator(range, clonePartiallySelectedTextNodes) {
        this.range = range;
        this.clonePartiallySelectedTextNodes = clonePartiallySelectedTextNodes;
        if (!range.collapsed) {
          this.sc = range.startContainer;
          this.so = range.startOffset;
          this.ec = range.endContainer;
          this.eo = range.endOffset;
          var root = range.commonAncestorContainer;
          if (this.sc === this.ec && isCharacterDataNode(this.sc)) {
            this.isSingleCharacterDataNode = true;
            this._first = this._last = this._next = this.sc;
          } else {
            this._first = this._next = this.sc === root && !isCharacterDataNode(this.sc) ? this.sc.childNodes[this.so] : getClosestAncestorIn(this.sc, root, true);
            this._last = this.ec === root && !isCharacterDataNode(this.ec) ? this.ec.childNodes[this.eo - 1] : getClosestAncestorIn(this.ec, root, true);
          }
        }
      }
      RangeIterator.prototype = {
        _current: null,
        _next: null,
        _first: null,
        _last: null,
        isSingleCharacterDataNode: false,
        reset: function() {
          this._current = null;
          this._next = this._first;
        },
        hasNext: function() {
          return !!this._next;
        },
        next: function() {
          var current = this._current = this._next;
          if (current) {
            this._next = current !== this._last ? current.nextSibling : null;
            if (isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
              if (current === this.ec) {
                (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
              }
              if (this._current === this.sc) {
                (current = current.cloneNode(true)).deleteData(0, this.so);
              }
            }
          }
          return current;
        },
        remove: function() {
          var current = this._current, start, end;
          if (isCharacterDataNode(current) && (current === this.sc || current === this.ec)) {
            start = current === this.sc ? this.so : 0;
            end = current === this.ec ? this.eo : current.length;
            if (start != end) {
              current.deleteData(start, end - start);
            }
          } else {
            if (current.parentNode) {
              removeNode(current);
            } else {}
          }
        },
        isPartiallySelectedSubtree: function() {
          var current = this._current;
          return isNonTextPartiallySelected(current, this.range);
        },
        getSubtreeIterator: function() {
          var subRange;
          if (this.isSingleCharacterDataNode) {
            subRange = this.range.cloneRange();
            subRange.collapse(false);
          } else {
            subRange = new Range(getRangeDocument(this.range));
            var current = this._current;
            var startContainer = current, startOffset = 0, endContainer = current, endOffset = getNodeLength(current);
            if (isOrIsAncestorOf(current, this.sc)) {
              startContainer = this.sc;
              startOffset = this.so;
            }
            if (isOrIsAncestorOf(current, this.ec)) {
              endContainer = this.ec;
              endOffset = this.eo;
            }
            updateBoundaries(subRange, startContainer, startOffset, endContainer, endOffset);
          }
          return new RangeIterator(subRange, this.clonePartiallySelectedTextNodes);
        },
        detach: function() {
          this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null;
        }
      };
      var beforeAfterNodeTypes = [1, 3, 4, 5, 7, 8, 10];
      var rootContainerNodeTypes = [2, 9, 11];
      var readonlyNodeTypes = [5, 6, 10, 12];
      var insertableNodeTypes = [1, 3, 4, 5, 7, 8, 10, 11];
      var surroundNodeTypes = [1, 3, 4, 5, 7, 8];
      function createAncestorFinder(nodeTypes) {
        return function(node2, selfIsAncestor) {
          var t, n = selfIsAncestor ? node2 : node2.parentNode;
          while (n) {
            t = n.nodeType;
            if (arrayContains(nodeTypes, t)) {
              return n;
            }
            n = n.parentNode;
          }
          return null;
        };
      }
      var getDocumentOrFragmentContainer = createAncestorFinder([9, 11]);
      var getReadonlyAncestor = createAncestorFinder(readonlyNodeTypes);
      var getDocTypeNotationEntityAncestor = createAncestorFinder([6, 10, 12]);
      var getElementAncestor = createAncestorFinder([1]);
      function assertNoDocTypeNotationEntityAncestor(node2, allowSelf) {
        if (getDocTypeNotationEntityAncestor(node2, allowSelf)) {
          throw new DOMException("INVALID_NODE_TYPE_ERR");
        }
      }
      function assertValidNodeType(node2, invalidTypes) {
        if (!arrayContains(invalidTypes, node2.nodeType)) {
          throw new DOMException("INVALID_NODE_TYPE_ERR");
        }
      }
      function assertValidOffset(node2, offset) {
        if (offset < 0 || offset > (isCharacterDataNode(node2) ? node2.length : node2.childNodes.length)) {
          throw new DOMException("INDEX_SIZE_ERR");
        }
      }
      function assertSameDocumentOrFragment(node1, node2) {
        if (getDocumentOrFragmentContainer(node1, true) !== getDocumentOrFragmentContainer(node2, true)) {
          throw new DOMException("WRONG_DOCUMENT_ERR");
        }
      }
      function assertNodeNotReadOnly(node2) {
        if (getReadonlyAncestor(node2, true)) {
          throw new DOMException("NO_MODIFICATION_ALLOWED_ERR");
        }
      }
      function assertNode(node2, codeName) {
        if (!node2) {
          throw new DOMException(codeName);
        }
      }
      function isValidOffset(node2, offset) {
        return offset <= (isCharacterDataNode(node2) ? node2.length : node2.childNodes.length);
      }
      function isRangeValid(range) {
        return !!range.startContainer && !!range.endContainer && !(crashyTextNodes && (dom.isBrokenNode(range.startContainer) || dom.isBrokenNode(range.endContainer))) && getRootContainer(range.startContainer) == getRootContainer(range.endContainer) && isValidOffset(range.startContainer, range.startOffset) && isValidOffset(range.endContainer, range.endOffset);
      }
      function assertRangeValid(range) {
        if (!isRangeValid(range)) {
          throw new Error("Range error: Range is not valid. This usually happens after DOM mutation. Range: (" + range.inspect() + ")");
        }
      }
      var styleEl = document.createElement("style");
      var htmlParsingConforms = false;
      try {
        styleEl.innerHTML = "<b>x</b>";
        htmlParsingConforms = styleEl.firstChild.nodeType == 3;
      } catch (e) {}
      api2.features.htmlParsingConforms = htmlParsingConforms;
      var createContextualFragment = htmlParsingConforms ? function(fragmentStr) {
        var node2 = this.startContainer;
        var doc = getDocument(node2);
        if (!node2) {
          throw new DOMException("INVALID_STATE_ERR");
        }
        var el = null;
        if (node2.nodeType == 1) {
          el = node2;
        } else if (isCharacterDataNode(node2)) {
          el = dom.parentElement(node2);
        }
        if (el === null || el.nodeName == "HTML" && dom.isHtmlNamespace(getDocument(el).documentElement) && dom.isHtmlNamespace(el)) {
          el = doc.createElement("body");
        } else {
          el = el.cloneNode(false);
        }
        el.innerHTML = fragmentStr;
        return dom.fragmentFromNodeChildren(el);
      } : function(fragmentStr) {
        var doc = getRangeDocument(this);
        var el = doc.createElement("body");
        el.innerHTML = fragmentStr;
        return dom.fragmentFromNodeChildren(el);
      };
      function splitRangeBoundaries(range, positionsToPreserve) {
        assertRangeValid(range);
        var { startContainer: sc, startOffset: so, endContainer: ec, endOffset: eo } = range;
        var startEndSame = sc === ec;
        if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
          splitDataNode(ec, eo, positionsToPreserve);
        }
        if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
          sc = splitDataNode(sc, so, positionsToPreserve);
          if (startEndSame) {
            eo -= so;
            ec = sc;
          } else if (ec == sc.parentNode && eo >= getNodeIndex(sc)) {
            eo++;
          }
          so = 0;
        }
        range.setStartAndEnd(sc, so, ec, eo);
      }
      function rangeToHtml(range) {
        assertRangeValid(range);
        var container = range.commonAncestorContainer.parentNode.cloneNode(false);
        container.appendChild(range.cloneContents());
        return container.innerHTML;
      }
      var rangeProperties = [
        "startContainer",
        "startOffset",
        "endContainer",
        "endOffset",
        "collapsed",
        "commonAncestorContainer"
      ];
      var s2s = 0, s2e = 1, e2e = 2, e2s = 3;
      var n_b = 0, n_a = 1, n_b_a = 2, n_i = 3;
      util2.extend(api2.rangePrototype, {
        compareBoundaryPoints: function(how, range) {
          assertRangeValid(this);
          assertSameDocumentOrFragment(this.startContainer, range.startContainer);
          var nodeA, offsetA, nodeB, offsetB;
          var prefixA = how == e2s || how == s2s ? "start" : "end";
          var prefixB = how == s2e || how == s2s ? "start" : "end";
          nodeA = this[prefixA + "Container"];
          offsetA = this[prefixA + "Offset"];
          nodeB = range[prefixB + "Container"];
          offsetB = range[prefixB + "Offset"];
          return comparePoints(nodeA, offsetA, nodeB, offsetB);
        },
        insertNode: function(node2) {
          assertRangeValid(this);
          assertValidNodeType(node2, insertableNodeTypes);
          assertNodeNotReadOnly(this.startContainer);
          if (isOrIsAncestorOf(node2, this.startContainer)) {
            throw new DOMException("HIERARCHY_REQUEST_ERR");
          }
          var firstNodeInserted = insertNodeAtPosition(node2, this.startContainer, this.startOffset);
          this.setStartBefore(firstNodeInserted);
        },
        cloneContents: function() {
          assertRangeValid(this);
          var clone, frag;
          if (this.collapsed) {
            return getRangeDocument(this).createDocumentFragment();
          } else {
            if (this.startContainer === this.endContainer && isCharacterDataNode(this.startContainer)) {
              clone = this.startContainer.cloneNode(true);
              clone.data = clone.data.slice(this.startOffset, this.endOffset);
              frag = getRangeDocument(this).createDocumentFragment();
              frag.appendChild(clone);
              return frag;
            } else {
              var iterator = new RangeIterator(this, true);
              clone = cloneSubtree(iterator);
              iterator.detach();
            }
            return clone;
          }
        },
        canSurroundContents: function() {
          assertRangeValid(this);
          assertNodeNotReadOnly(this.startContainer);
          assertNodeNotReadOnly(this.endContainer);
          var iterator = new RangeIterator(this, true);
          var boundariesInvalid = iterator._first && isNonTextPartiallySelected(iterator._first, this) || iterator._last && isNonTextPartiallySelected(iterator._last, this);
          iterator.detach();
          return !boundariesInvalid;
        },
        surroundContents: function(node2) {
          assertValidNodeType(node2, surroundNodeTypes);
          if (!this.canSurroundContents()) {
            throw new DOMException("INVALID_STATE_ERR");
          }
          var content = this.extractContents();
          if (node2.hasChildNodes()) {
            while (node2.lastChild) {
              node2.removeChild(node2.lastChild);
            }
          }
          insertNodeAtPosition(node2, this.startContainer, this.startOffset);
          node2.appendChild(content);
          this.selectNode(node2);
        },
        cloneRange: function() {
          assertRangeValid(this);
          var range = new Range(getRangeDocument(this));
          var i = rangeProperties.length, prop;
          while (i--) {
            prop = rangeProperties[i];
            range[prop] = this[prop];
          }
          return range;
        },
        toString: function() {
          assertRangeValid(this);
          var sc = this.startContainer;
          if (sc === this.endContainer && isCharacterDataNode(sc)) {
            return sc.nodeType == 3 || sc.nodeType == 4 ? sc.data.slice(this.startOffset, this.endOffset) : "";
          } else {
            var textParts = [], iterator = new RangeIterator(this, true);
            iterateSubtree(iterator, function(node2) {
              if (node2.nodeType == 3 || node2.nodeType == 4) {
                textParts.push(node2.data);
              }
            });
            iterator.detach();
            return textParts.join("");
          }
        },
        compareNode: function(node2) {
          assertRangeValid(this);
          var parent = node2.parentNode;
          var nodeIndex = getNodeIndex(node2);
          if (!parent) {
            throw new DOMException("NOT_FOUND_ERR");
          }
          var startComparison = this.comparePoint(parent, nodeIndex), endComparison = this.comparePoint(parent, nodeIndex + 1);
          if (startComparison < 0) {
            return endComparison > 0 ? n_b_a : n_b;
          } else {
            return endComparison > 0 ? n_a : n_i;
          }
        },
        comparePoint: function(node2, offset) {
          assertRangeValid(this);
          assertNode(node2, "HIERARCHY_REQUEST_ERR");
          assertSameDocumentOrFragment(node2, this.startContainer);
          if (comparePoints(node2, offset, this.startContainer, this.startOffset) < 0) {
            return -1;
          } else if (comparePoints(node2, offset, this.endContainer, this.endOffset) > 0) {
            return 1;
          }
          return 0;
        },
        createContextualFragment,
        toHtml: function() {
          return rangeToHtml(this);
        },
        intersectsNode: function(node2, touchingIsIntersecting) {
          assertRangeValid(this);
          if (getRootContainer(node2) != getRangeRoot(this)) {
            return false;
          }
          var parent = node2.parentNode, offset = getNodeIndex(node2);
          if (!parent) {
            return true;
          }
          var startComparison = comparePoints(parent, offset, this.endContainer, this.endOffset), endComparison = comparePoints(parent, offset + 1, this.startContainer, this.startOffset);
          return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },
        isPointInRange: function(node2, offset) {
          assertRangeValid(this);
          assertNode(node2, "HIERARCHY_REQUEST_ERR");
          assertSameDocumentOrFragment(node2, this.startContainer);
          return comparePoints(node2, offset, this.startContainer, this.startOffset) >= 0 && comparePoints(node2, offset, this.endContainer, this.endOffset) <= 0;
        },
        intersectsRange: function(range) {
          return rangesIntersect(this, range, false);
        },
        intersectsOrTouchesRange: function(range) {
          return rangesIntersect(this, range, true);
        },
        intersection: function(range) {
          if (this.intersectsRange(range)) {
            var startComparison = comparePoints(this.startContainer, this.startOffset, range.startContainer, range.startOffset), endComparison = comparePoints(this.endContainer, this.endOffset, range.endContainer, range.endOffset);
            var intersectionRange = this.cloneRange();
            if (startComparison == -1) {
              intersectionRange.setStart(range.startContainer, range.startOffset);
            }
            if (endComparison == 1) {
              intersectionRange.setEnd(range.endContainer, range.endOffset);
            }
            return intersectionRange;
          }
          return null;
        },
        union: function(range) {
          if (this.intersectsOrTouchesRange(range)) {
            var unionRange = this.cloneRange();
            if (comparePoints(range.startContainer, range.startOffset, this.startContainer, this.startOffset) == -1) {
              unionRange.setStart(range.startContainer, range.startOffset);
            }
            if (comparePoints(range.endContainer, range.endOffset, this.endContainer, this.endOffset) == 1) {
              unionRange.setEnd(range.endContainer, range.endOffset);
            }
            return unionRange;
          } else {
            throw new DOMException("Ranges do not intersect");
          }
        },
        containsNode: function(node2, allowPartial) {
          if (allowPartial) {
            return this.intersectsNode(node2, false);
          } else {
            return this.compareNode(node2) == n_i;
          }
        },
        containsNodeContents: function(node2) {
          return this.comparePoint(node2, 0) >= 0 && this.comparePoint(node2, getNodeLength(node2)) <= 0;
        },
        containsRange: function(range) {
          var intersection = this.intersection(range);
          return intersection !== null && range.equals(intersection);
        },
        containsNodeText: function(node2) {
          var nodeRange = this.cloneRange();
          nodeRange.selectNode(node2);
          var textNodes = nodeRange.getNodes([3]);
          if (textNodes.length > 0) {
            nodeRange.setStart(textNodes[0], 0);
            var lastTextNode = textNodes.pop();
            nodeRange.setEnd(lastTextNode, lastTextNode.length);
            return this.containsRange(nodeRange);
          } else {
            return this.containsNodeContents(node2);
          }
        },
        getNodes: function(nodeTypes, filter) {
          assertRangeValid(this);
          return getNodesInRange(this, nodeTypes, filter);
        },
        getDocument: function() {
          return getRangeDocument(this);
        },
        collapseBefore: function(node2) {
          this.setEndBefore(node2);
          this.collapse(false);
        },
        collapseAfter: function(node2) {
          this.setStartAfter(node2);
          this.collapse(true);
        },
        getBookmark: function(containerNode) {
          var doc = getRangeDocument(this);
          var preSelectionRange = api2.createRange(doc);
          containerNode = containerNode || dom.getBody(doc);
          preSelectionRange.selectNodeContents(containerNode);
          var range = this.intersection(preSelectionRange);
          var start = 0, end = 0;
          if (range) {
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            start = preSelectionRange.toString().length;
            end = start + range.toString().length;
          }
          return {
            start,
            end,
            containerNode
          };
        },
        moveToBookmark: function(bookmark) {
          var containerNode = bookmark.containerNode;
          var charIndex = 0;
          this.setStart(containerNode, 0);
          this.collapse(true);
          var nodeStack = [containerNode], node2, foundStart = false, stop = false;
          var nextCharIndex, i, childNodes;
          while (!stop && (node2 = nodeStack.pop())) {
            if (node2.nodeType == 3) {
              nextCharIndex = charIndex + node2.length;
              if (!foundStart && bookmark.start >= charIndex && bookmark.start <= nextCharIndex) {
                this.setStart(node2, bookmark.start - charIndex);
                foundStart = true;
              }
              if (foundStart && bookmark.end >= charIndex && bookmark.end <= nextCharIndex) {
                this.setEnd(node2, bookmark.end - charIndex);
                stop = true;
              }
              charIndex = nextCharIndex;
            } else {
              childNodes = node2.childNodes;
              i = childNodes.length;
              while (i--) {
                nodeStack.push(childNodes[i]);
              }
            }
          }
        },
        getName: function() {
          return "DomRange";
        },
        equals: function(range) {
          return Range.rangesEqual(this, range);
        },
        isValid: function() {
          return isRangeValid(this);
        },
        inspect: function() {
          return inspect(this);
        },
        detach: function() {}
      });
      function copyComparisonConstantsToObject(obj) {
        obj.START_TO_START = s2s;
        obj.START_TO_END = s2e;
        obj.END_TO_END = e2e;
        obj.END_TO_START = e2s;
        obj.NODE_BEFORE = n_b;
        obj.NODE_AFTER = n_a;
        obj.NODE_BEFORE_AND_AFTER = n_b_a;
        obj.NODE_INSIDE = n_i;
      }
      function copyComparisonConstants(constructor) {
        copyComparisonConstantsToObject(constructor);
        copyComparisonConstantsToObject(constructor.prototype);
      }
      function createRangeContentRemover(remover, boundaryUpdater) {
        return function() {
          assertRangeValid(this);
          var sc = this.startContainer, so = this.startOffset, root = this.commonAncestorContainer;
          var iterator = new RangeIterator(this, true);
          var node2, boundary;
          if (sc !== root) {
            node2 = getClosestAncestorIn(sc, root, true);
            boundary = getBoundaryAfterNode(node2);
            sc = boundary.node;
            so = boundary.offset;
          }
          iterateSubtree(iterator, assertNodeNotReadOnly);
          iterator.reset();
          var returnValue = remover(iterator);
          iterator.detach();
          boundaryUpdater(this, sc, so, sc, so);
          return returnValue;
        };
      }
      function createPrototypeRange(constructor, boundaryUpdater) {
        function createBeforeAfterNodeSetter(isBefore, isStart) {
          return function(node2) {
            assertValidNodeType(node2, beforeAfterNodeTypes);
            assertValidNodeType(getRootContainer(node2), rootContainerNodeTypes);
            var boundary = (isBefore ? getBoundaryBeforeNode : getBoundaryAfterNode)(node2);
            (isStart ? setRangeStart : setRangeEnd)(this, boundary.node, boundary.offset);
          };
        }
        function setRangeStart(range, node2, offset) {
          var { endContainer: ec, endOffset: eo } = range;
          if (node2 !== range.startContainer || offset !== range.startOffset) {
            if (getRootContainer(node2) != getRootContainer(ec) || comparePoints(node2, offset, ec, eo) == 1) {
              ec = node2;
              eo = offset;
            }
            boundaryUpdater(range, node2, offset, ec, eo);
          }
        }
        function setRangeEnd(range, node2, offset) {
          var { startContainer: sc, startOffset: so } = range;
          if (node2 !== range.endContainer || offset !== range.endOffset) {
            if (getRootContainer(node2) != getRootContainer(sc) || comparePoints(node2, offset, sc, so) == -1) {
              sc = node2;
              so = offset;
            }
            boundaryUpdater(range, sc, so, node2, offset);
          }
        }
        var F = function() {};
        F.prototype = api2.rangePrototype;
        constructor.prototype = new F;
        util2.extend(constructor.prototype, {
          setStart: function(node2, offset) {
            assertNoDocTypeNotationEntityAncestor(node2, true);
            assertValidOffset(node2, offset);
            setRangeStart(this, node2, offset);
          },
          setEnd: function(node2, offset) {
            assertNoDocTypeNotationEntityAncestor(node2, true);
            assertValidOffset(node2, offset);
            setRangeEnd(this, node2, offset);
          },
          setStartAndEnd: function() {
            var args = arguments;
            var sc = args[0], so = args[1], ec = sc, eo = so;
            switch (args.length) {
              case 3:
                eo = args[2];
                break;
              case 4:
                ec = args[2];
                eo = args[3];
                break;
            }
            assertNoDocTypeNotationEntityAncestor(sc, true);
            assertValidOffset(sc, so);
            assertNoDocTypeNotationEntityAncestor(ec, true);
            assertValidOffset(ec, eo);
            boundaryUpdater(this, sc, so, ec, eo);
          },
          setBoundary: function(node2, offset, isStart) {
            this["set" + (isStart ? "Start" : "End")](node2, offset);
          },
          setStartBefore: createBeforeAfterNodeSetter(true, true),
          setStartAfter: createBeforeAfterNodeSetter(false, true),
          setEndBefore: createBeforeAfterNodeSetter(true, false),
          setEndAfter: createBeforeAfterNodeSetter(false, false),
          collapse: function(isStart) {
            assertRangeValid(this);
            if (isStart) {
              boundaryUpdater(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset);
            } else {
              boundaryUpdater(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset);
            }
          },
          selectNodeContents: function(node2) {
            assertNoDocTypeNotationEntityAncestor(node2, true);
            boundaryUpdater(this, node2, 0, node2, getNodeLength(node2));
          },
          selectNode: function(node2) {
            assertNoDocTypeNotationEntityAncestor(node2, false);
            assertValidNodeType(node2, beforeAfterNodeTypes);
            var start = getBoundaryBeforeNode(node2), end = getBoundaryAfterNode(node2);
            boundaryUpdater(this, start.node, start.offset, end.node, end.offset);
          },
          extractContents: createRangeContentRemover(extractSubtree, boundaryUpdater),
          deleteContents: createRangeContentRemover(deleteSubtree, boundaryUpdater),
          canSurroundContents: function() {
            assertRangeValid(this);
            assertNodeNotReadOnly(this.startContainer);
            assertNodeNotReadOnly(this.endContainer);
            var iterator = new RangeIterator(this, true);
            var boundariesInvalid = iterator._first && isNonTextPartiallySelected(iterator._first, this) || iterator._last && isNonTextPartiallySelected(iterator._last, this);
            iterator.detach();
            return !boundariesInvalid;
          },
          splitBoundaries: function() {
            splitRangeBoundaries(this);
          },
          splitBoundariesPreservingPositions: function(positionsToPreserve) {
            splitRangeBoundaries(this, positionsToPreserve);
          },
          normalizeBoundaries: function() {
            assertRangeValid(this);
            var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;
            var mergeForward = function(node2) {
              var sibling2 = node2.nextSibling;
              if (sibling2 && sibling2.nodeType == node2.nodeType) {
                ec = node2;
                eo = node2.length;
                node2.appendData(sibling2.data);
                removeNode(sibling2);
              }
            };
            var mergeBackward = function(node2) {
              var sibling2 = node2.previousSibling;
              if (sibling2 && sibling2.nodeType == node2.nodeType) {
                sc = node2;
                var nodeLength = node2.length;
                so = sibling2.length;
                node2.insertData(0, sibling2.data);
                removeNode(sibling2);
                if (sc == ec) {
                  eo += so;
                  ec = sc;
                } else if (ec == node2.parentNode) {
                  var nodeIndex = getNodeIndex(node2);
                  if (eo == nodeIndex) {
                    ec = node2;
                    eo = nodeLength;
                  } else if (eo > nodeIndex) {
                    eo--;
                  }
                }
              }
            };
            var normalizeStart = true;
            var sibling;
            if (isCharacterDataNode(ec)) {
              if (eo == ec.length) {
                mergeForward(ec);
              } else if (eo == 0) {
                sibling = ec.previousSibling;
                if (sibling && sibling.nodeType == ec.nodeType) {
                  eo = sibling.length;
                  if (sc == ec) {
                    normalizeStart = false;
                  }
                  sibling.appendData(ec.data);
                  removeNode(ec);
                  ec = sibling;
                }
              }
            } else {
              if (eo > 0) {
                var endNode = ec.childNodes[eo - 1];
                if (endNode && isCharacterDataNode(endNode)) {
                  mergeForward(endNode);
                }
              }
              normalizeStart = !this.collapsed;
            }
            if (normalizeStart) {
              if (isCharacterDataNode(sc)) {
                if (so == 0) {
                  mergeBackward(sc);
                } else if (so == sc.length) {
                  sibling = sc.nextSibling;
                  if (sibling && sibling.nodeType == sc.nodeType) {
                    if (ec == sibling) {
                      ec = sc;
                      eo += sc.length;
                    }
                    sc.appendData(sibling.data);
                    removeNode(sibling);
                  }
                }
              } else {
                if (so < sc.childNodes.length) {
                  var startNode = sc.childNodes[so];
                  if (startNode && isCharacterDataNode(startNode)) {
                    mergeBackward(startNode);
                  }
                }
              }
            } else {
              sc = ec;
              so = eo;
            }
            boundaryUpdater(this, sc, so, ec, eo);
          },
          collapseToPoint: function(node2, offset) {
            assertNoDocTypeNotationEntityAncestor(node2, true);
            assertValidOffset(node2, offset);
            this.setStartAndEnd(node2, offset);
          },
          parentElement: function() {
            assertRangeValid(this);
            var parentNode = this.commonAncestorContainer;
            return parentNode ? getElementAncestor(this.commonAncestorContainer, true) : null;
          }
        });
        copyComparisonConstants(constructor);
      }
      function updateCollapsedAndCommonAncestor(range) {
        range.collapsed = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        range.commonAncestorContainer = range.collapsed ? range.startContainer : dom.getCommonAncestor(range.startContainer, range.endContainer);
      }
      function updateBoundaries(range, startContainer, startOffset, endContainer, endOffset) {
        range.startContainer = startContainer;
        range.startOffset = startOffset;
        range.endContainer = endContainer;
        range.endOffset = endOffset;
        range.document = dom.getDocument(startContainer);
        updateCollapsedAndCommonAncestor(range);
      }
      function Range(doc) {
        updateBoundaries(this, doc, 0, doc, 0);
      }
      createPrototypeRange(Range, updateBoundaries);
      util2.extend(Range, {
        rangeProperties,
        RangeIterator,
        copyComparisonConstants,
        createPrototypeRange,
        inspect,
        toHtml: rangeToHtml,
        getRangeDocument,
        rangesEqual: function(r1, r2) {
          return r1.startContainer === r2.startContainer && r1.startOffset === r2.startOffset && r1.endContainer === r2.endContainer && r1.endOffset === r2.endOffset;
        }
      });
      api2.DomRange = Range;
    });
    api.createCoreModule("WrappedRange", ["DomRange"], function(api2, module2) {
      var WrappedRange, WrappedTextRange;
      var dom = api2.dom;
      var util2 = api2.util;
      var DomPosition = dom.DomPosition;
      var DomRange = api2.DomRange;
      var getBody2 = dom.getBody;
      var getContentDocument = dom.getContentDocument;
      var isCharacterDataNode = dom.isCharacterDataNode;
      if (api2.features.implementsDomRange) {
        (function() {
          var rangeProto;
          var rangeProperties = DomRange.rangeProperties;
          function updateRangeProperties(range3) {
            var i = rangeProperties.length, prop;
            while (i--) {
              prop = rangeProperties[i];
              range3[prop] = range3.nativeRange[prop];
            }
            range3.collapsed = range3.startContainer === range3.endContainer && range3.startOffset === range3.endOffset;
          }
          function updateNativeRange(range3, startContainer, startOffset, endContainer, endOffset) {
            var startMoved = range3.startContainer !== startContainer || range3.startOffset != startOffset;
            var endMoved = range3.endContainer !== endContainer || range3.endOffset != endOffset;
            var nativeRangeDifferent = !range3.equals(range3.nativeRange);
            if (startMoved || endMoved || nativeRangeDifferent) {
              range3.setEnd(endContainer, endOffset);
              range3.setStart(startContainer, startOffset);
            }
          }
          var createBeforeAfterNodeSetter;
          WrappedRange = function(range3) {
            if (!range3) {
              throw module2.createError("WrappedRange: Range must be specified");
            }
            this.nativeRange = range3;
            updateRangeProperties(this);
          };
          DomRange.createPrototypeRange(WrappedRange, updateNativeRange);
          rangeProto = WrappedRange.prototype;
          rangeProto.selectNode = function(node2) {
            this.nativeRange.selectNode(node2);
            updateRangeProperties(this);
          };
          rangeProto.cloneContents = function() {
            return this.nativeRange.cloneContents();
          };
          rangeProto.surroundContents = function(node2) {
            this.nativeRange.surroundContents(node2);
            updateRangeProperties(this);
          };
          rangeProto.collapse = function(isStart) {
            this.nativeRange.collapse(isStart);
            updateRangeProperties(this);
          };
          rangeProto.cloneRange = function() {
            return new WrappedRange(this.nativeRange.cloneRange());
          };
          rangeProto.refresh = function() {
            updateRangeProperties(this);
          };
          rangeProto.toString = function() {
            return this.nativeRange.toString();
          };
          var testTextNode = document.createTextNode("test");
          getBody2(document).appendChild(testTextNode);
          var range = document.createRange();
          range.setStart(testTextNode, 0);
          range.setEnd(testTextNode, 0);
          try {
            range.setStart(testTextNode, 1);
            rangeProto.setStart = function(node2, offset) {
              this.nativeRange.setStart(node2, offset);
              updateRangeProperties(this);
            };
            rangeProto.setEnd = function(node2, offset) {
              this.nativeRange.setEnd(node2, offset);
              updateRangeProperties(this);
            };
            createBeforeAfterNodeSetter = function(name) {
              return function(node2) {
                this.nativeRange[name](node2);
                updateRangeProperties(this);
              };
            };
          } catch (ex) {
            rangeProto.setStart = function(node2, offset) {
              try {
                this.nativeRange.setStart(node2, offset);
              } catch (ex2) {
                this.nativeRange.setEnd(node2, offset);
                this.nativeRange.setStart(node2, offset);
              }
              updateRangeProperties(this);
            };
            rangeProto.setEnd = function(node2, offset) {
              try {
                this.nativeRange.setEnd(node2, offset);
              } catch (ex2) {
                this.nativeRange.setStart(node2, offset);
                this.nativeRange.setEnd(node2, offset);
              }
              updateRangeProperties(this);
            };
            createBeforeAfterNodeSetter = function(name, oppositeName) {
              return function(node2) {
                try {
                  this.nativeRange[name](node2);
                } catch (ex2) {
                  this.nativeRange[oppositeName](node2);
                  this.nativeRange[name](node2);
                }
                updateRangeProperties(this);
              };
            };
          }
          rangeProto.setStartBefore = createBeforeAfterNodeSetter("setStartBefore", "setEndBefore");
          rangeProto.setStartAfter = createBeforeAfterNodeSetter("setStartAfter", "setEndAfter");
          rangeProto.setEndBefore = createBeforeAfterNodeSetter("setEndBefore", "setStartBefore");
          rangeProto.setEndAfter = createBeforeAfterNodeSetter("setEndAfter", "setStartAfter");
          rangeProto.selectNodeContents = function(node2) {
            this.setStartAndEnd(node2, 0, dom.getNodeLength(node2));
          };
          range.selectNodeContents(testTextNode);
          range.setEnd(testTextNode, 3);
          var range2 = document.createRange();
          range2.selectNodeContents(testTextNode);
          range2.setEnd(testTextNode, 4);
          range2.setStart(testTextNode, 2);
          if (range.compareBoundaryPoints(range.START_TO_END, range2) == -1 && range.compareBoundaryPoints(range.END_TO_START, range2) == 1) {
            rangeProto.compareBoundaryPoints = function(type, range3) {
              range3 = range3.nativeRange || range3;
              if (type == range3.START_TO_END) {
                type = range3.END_TO_START;
              } else if (type == range3.END_TO_START) {
                type = range3.START_TO_END;
              }
              return this.nativeRange.compareBoundaryPoints(type, range3);
            };
          } else {
            rangeProto.compareBoundaryPoints = function(type, range3) {
              return this.nativeRange.compareBoundaryPoints(type, range3.nativeRange || range3);
            };
          }
          var el = document.createElement("div");
          el.innerHTML = "123";
          var textNode = el.firstChild;
          var body = getBody2(document);
          body.appendChild(el);
          range.setStart(textNode, 1);
          range.setEnd(textNode, 2);
          range.deleteContents();
          if (textNode.data == "13") {
            rangeProto.deleteContents = function() {
              this.nativeRange.deleteContents();
              updateRangeProperties(this);
            };
            rangeProto.extractContents = function() {
              var frag = this.nativeRange.extractContents();
              updateRangeProperties(this);
              return frag;
            };
          } else {}
          body.removeChild(el);
          body = null;
          if (util2.isHostMethod(range, "createContextualFragment")) {
            rangeProto.createContextualFragment = function(fragmentStr) {
              return this.nativeRange.createContextualFragment(fragmentStr);
            };
          }
          getBody2(document).removeChild(testTextNode);
          rangeProto.getName = function() {
            return "WrappedRange";
          };
          api2.WrappedRange = WrappedRange;
          api2.createNativeRange = function(doc) {
            doc = getContentDocument(doc, module2, "createNativeRange");
            return doc.createRange();
          };
        })();
      }
      if (api2.features.implementsTextRange) {
        var getTextRangeContainerElement = function(textRange) {
          var parentEl = textRange.parentElement();
          var range = textRange.duplicate();
          range.collapse(true);
          var startEl = range.parentElement();
          range = textRange.duplicate();
          range.collapse(false);
          var endEl = range.parentElement();
          var startEndContainer = startEl == endEl ? startEl : dom.getCommonAncestor(startEl, endEl);
          return startEndContainer == parentEl ? startEndContainer : dom.getCommonAncestor(parentEl, startEndContainer);
        };
        var textRangeIsCollapsed = function(textRange) {
          return textRange.compareEndPoints("StartToEnd", textRange) == 0;
        };
        var getTextRangeBoundaryPosition = function(textRange, wholeRangeContainerElement, isStart, isCollapsed, startInfo) {
          var workingRange = textRange.duplicate();
          workingRange.collapse(isStart);
          var containerElement = workingRange.parentElement();
          if (!dom.isOrIsAncestorOf(wholeRangeContainerElement, containerElement)) {
            containerElement = wholeRangeContainerElement;
          }
          if (!containerElement.canHaveHTML) {
            var pos = new DomPosition(containerElement.parentNode, dom.getNodeIndex(containerElement));
            return {
              boundaryPosition: pos,
              nodeInfo: {
                nodeIndex: pos.offset,
                containerElement: pos.node
              }
            };
          }
          var workingNode = dom.getDocument(containerElement).createElement("span");
          if (workingNode.parentNode) {
            dom.removeNode(workingNode);
          }
          var comparison, workingComparisonType = isStart ? "StartToStart" : "StartToEnd";
          var previousNode, nextNode, boundaryPosition, boundaryNode;
          var start = startInfo && startInfo.containerElement == containerElement ? startInfo.nodeIndex : 0;
          var childNodeCount = containerElement.childNodes.length;
          var end = childNodeCount;
          var nodeIndex = end;
          while (true) {
            if (nodeIndex == childNodeCount) {
              containerElement.appendChild(workingNode);
            } else {
              containerElement.insertBefore(workingNode, containerElement.childNodes[nodeIndex]);
            }
            workingRange.moveToElementText(workingNode);
            comparison = workingRange.compareEndPoints(workingComparisonType, textRange);
            if (comparison == 0 || start == end) {
              break;
            } else if (comparison == -1) {
              if (end == start + 1) {
                break;
              } else {
                start = nodeIndex;
              }
            } else {
              end = end == start + 1 ? start : nodeIndex;
            }
            nodeIndex = Math.floor((start + end) / 2);
            containerElement.removeChild(workingNode);
          }
          boundaryNode = workingNode.nextSibling;
          if (comparison == -1 && boundaryNode && isCharacterDataNode(boundaryNode)) {
            workingRange.setEndPoint(isStart ? "EndToStart" : "EndToEnd", textRange);
            var offset;
            if (/[\r\n]/.test(boundaryNode.data)) {
              var tempRange = workingRange.duplicate();
              var rangeLength = tempRange.text.replace(/\r\n/g, "\r").length;
              offset = tempRange.moveStart("character", rangeLength);
              while ((comparison = tempRange.compareEndPoints("StartToEnd", tempRange)) == -1) {
                offset++;
                tempRange.moveStart("character", 1);
              }
            } else {
              offset = workingRange.text.length;
            }
            boundaryPosition = new DomPosition(boundaryNode, offset);
          } else {
            previousNode = (isCollapsed || !isStart) && workingNode.previousSibling;
            nextNode = (isCollapsed || isStart) && workingNode.nextSibling;
            if (nextNode && isCharacterDataNode(nextNode)) {
              boundaryPosition = new DomPosition(nextNode, 0);
            } else if (previousNode && isCharacterDataNode(previousNode)) {
              boundaryPosition = new DomPosition(previousNode, previousNode.data.length);
            } else {
              boundaryPosition = new DomPosition(containerElement, dom.getNodeIndex(workingNode));
            }
          }
          dom.removeNode(workingNode);
          return {
            boundaryPosition,
            nodeInfo: {
              nodeIndex,
              containerElement
            }
          };
        };
        var createBoundaryTextRange = function(boundaryPosition, isStart) {
          var boundaryNode, boundaryParent, boundaryOffset = boundaryPosition.offset;
          var doc = dom.getDocument(boundaryPosition.node);
          var workingNode, childNodes, workingRange = getBody2(doc).createTextRange();
          var nodeIsDataNode = isCharacterDataNode(boundaryPosition.node);
          if (nodeIsDataNode) {
            boundaryNode = boundaryPosition.node;
            boundaryParent = boundaryNode.parentNode;
          } else {
            childNodes = boundaryPosition.node.childNodes;
            boundaryNode = boundaryOffset < childNodes.length ? childNodes[boundaryOffset] : null;
            boundaryParent = boundaryPosition.node;
          }
          workingNode = doc.createElement("span");
          workingNode.innerHTML = "&#feff;";
          if (boundaryNode) {
            boundaryParent.insertBefore(workingNode, boundaryNode);
          } else {
            boundaryParent.appendChild(workingNode);
          }
          workingRange.moveToElementText(workingNode);
          workingRange.collapse(!isStart);
          boundaryParent.removeChild(workingNode);
          if (nodeIsDataNode) {
            workingRange[isStart ? "moveStart" : "moveEnd"]("character", boundaryOffset);
          }
          return workingRange;
        };
        WrappedTextRange = function(textRange) {
          this.textRange = textRange;
          this.refresh();
        };
        WrappedTextRange.prototype = new DomRange(document);
        WrappedTextRange.prototype.refresh = function() {
          var start, end, startBoundary;
          var rangeContainerElement = getTextRangeContainerElement(this.textRange);
          if (textRangeIsCollapsed(this.textRange)) {
            end = start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, true).boundaryPosition;
          } else {
            startBoundary = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, false);
            start = startBoundary.boundaryPosition;
            end = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, false, false, startBoundary.nodeInfo).boundaryPosition;
          }
          this.setStart(start.node, start.offset);
          this.setEnd(end.node, end.offset);
        };
        WrappedTextRange.prototype.getName = function() {
          return "WrappedTextRange";
        };
        DomRange.copyComparisonConstants(WrappedTextRange);
        var rangeToTextRange = function(range) {
          if (range.collapsed) {
            return createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
          } else {
            var startRange = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
            var endRange = createBoundaryTextRange(new DomPosition(range.endContainer, range.endOffset), false);
            var textRange = getBody2(DomRange.getRangeDocument(range)).createTextRange();
            textRange.setEndPoint("StartToStart", startRange);
            textRange.setEndPoint("EndToEnd", endRange);
            return textRange;
          }
        };
        WrappedTextRange.rangeToTextRange = rangeToTextRange;
        WrappedTextRange.prototype.toTextRange = function() {
          return rangeToTextRange(this);
        };
        api2.WrappedTextRange = WrappedTextRange;
        if (!api2.features.implementsDomRange || api2.config.preferTextRange) {
          var globalObj = function(f) {
            return f("return this;")();
          }(Function);
          if (typeof globalObj.Range == "undefined") {
            globalObj.Range = WrappedTextRange;
          }
          api2.createNativeRange = function(doc) {
            doc = getContentDocument(doc, module2, "createNativeRange");
            return getBody2(doc).createTextRange();
          };
          api2.WrappedRange = WrappedTextRange;
        }
      }
      api2.createRange = function(doc) {
        doc = getContentDocument(doc, module2, "createRange");
        return new api2.WrappedRange(api2.createNativeRange(doc));
      };
      api2.createRangyRange = function(doc) {
        doc = getContentDocument(doc, module2, "createRangyRange");
        return new DomRange(doc);
      };
      util2.createAliasForDeprecatedMethod(api2, "createIframeRange", "createRange");
      util2.createAliasForDeprecatedMethod(api2, "createIframeRangyRange", "createRangyRange");
      api2.addShimListener(function(win) {
        var doc = win.document;
        if (typeof doc.createRange == "undefined") {
          doc.createRange = function() {
            return api2.createRange(doc);
          };
        }
        doc = win = null;
      });
    });
    api.createCoreModule("WrappedSelection", ["DomRange", "WrappedRange"], function(api2, module2) {
      api2.config.checkSelectionRanges = true;
      var BOOLEAN = "boolean";
      var NUMBER = "number";
      var dom = api2.dom;
      var util2 = api2.util;
      var isHostMethod2 = util2.isHostMethod;
      var DomRange = api2.DomRange;
      var WrappedRange = api2.WrappedRange;
      var DOMException = api2.DOMException;
      var DomPosition = dom.DomPosition;
      var getNativeSelection;
      var selectionIsCollapsed;
      var features = api2.features;
      var CONTROL = "Control";
      var getDocument = dom.getDocument;
      var getBody2 = dom.getBody;
      var rangesEqual = DomRange.rangesEqual;
      function isDirectionBackward(dir) {
        return typeof dir == "string" ? /^backward(s)?$/i.test(dir) : !!dir;
      }
      function getWindow(win, methodName) {
        if (!win) {
          return window;
        } else if (dom.isWindow(win)) {
          return win;
        } else if (win instanceof WrappedSelection) {
          return win.win;
        } else {
          var doc = dom.getContentDocument(win, module2, methodName);
          return dom.getWindow(doc);
        }
      }
      function getWinSelection(winParam) {
        return getWindow(winParam, "getWinSelection").getSelection();
      }
      function getDocSelection(winParam) {
        return getWindow(winParam, "getDocSelection").document.selection;
      }
      function winSelectionIsBackward(sel) {
        var backward = false;
        if (sel.anchorNode) {
          backward = dom.comparePoints(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset) == 1;
        }
        return backward;
      }
      var implementsWinGetSelection = isHostMethod2(window, "getSelection"), implementsDocSelection = util2.isHostObject(document, "selection");
      features.implementsWinGetSelection = implementsWinGetSelection;
      features.implementsDocSelection = implementsDocSelection;
      var useDocumentSelection = implementsDocSelection && (!implementsWinGetSelection || api2.config.preferTextRange);
      if (useDocumentSelection) {
        getNativeSelection = getDocSelection;
        api2.isSelectionValid = function(winParam) {
          var doc = getWindow(winParam, "isSelectionValid").document, nativeSel = doc.selection;
          return nativeSel.type != "None" || getDocument(nativeSel.createRange().parentElement()) == doc;
        };
      } else if (implementsWinGetSelection) {
        getNativeSelection = getWinSelection;
        api2.isSelectionValid = function() {
          return true;
        };
      } else {
        module2.fail("Neither document.selection or window.getSelection() detected.");
        return false;
      }
      api2.getNativeSelection = getNativeSelection;
      var testSelection = getNativeSelection();
      if (!testSelection) {
        module2.fail("Native selection was null (possibly issue 138?)");
        return false;
      }
      var testRange = api2.createNativeRange(document);
      var body = getBody2(document);
      var selectionHasAnchorAndFocus = util2.areHostProperties(testSelection, ["anchorNode", "focusNode", "anchorOffset", "focusOffset"]);
      features.selectionHasAnchorAndFocus = selectionHasAnchorAndFocus;
      var selectionHasExtend = isHostMethod2(testSelection, "extend");
      features.selectionHasExtend = selectionHasExtend;
      var selectionHasSetBaseAndExtent = isHostMethod2(testSelection, "setBaseAndExtent");
      features.selectionHasSetBaseAndExtent = selectionHasSetBaseAndExtent;
      var selectionHasRangeCount = typeof testSelection.rangeCount == NUMBER;
      features.selectionHasRangeCount = selectionHasRangeCount;
      var selectionSupportsMultipleRanges = false;
      var collapsedNonEditableSelectionsSupported = true;
      var addRangeBackwardToNative = selectionHasExtend ? function(nativeSelection, range) {
        var doc = DomRange.getRangeDocument(range);
        var endRange = api2.createRange(doc);
        endRange.collapseToPoint(range.endContainer, range.endOffset);
        nativeSelection.addRange(getNativeRange(endRange));
        nativeSelection.extend(range.startContainer, range.startOffset);
      } : null;
      if (util2.areHostMethods(testSelection, ["addRange", "getRangeAt", "removeAllRanges"]) && typeof testSelection.rangeCount == NUMBER && features.implementsDomRange) {
        (function() {
          var sel = window.getSelection();
          if (sel) {
            var originalSelectionRangeCount = sel.rangeCount;
            var selectionHasMultipleRanges = originalSelectionRangeCount > 1;
            var originalSelectionRanges = [];
            var originalSelectionBackward = winSelectionIsBackward(sel);
            for (var i = 0;i < originalSelectionRangeCount; ++i) {
              originalSelectionRanges[i] = sel.getRangeAt(i);
            }
            var testEl = dom.createTestElement(document, "", false);
            var textNode = testEl.appendChild(document.createTextNode("   "));
            var r1 = document.createRange();
            r1.setStart(textNode, 1);
            r1.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r1);
            collapsedNonEditableSelectionsSupported = sel.rangeCount == 1;
            sel.removeAllRanges();
            if (!selectionHasMultipleRanges) {
              var chromeMatch = window.navigator.appVersion.match(/Chrome\/(.*?) /);
              if (chromeMatch && parseInt(chromeMatch[1]) >= 36) {
                selectionSupportsMultipleRanges = false;
              } else {
                var r2 = r1.cloneRange();
                r1.setStart(textNode, 0);
                r2.setEnd(textNode, 3);
                r2.setStart(textNode, 2);
                sel.addRange(r1);
                sel.addRange(r2);
                selectionSupportsMultipleRanges = sel.rangeCount == 2;
              }
            }
            dom.removeNode(testEl);
            sel.removeAllRanges();
            for (i = 0;i < originalSelectionRangeCount; ++i) {
              if (i == 0 && originalSelectionBackward) {
                if (addRangeBackwardToNative) {
                  addRangeBackwardToNative(sel, originalSelectionRanges[i]);
                } else {
                  api2.warn("Rangy initialization: original selection was backwards but selection has been restored forwards because the browser does not support Selection.extend");
                  sel.addRange(originalSelectionRanges[i]);
                }
              } else {
                sel.addRange(originalSelectionRanges[i]);
              }
            }
          }
        })();
      }
      features.selectionSupportsMultipleRanges = selectionSupportsMultipleRanges;
      features.collapsedNonEditableSelectionsSupported = collapsedNonEditableSelectionsSupported;
      var implementsControlRange = false, testControlRange;
      if (body && isHostMethod2(body, "createControlRange")) {
        testControlRange = body.createControlRange();
        if (util2.areHostProperties(testControlRange, ["item", "add"])) {
          implementsControlRange = true;
        }
      }
      features.implementsControlRange = implementsControlRange;
      if (selectionHasAnchorAndFocus) {
        selectionIsCollapsed = function(sel) {
          return sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset;
        };
      } else {
        selectionIsCollapsed = function(sel) {
          return sel.rangeCount ? sel.getRangeAt(sel.rangeCount - 1).collapsed : false;
        };
      }
      function updateAnchorAndFocusFromRange(sel, range, backward) {
        var anchorPrefix = backward ? "end" : "start", focusPrefix = backward ? "start" : "end";
        sel.anchorNode = range[anchorPrefix + "Container"];
        sel.anchorOffset = range[anchorPrefix + "Offset"];
        sel.focusNode = range[focusPrefix + "Container"];
        sel.focusOffset = range[focusPrefix + "Offset"];
      }
      function updateAnchorAndFocusFromNativeSelection(sel) {
        var nativeSel = sel.nativeSelection;
        sel.anchorNode = nativeSel.anchorNode;
        sel.anchorOffset = nativeSel.anchorOffset;
        sel.focusNode = nativeSel.focusNode;
        sel.focusOffset = nativeSel.focusOffset;
      }
      function updateEmptySelection(sel) {
        sel.anchorNode = sel.focusNode = null;
        sel.anchorOffset = sel.focusOffset = 0;
        sel.rangeCount = 0;
        sel.isCollapsed = true;
        sel._ranges.length = 0;
        updateType(sel);
      }
      function updateType(sel) {
        sel.type = sel.rangeCount == 0 ? "None" : selectionIsCollapsed(sel) ? "Caret" : "Range";
      }
      function getNativeRange(range) {
        var nativeRange;
        if (range instanceof DomRange) {
          nativeRange = api2.createNativeRange(range.getDocument());
          nativeRange.setEnd(range.endContainer, range.endOffset);
          nativeRange.setStart(range.startContainer, range.startOffset);
        } else if (range instanceof WrappedRange) {
          nativeRange = range.nativeRange;
        } else if (features.implementsDomRange && range instanceof dom.getWindow(range.startContainer).Range) {
          nativeRange = range;
        }
        return nativeRange;
      }
      function rangeContainsSingleElement(rangeNodes) {
        if (!rangeNodes.length || rangeNodes[0].nodeType != 1) {
          return false;
        }
        for (var i = 1, len = rangeNodes.length;i < len; ++i) {
          if (!dom.isAncestorOf(rangeNodes[0], rangeNodes[i])) {
            return false;
          }
        }
        return true;
      }
      function getSingleElementFromRange(range) {
        var nodes = range.getNodes();
        if (!rangeContainsSingleElement(nodes)) {
          throw module2.createError("getSingleElementFromRange: range " + range.inspect() + " did not consist of a single element");
        }
        return nodes[0];
      }
      function isTextRange2(range) {
        return !!range && typeof range.text != "undefined";
      }
      function updateFromTextRange(sel, range) {
        var wrappedRange = new WrappedRange(range);
        sel._ranges = [wrappedRange];
        updateAnchorAndFocusFromRange(sel, wrappedRange, false);
        sel.rangeCount = 1;
        sel.isCollapsed = wrappedRange.collapsed;
        updateType(sel);
      }
      function updateControlSelection(sel) {
        sel._ranges.length = 0;
        if (sel.docSelection.type == "None") {
          updateEmptySelection(sel);
        } else {
          var controlRange = sel.docSelection.createRange();
          if (isTextRange2(controlRange)) {
            updateFromTextRange(sel, controlRange);
          } else {
            sel.rangeCount = controlRange.length;
            var range, doc = getDocument(controlRange.item(0));
            for (var i = 0;i < sel.rangeCount; ++i) {
              range = api2.createRange(doc);
              range.selectNode(controlRange.item(i));
              sel._ranges.push(range);
            }
            sel.isCollapsed = sel.rangeCount == 1 && sel._ranges[0].collapsed;
            updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], false);
            updateType(sel);
          }
        }
      }
      function addRangeToControlSelection(sel, range) {
        var controlRange = sel.docSelection.createRange();
        var rangeElement = getSingleElementFromRange(range);
        var doc = getDocument(controlRange.item(0));
        var newControlRange = getBody2(doc).createControlRange();
        for (var i = 0, len = controlRange.length;i < len; ++i) {
          newControlRange.add(controlRange.item(i));
        }
        try {
          newControlRange.add(rangeElement);
        } catch (ex) {
          throw module2.createError("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
        }
        newControlRange.select();
        updateControlSelection(sel);
      }
      var getSelectionRangeAt;
      if (isHostMethod2(testSelection, "getRangeAt")) {
        getSelectionRangeAt = function(sel, index) {
          try {
            return sel.getRangeAt(index);
          } catch (ex) {
            return null;
          }
        };
      } else if (selectionHasAnchorAndFocus) {
        getSelectionRangeAt = function(sel) {
          var doc = getDocument(sel.anchorNode);
          var range = api2.createRange(doc);
          range.setStartAndEnd(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset);
          if (range.collapsed !== this.isCollapsed) {
            range.setStartAndEnd(sel.focusNode, sel.focusOffset, sel.anchorNode, sel.anchorOffset);
          }
          return range;
        };
      }
      function WrappedSelection(selection, docSelection, win) {
        this.nativeSelection = selection;
        this.docSelection = docSelection;
        this._ranges = [];
        this.win = win;
        this.refresh();
      }
      WrappedSelection.prototype = api2.selectionPrototype;
      function deleteProperties(sel) {
        sel.win = sel.anchorNode = sel.focusNode = sel._ranges = null;
        sel.rangeCount = sel.anchorOffset = sel.focusOffset = 0;
        sel.detached = true;
        updateType(sel);
      }
      var cachedRangySelections = [];
      function actOnCachedSelection(win, action) {
        var i = cachedRangySelections.length, cached, sel;
        while (i--) {
          cached = cachedRangySelections[i];
          sel = cached.selection;
          if (action == "deleteAll") {
            deleteProperties(sel);
          } else if (cached.win == win) {
            if (action == "delete") {
              cachedRangySelections.splice(i, 1);
              return true;
            } else {
              return sel;
            }
          }
        }
        if (action == "deleteAll") {
          cachedRangySelections.length = 0;
        }
        return null;
      }
      var getSelection = function(win) {
        if (win && win instanceof WrappedSelection) {
          win.refresh();
          return win;
        }
        win = getWindow(win, "getNativeSelection");
        var sel = actOnCachedSelection(win);
        var nativeSel = getNativeSelection(win), docSel = implementsDocSelection ? getDocSelection(win) : null;
        if (sel) {
          sel.nativeSelection = nativeSel;
          sel.docSelection = docSel;
          sel.refresh();
        } else {
          sel = new WrappedSelection(nativeSel, docSel, win);
          cachedRangySelections.push({ win, selection: sel });
        }
        return sel;
      };
      api2.getSelection = getSelection;
      util2.createAliasForDeprecatedMethod(api2, "getIframeSelection", "getSelection");
      var selProto = WrappedSelection.prototype;
      function createControlSelection(sel, ranges) {
        var doc = getDocument(ranges[0].startContainer);
        var controlRange = getBody2(doc).createControlRange();
        for (var i = 0, el, len = ranges.length;i < len; ++i) {
          el = getSingleElementFromRange(ranges[i]);
          try {
            controlRange.add(el);
          } catch (ex) {
            throw module2.createError("setRanges(): Element within one of the specified Ranges could not be added to control selection (does it have layout?)");
          }
        }
        controlRange.select();
        updateControlSelection(sel);
      }
      if (!useDocumentSelection && selectionHasAnchorAndFocus && util2.areHostMethods(testSelection, ["removeAllRanges", "addRange"])) {
        selProto.removeAllRanges = function() {
          this.nativeSelection.removeAllRanges();
          updateEmptySelection(this);
        };
        var addRangeBackward = function(sel, range) {
          addRangeBackwardToNative(sel.nativeSelection, range);
          sel.refresh();
        };
        if (selectionHasRangeCount) {
          selProto.addRange = function(range, direction) {
            if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
              addRangeToControlSelection(this, range);
            } else {
              if (isDirectionBackward(direction) && selectionHasExtend) {
                addRangeBackward(this, range);
              } else {
                var previousRangeCount;
                if (selectionSupportsMultipleRanges) {
                  previousRangeCount = this.rangeCount;
                } else {
                  this.removeAllRanges();
                  previousRangeCount = 0;
                }
                var clonedNativeRange = getNativeRange(range).cloneRange();
                try {
                  this.nativeSelection.addRange(clonedNativeRange);
                } catch (ex) {}
                this.rangeCount = this.nativeSelection.rangeCount;
                if (this.rangeCount == previousRangeCount + 1) {
                  if (api2.config.checkSelectionRanges) {
                    var nativeRange = getSelectionRangeAt(this.nativeSelection, this.rangeCount - 1);
                    if (nativeRange && !rangesEqual(nativeRange, range)) {
                      range = new WrappedRange(nativeRange);
                    }
                  }
                  this._ranges[this.rangeCount - 1] = range;
                  updateAnchorAndFocusFromRange(this, range, selectionIsBackward(this.nativeSelection));
                  this.isCollapsed = selectionIsCollapsed(this);
                  updateType(this);
                } else {
                  this.refresh();
                }
              }
            }
          };
        } else {
          selProto.addRange = function(range, direction) {
            if (isDirectionBackward(direction) && selectionHasExtend) {
              addRangeBackward(this, range);
            } else {
              this.nativeSelection.addRange(getNativeRange(range));
              this.refresh();
            }
          };
        }
        selProto.setRanges = function(ranges) {
          if (implementsControlRange && implementsDocSelection && ranges.length > 1) {
            createControlSelection(this, ranges);
          } else {
            this.removeAllRanges();
            for (var i = 0, len = ranges.length;i < len; ++i) {
              this.addRange(ranges[i]);
            }
          }
        };
      } else if (isHostMethod2(testSelection, "empty") && isHostMethod2(testRange, "select") && implementsControlRange && useDocumentSelection) {
        selProto.removeAllRanges = function() {
          try {
            this.docSelection.empty();
            if (this.docSelection.type != "None") {
              var doc;
              if (this.anchorNode) {
                doc = getDocument(this.anchorNode);
              } else if (this.docSelection.type == CONTROL) {
                var controlRange = this.docSelection.createRange();
                if (controlRange.length) {
                  doc = getDocument(controlRange.item(0));
                }
              }
              if (doc) {
                var textRange = getBody2(doc).createTextRange();
                textRange.select();
                this.docSelection.empty();
              }
            }
          } catch (ex) {}
          updateEmptySelection(this);
        };
        selProto.addRange = function(range) {
          if (this.docSelection.type == CONTROL) {
            addRangeToControlSelection(this, range);
          } else {
            api2.WrappedTextRange.rangeToTextRange(range).select();
            this._ranges[0] = range;
            this.rangeCount = 1;
            this.isCollapsed = this._ranges[0].collapsed;
            updateAnchorAndFocusFromRange(this, range, false);
            updateType(this);
          }
        };
        selProto.setRanges = function(ranges) {
          this.removeAllRanges();
          var rangeCount = ranges.length;
          if (rangeCount > 1) {
            createControlSelection(this, ranges);
          } else if (rangeCount) {
            this.addRange(ranges[0]);
          }
        };
      } else {
        module2.fail("No means of selecting a Range or TextRange was found");
        return false;
      }
      selProto.getRangeAt = function(index) {
        if (index < 0 || index >= this.rangeCount) {
          throw new DOMException("INDEX_SIZE_ERR");
        } else {
          return this._ranges[index].cloneRange();
        }
      };
      var refreshSelection;
      if (useDocumentSelection) {
        refreshSelection = function(sel) {
          var range;
          if (api2.isSelectionValid(sel.win)) {
            range = sel.docSelection.createRange();
          } else {
            range = getBody2(sel.win.document).createTextRange();
            range.collapse(true);
          }
          if (sel.docSelection.type == CONTROL) {
            updateControlSelection(sel);
          } else if (isTextRange2(range)) {
            updateFromTextRange(sel, range);
          } else {
            updateEmptySelection(sel);
          }
        };
      } else if (isHostMethod2(testSelection, "getRangeAt") && typeof testSelection.rangeCount == NUMBER) {
        refreshSelection = function(sel) {
          if (implementsControlRange && implementsDocSelection && sel.docSelection.type == CONTROL) {
            updateControlSelection(sel);
          } else {
            sel._ranges.length = sel.rangeCount = sel.nativeSelection.rangeCount;
            if (sel.rangeCount) {
              for (var i = 0, len = sel.rangeCount;i < len; ++i) {
                sel._ranges[i] = new api2.WrappedRange(sel.nativeSelection.getRangeAt(i));
              }
              updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], selectionIsBackward(sel.nativeSelection));
              sel.isCollapsed = selectionIsCollapsed(sel);
              updateType(sel);
            } else {
              updateEmptySelection(sel);
            }
          }
        };
      } else if (selectionHasAnchorAndFocus && typeof testSelection.isCollapsed == BOOLEAN && typeof testRange.collapsed == BOOLEAN && features.implementsDomRange) {
        refreshSelection = function(sel) {
          var range, nativeSel = sel.nativeSelection;
          if (nativeSel.anchorNode) {
            range = getSelectionRangeAt(nativeSel, 0);
            sel._ranges = [range];
            sel.rangeCount = 1;
            updateAnchorAndFocusFromNativeSelection(sel);
            sel.isCollapsed = selectionIsCollapsed(sel);
            updateType(sel);
          } else {
            updateEmptySelection(sel);
          }
        };
      } else {
        module2.fail("No means of obtaining a Range or TextRange from the user's selection was found");
        return false;
      }
      selProto.refresh = function(checkForChanges) {
        var oldRanges = checkForChanges ? this._ranges.slice(0) : null;
        var oldAnchorNode = this.anchorNode, oldAnchorOffset = this.anchorOffset;
        refreshSelection(this);
        if (checkForChanges) {
          var i = oldRanges.length;
          if (i != this._ranges.length) {
            return true;
          }
          if (this.anchorNode != oldAnchorNode || this.anchorOffset != oldAnchorOffset) {
            return true;
          }
          while (i--) {
            if (!rangesEqual(oldRanges[i], this._ranges[i])) {
              return true;
            }
          }
          return false;
        }
      };
      var removeRangeManually = function(sel, range) {
        var ranges = sel.getAllRanges();
        sel.removeAllRanges();
        for (var i = 0, len = ranges.length;i < len; ++i) {
          if (!rangesEqual(range, ranges[i])) {
            sel.addRange(ranges[i]);
          }
        }
        if (!sel.rangeCount) {
          updateEmptySelection(sel);
        }
      };
      if (implementsControlRange && implementsDocSelection) {
        selProto.removeRange = function(range) {
          if (this.docSelection.type == CONTROL) {
            var controlRange = this.docSelection.createRange();
            var rangeElement = getSingleElementFromRange(range);
            var doc = getDocument(controlRange.item(0));
            var newControlRange = getBody2(doc).createControlRange();
            var el, removed = false;
            for (var i = 0, len = controlRange.length;i < len; ++i) {
              el = controlRange.item(i);
              if (el !== rangeElement || removed) {
                newControlRange.add(controlRange.item(i));
              } else {
                removed = true;
              }
            }
            newControlRange.select();
            updateControlSelection(this);
          } else {
            removeRangeManually(this, range);
          }
        };
      } else {
        selProto.removeRange = function(range) {
          removeRangeManually(this, range);
        };
      }
      var selectionIsBackward;
      if (!useDocumentSelection && selectionHasAnchorAndFocus && features.implementsDomRange) {
        selectionIsBackward = winSelectionIsBackward;
        selProto.isBackward = function() {
          return selectionIsBackward(this);
        };
      } else {
        selectionIsBackward = selProto.isBackward = function() {
          return false;
        };
      }
      selProto.isBackwards = selProto.isBackward;
      selProto.toString = function() {
        var rangeTexts = [];
        for (var i = 0, len = this.rangeCount;i < len; ++i) {
          rangeTexts[i] = "" + this._ranges[i];
        }
        return rangeTexts.join("");
      };
      function assertNodeInSameDocument(sel, node2) {
        if (sel.win.document != getDocument(node2)) {
          throw new DOMException("WRONG_DOCUMENT_ERR");
        }
      }
      function assertValidOffset(node2, offset) {
        if (offset < 0 || offset > (dom.isCharacterDataNode(node2) ? node2.length : node2.childNodes.length)) {
          throw new DOMException("INDEX_SIZE_ERR");
        }
      }
      selProto.collapse = function(node2, offset) {
        assertNodeInSameDocument(this, node2);
        var range = api2.createRange(node2);
        range.collapseToPoint(node2, offset);
        this.setSingleRange(range);
        this.isCollapsed = true;
      };
      selProto.collapseToStart = function() {
        if (this.rangeCount) {
          var range = this._ranges[0];
          this.collapse(range.startContainer, range.startOffset);
        } else {
          throw new DOMException("INVALID_STATE_ERR");
        }
      };
      selProto.collapseToEnd = function() {
        if (this.rangeCount) {
          var range = this._ranges[this.rangeCount - 1];
          this.collapse(range.endContainer, range.endOffset);
        } else {
          throw new DOMException("INVALID_STATE_ERR");
        }
      };
      selProto.selectAllChildren = function(node2) {
        assertNodeInSameDocument(this, node2);
        var range = api2.createRange(node2);
        range.selectNodeContents(node2);
        this.setSingleRange(range);
      };
      if (selectionHasSetBaseAndExtent) {
        selProto.setBaseAndExtent = function(anchorNode, anchorOffset, focusNode, focusOffset) {
          this.nativeSelection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
          this.refresh();
        };
      } else if (selectionHasExtend) {
        selProto.setBaseAndExtent = function(anchorNode, anchorOffset, focusNode, focusOffset) {
          assertValidOffset(anchorNode, anchorOffset);
          assertValidOffset(focusNode, focusOffset);
          assertNodeInSameDocument(this, anchorNode);
          assertNodeInSameDocument(this, focusNode);
          var range = api2.createRange(node);
          var isBackwards = dom.comparePoints(anchorNode, anchorOffset, focusNode, focusOffset) == -1;
          if (isBackwards) {
            range.setStartAndEnd(focusNode, focusOffset, anchorNode, anchorOffset);
          } else {
            range.setStartAndEnd(anchorNode, anchorOffset, focusNode, focusOffset);
          }
          this.setSingleRange(range, isBackwards);
        };
      }
      selProto.deleteFromDocument = function() {
        if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
          var controlRange = this.docSelection.createRange();
          var element;
          while (controlRange.length) {
            element = controlRange.item(0);
            controlRange.remove(element);
            dom.removeNode(element);
          }
          this.refresh();
        } else if (this.rangeCount) {
          var ranges = this.getAllRanges();
          if (ranges.length) {
            this.removeAllRanges();
            for (var i = 0, len = ranges.length;i < len; ++i) {
              ranges[i].deleteContents();
            }
            this.addRange(ranges[len - 1]);
          }
        }
      };
      selProto.eachRange = function(func, returnValue) {
        for (var i = 0, len = this._ranges.length;i < len; ++i) {
          if (func(this.getRangeAt(i))) {
            return returnValue;
          }
        }
      };
      selProto.getAllRanges = function() {
        var ranges = [];
        this.eachRange(function(range) {
          ranges.push(range);
        });
        return ranges;
      };
      selProto.setSingleRange = function(range, direction) {
        this.removeAllRanges();
        this.addRange(range, direction);
      };
      selProto.callMethodOnEachRange = function(methodName, params) {
        var results = [];
        this.eachRange(function(range) {
          results.push(range[methodName].apply(range, params || []));
        });
        return results;
      };
      function createStartOrEndSetter(isStart) {
        return function(node2, offset) {
          var range;
          if (this.rangeCount) {
            range = this.getRangeAt(0);
            range["set" + (isStart ? "Start" : "End")](node2, offset);
          } else {
            range = api2.createRange(this.win.document);
            range.setStartAndEnd(node2, offset);
          }
          this.setSingleRange(range, this.isBackward());
        };
      }
      selProto.setStart = createStartOrEndSetter(true);
      selProto.setEnd = createStartOrEndSetter(false);
      api2.rangePrototype.select = function(direction) {
        getSelection(this.getDocument()).setSingleRange(this, direction);
      };
      selProto.changeEachRange = function(func) {
        var ranges = [];
        var backward = this.isBackward();
        this.eachRange(function(range) {
          func(range);
          ranges.push(range);
        });
        this.removeAllRanges();
        if (backward && ranges.length == 1) {
          this.addRange(ranges[0], "backward");
        } else {
          this.setRanges(ranges);
        }
      };
      selProto.containsNode = function(node2, allowPartial) {
        return this.eachRange(function(range) {
          return range.containsNode(node2, allowPartial);
        }, true) || false;
      };
      selProto.getBookmark = function(containerNode) {
        return {
          backward: this.isBackward(),
          rangeBookmarks: this.callMethodOnEachRange("getBookmark", [containerNode])
        };
      };
      selProto.moveToBookmark = function(bookmark) {
        var selRanges = [];
        for (var i = 0, rangeBookmark, range;rangeBookmark = bookmark.rangeBookmarks[i++]; ) {
          range = api2.createRange(this.win);
          range.moveToBookmark(rangeBookmark);
          selRanges.push(range);
        }
        if (bookmark.backward) {
          this.setSingleRange(selRanges[0], "backward");
        } else {
          this.setRanges(selRanges);
        }
      };
      selProto.saveRanges = function() {
        return {
          backward: this.isBackward(),
          ranges: this.callMethodOnEachRange("cloneRange")
        };
      };
      selProto.restoreRanges = function(selRanges) {
        this.removeAllRanges();
        for (var i = 0, range;range = selRanges.ranges[i]; ++i) {
          this.addRange(range, selRanges.backward && i == 0);
        }
      };
      selProto.toHtml = function() {
        var rangeHtmls = [];
        this.eachRange(function(range) {
          rangeHtmls.push(DomRange.toHtml(range));
        });
        return rangeHtmls.join("");
      };
      if (features.implementsTextRange) {
        selProto.getNativeTextRange = function() {
          var sel, textRange;
          if (sel = this.docSelection) {
            var range = sel.createRange();
            if (isTextRange2(range)) {
              return range;
            } else {
              throw module2.createError("getNativeTextRange: selection is a control selection");
            }
          } else if (this.rangeCount > 0) {
            return api2.WrappedTextRange.rangeToTextRange(this.getRangeAt(0));
          } else {
            throw module2.createError("getNativeTextRange: selection contains no range");
          }
        };
      }
      function inspect(sel) {
        var rangeInspects = [];
        var anchor = new DomPosition(sel.anchorNode, sel.anchorOffset);
        var focus = new DomPosition(sel.focusNode, sel.focusOffset);
        var name = typeof sel.getName == "function" ? sel.getName() : "Selection";
        if (typeof sel.rangeCount != "undefined") {
          for (var i = 0, len = sel.rangeCount;i < len; ++i) {
            rangeInspects[i] = DomRange.inspect(sel.getRangeAt(i));
          }
        }
        return "[" + name + "(Ranges: " + rangeInspects.join(", ") + ")(anchor: " + anchor.inspect() + ", focus: " + focus.inspect() + "]";
      }
      selProto.getName = function() {
        return "WrappedSelection";
      };
      selProto.inspect = function() {
        return inspect(this);
      };
      selProto.detach = function() {
        actOnCachedSelection(this.win, "delete");
        deleteProperties(this);
      };
      WrappedSelection.detachAll = function() {
        actOnCachedSelection(null, "deleteAll");
      };
      WrappedSelection.inspect = inspect;
      WrappedSelection.isDirectionBackward = isDirectionBackward;
      api2.Selection = WrappedSelection;
      api2.selectionPrototype = selProto;
      api2.addShimListener(function(win) {
        if (typeof win.getSelection == "undefined") {
          win.getSelection = function() {
            return getSelection(win);
          };
        }
        win = null;
      });
    });
    var docReady = false;
    var loadHandler = function(e) {
      if (!docReady) {
        docReady = true;
        if (!api.initialized && api.config.autoInitialize) {
          init();
        }
      }
    };
    if (isBrowser) {
      if (document.readyState == "complete") {
        loadHandler();
      } else {
        if (isHostMethod(document, "addEventListener")) {
          document.addEventListener("DOMContentLoaded", loadHandler, false);
        }
        addListener(window, "load", loadHandler);
      }
    }
    return api;
  }, exports);
});

// demo/ts/button-example.ts
var import_rangy = __toESM(require_rangy_core(), 1);

// src/util.ts
var isIE = navigator.appName === "Microsoft Internet Explorer" || navigator.appName === "Netscape" && new RegExp("Trident/.*rv:(\\d[.0-9]*)").exec(navigator.userAgent) !== null;
var isEdge = /Edge\/\d+/.exec(navigator.userAgent) !== null;
var isFF = navigator.userAgent.toLowerCase().includes("firefox");
var isMac = window.navigator.platform.toUpperCase().includes("MAC");
var keyCode = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  DELETE: 46,
  K: 75,
  M: 77,
  V: 86
};
var blockContainerElementNames = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "pre",
  "ul",
  "li",
  "ol",
  "address",
  "article",
  "aside",
  "audio",
  "canvas",
  "dd",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "header",
  "hgroup",
  "main",
  "nav",
  "noscript",
  "output",
  "section",
  "video",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td"
];
var emptyElementNames = ["br", "col", "colgroup", "hr", "img", "input", "source", "wbr"];
var nodeContainsWorksWithTextNodes = false;
try {
  const testParent = document.createElement("div");
  const testText = document.createTextNode(" ");
  testParent.appendChild(testText);
  nodeContainsWorksWithTextNodes = testParent.contains(testText);
} catch {}
function copyInto(overwrite, dest, ...sources) {
  dest = dest || {};
  for (let i = 0;i < sources.length; i++) {
    const source = sources[i];
    if (source) {
      for (const prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop) && typeof source[prop] !== "undefined" && (overwrite || !Object.prototype.hasOwnProperty.call(dest, prop) || typeof dest[prop] === "undefined")) {
          dest[prop] = source[prop];
        }
      }
    }
  }
  return dest;
}
function extend(...sources) {
  if (sources.length === 0)
    return {};
  const target = sources[0] || {};
  const extendSources = sources.slice(1);
  return copyInto(true, target, ...extendSources);
}
function defaults(...sources) {
  if (sources.length === 0)
    return {};
  const target = sources[0] || {};
  const defaultSources = sources.slice(1);
  return copyInto(false, target, ...defaultSources);
}
function isMetaCtrlKey(event) {
  return isMac && event.metaKey || !isMac && event.ctrlKey;
}
function isKey(event, keys) {
  const keyCodeValue = getKeyCode(event);
  if (!Array.isArray(keys)) {
    return keyCodeValue === keys;
  }
  return keys.includes(keyCodeValue);
}
function getKeyCode(event) {
  let keyCodeValue = event.which;
  if (keyCodeValue === null) {
    keyCodeValue = event.charCode !== null ? event.charCode : event.keyCode;
  }
  return keyCodeValue;
}
function isElement(obj) {
  return obj != null && obj.nodeType === 1;
}
function isDescendant(parent, child, checkEquality = false) {
  if (!parent || !child) {
    return false;
  }
  if (parent === child) {
    return !!checkEquality;
  }
  if (parent.nodeType !== 1) {
    return false;
  }
  if (nodeContainsWorksWithTextNodes || child.nodeType !== 3) {
    return parent.contains(child);
  }
  let current = child.parentNode;
  while (current) {
    if (current === parent) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}
function traverseUp(current, testElementFunction) {
  if (!current) {
    return false;
  }
  do {
    if (current.nodeType === 1 && testElementFunction(current)) {
      return current;
    }
    current = current.parentNode;
  } while (current);
  return false;
}
function htmlEntities(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function insertHTMLCommand(doc, html) {
  let _hasVisualSelection = false;
  let selection = null;
  let range = null;
  if (doc.getSelection) {
    selection = doc.getSelection();
    if (selection && selection.rangeCount) {
      const firstRange = selection.getRangeAt(0);
      const isCollapsed = firstRange.collapsed;
      range = firstRange.cloneRange();
      _hasVisualSelection = !isCollapsed;
    }
  }
  if (doc.queryCommandSupported && doc.queryCommandSupported("insertHTML")) {
    doc.execCommand("insertHTML", false, html);
  } else if (range) {
    range.deleteContents();
    const el = doc.createElement("div");
    el.innerHTML = html;
    const frag = doc.createDocumentFragment();
    let node2;
    let lastNode = null;
    while (node2 = el.firstChild) {
      lastNode = frag.appendChild(node2);
    }
    range.insertNode(frag);
    if (lastNode && selection) {
      range = range.cloneRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    console.warn("insertHTMLCommand: unable to insert HTML");
  }
}
function execFormatBlock(doc, tagName) {
  const ieVersion = getIEVersion();
  if (ieVersion && ieVersion <= 10) {
    doc.execCommand("formatBlock", false, `<${tagName}>`);
  } else {
    doc.execCommand("formatBlock", false, tagName);
  }
}
function getIEVersion() {
  const match = navigator.userAgent.match(/MSIE (\d+)/);
  if (match) {
    return Number.parseInt(match[1], 10);
  }
  const tridentMatch = navigator.userAgent.match(/Trident\/.*rv:(\d+)/);
  if (tridentMatch) {
    return Number.parseInt(tridentMatch[1], 10);
  }
  return null;
}
function setTargetBlank(el, anchorUrl) {
  const anchors = anchorUrl ? el.querySelectorAll(`a[href="${anchorUrl}"]`) : el.querySelectorAll("a");
  for (let i = 0;i < anchors.length; i++) {
    const anchor = anchors[i];
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
}
function removeTargetBlank(el, anchorUrl) {
  const anchors = anchorUrl ? el.querySelectorAll(`a[href="${anchorUrl}"]`) : el.querySelectorAll("a");
  for (let i = 0;i < anchors.length; i++) {
    const anchor = anchors[i];
    anchor.removeAttribute("target");
    if (anchor.rel === "noopener noreferrer") {
      anchor.removeAttribute("rel");
    }
  }
}
function addClassToAnchors(el, buttonClass) {
  const anchors = el.querySelectorAll("a");
  for (let i = 0;i < anchors.length; i++) {
    const anchor = anchors[i];
    anchor.classList.add(buttonClass);
  }
}
function isListItem(node2) {
  if (!node2) {
    return false;
  }
  if (node2.nodeType === Node.ELEMENT_NODE) {
    const element = node2;
    if (element.nodeName.toLowerCase() === "li") {
      return true;
    }
  }
  let parentNode = node2.parentNode;
  let tagName = parentNode?.nodeName.toLowerCase();
  while (parentNode && (tagName === "li" || !isBlockContainer(parentNode) && tagName !== "div")) {
    if (tagName === "li") {
      return true;
    }
    parentNode = parentNode.parentNode;
    if (parentNode) {
      tagName = parentNode.nodeName.toLowerCase();
    } else {
      return false;
    }
  }
  return false;
}
function cleanListDOM(ownerDocument, element) {
  const listElements = element.querySelectorAll("ol, ul");
  for (let i = 0;i < listElements.length; i++) {
    const listElement = listElements[i];
    const listItems = listElement.children;
    for (let j = listItems.length - 1;j >= 0; j--) {
      const listItem = listItems[j];
      if (listItem.tagName.toLowerCase() !== "li") {
        const li = ownerDocument.createElement("li");
        li.innerHTML = listItem.innerHTML;
        listElement.replaceChild(li, listItem);
      }
    }
  }
}
function findCommonRoot(inNode1, inNode2) {
  const node1Parents = [];
  let current1 = inNode1;
  while (current1) {
    node1Parents.push(current1);
    current1 = current1.parentNode;
  }
  let current2 = inNode2;
  while (current2) {
    if (node1Parents.includes(current2)) {
      return current2;
    }
    current2 = current2.parentNode;
  }
  return inNode1.ownerDocument.body;
}
function isElementAtBeginningOfBlock(node2) {
  const container = getClosestBlockContainer(node2);
  if (!container) {
    return false;
  }
  return getFirstSelectableLeafNode(container) === node2;
}
function isMediumEditorElement(element) {
  return element && element.getAttribute("data-medium-editor-element") === "true";
}
function getContainerEditorElement(element) {
  return traverseUp(element, (node2) => isMediumEditorElement(node2));
}
function isBlockContainer(element) {
  return blockContainerElementNames.includes(element.tagName.toLowerCase());
}
function getClosestBlockContainer(node2) {
  return traverseUp(node2, (testNode) => isBlockContainer(testNode));
}
function getTopBlockContainer(element) {
  let topContainer = element;
  while (topContainer.parentElement && !isMediumEditorElement(topContainer.parentElement)) {
    const parent = topContainer.parentElement;
    if (isBlockContainer(parent)) {
      topContainer = parent;
    } else {
      break;
    }
  }
  return topContainer;
}
function getFirstSelectableLeafNode(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node2) {
      if (node2.nodeType === Node.TEXT_NODE) {
        return NodeFilter.FILTER_ACCEPT;
      }
      const el = node2;
      if (emptyElementNames.includes(el.tagName.toLowerCase())) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    }
  });
  return walker.nextNode();
}
function getFirstTextNode(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  return walker.nextNode();
}
function ensureUrlHasProtocol(url) {
  if (!url.includes("://") && !url.startsWith("mailto:") && !url.startsWith("tel:")) {
    return `http://${url}`;
  }
  return url;
}
function warn(...args) {
  if (console && console.warn) {
    console.warn(...args);
  }
}
function deprecated(oldName, newName, version) {
  const message = `${oldName} is deprecated, please use ${newName} instead. ${oldName} will be removed in version ${version}`;
  warn(message);
}
function deprecatedMethod(oldName, newName, args, version) {
  deprecated(oldName, newName, version);
  return;
}
function cleanupAttrs(el, attrs) {
  for (const attr of attrs) {
    el.removeAttribute(attr);
  }
}
function cleanupTags(el, tags) {
  for (const tag of tags) {
    const elements = el.querySelectorAll(tag);
    for (let i = 0;i < elements.length; i++) {
      elements[i].remove();
    }
  }
}
function unwrapTags(el, tags) {
  for (const tag of tags) {
    const elements = el.querySelectorAll(tag);
    for (let i = 0;i < elements.length; i++) {
      unwrap(elements[i], el.ownerDocument);
    }
  }
}
function getClosestTag(el, tag) {
  return traverseUp(el, (node2) => {
    const element = node2;
    return !!(element.tagName && element.tagName.toLowerCase() === tag.toLowerCase());
  });
}
function unwrap(el, doc) {
  const parent = el.parentNode;
  if (!parent)
    return;
  const frag = doc.createDocumentFragment();
  while (el.firstChild) {
    frag.appendChild(el.firstChild);
  }
  parent.replaceChild(frag, el);
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}
function throttle(func, wait) {
  let timeout = null;
  let previous = 0;
  const throttled = function(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      return func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        return func.apply(this, args);
      }, remaining);
    }
  };
  return throttled;
}
function findOrCreateMatchingTextNodes(document2, element, match) {
  const treeWalker = document2.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  const matchedNodes = [];
  let currentTextIndex = 0;
  let startReached = false;
  let currentNode = treeWalker.nextNode();
  while (currentNode) {
    const nextTextIndex = currentTextIndex + currentNode.textContent.length;
    if (!startReached && match.start >= currentTextIndex && match.start < nextTextIndex) {
      const matchStartIndex = match.start - currentTextIndex;
      if (matchStartIndex > 0) {
        currentNode = currentNode.splitText(matchStartIndex);
        currentTextIndex += matchStartIndex;
      }
      startReached = true;
    }
    if (startReached) {
      if (match.end <= nextTextIndex) {
        const matchEndIndex = match.end - currentTextIndex;
        if (matchEndIndex < currentNode.textContent.length) {
          currentNode.splitText(matchEndIndex);
        }
        matchedNodes.push(currentNode);
        break;
      }
      matchedNodes.push(currentNode);
    }
    currentTextIndex = nextTextIndex;
    currentNode = treeWalker.nextNode();
  }
  return matchedNodes;
}
function splitByBlockElements(element) {
  const blocks = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node3) {
      const el = node3;
      if (isBlockContainer(el)) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    }
  });
  let node2 = walker.nextNode();
  while (node2) {
    blocks.push(node2);
    node2 = walker.nextNode();
  }
  return blocks;
}
function findAdjacentTextNodeWithContent(rootNode, targetNode, _ownerDocument) {
  const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, {
    acceptNode(node3) {
      const textNode = node3;
      if (textNode.textContent && textNode.textContent.trim().length > 0) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    }
  });
  let node2 = walker.nextNode();
  while (node2) {
    if (node2 === targetNode || isDescendant(targetNode, node2)) {
      return walker.nextNode();
    }
    node2 = walker.nextNode();
  }
  return null;
}
function findPreviousSibling(node2) {
  let current = node2.previousSibling;
  while (current && current.nodeType === Node.TEXT_NODE && !current.textContent?.trim()) {
    current = current.previousSibling;
  }
  return current;
}
function createLink(document2, textNodes, href, target) {
  const anchor = document2.createElement("a");
  moveTextRangeIntoElement(textNodes[0], textNodes[textNodes.length - 1], anchor);
  anchor.setAttribute("href", href);
  if (target) {
    if (target === "_blank") {
      anchor.setAttribute("rel", "noopener noreferrer");
    }
    anchor.setAttribute("target", target);
  }
  return anchor;
}
function moveTextRangeIntoElement(startNode, endNode, newElement) {
  const range = document.createRange();
  range.setStartBefore(startNode);
  range.setEndAfter(endNode);
  const contents = range.extractContents();
  newElement.appendChild(contents);
  range.insertNode(newElement);
}
function splitOffDOMTree(rootNode, leafNode, splitLeft = false) {
  let current = leafNode;
  let parent = current.parentNode;
  while (parent && parent !== rootNode) {
    const newParent = parent.cloneNode(false);
    if (splitLeft) {
      while (current.previousSibling) {
        newParent.insertBefore(current.previousSibling, newParent.firstChild);
      }
    } else {
      while (current.nextSibling) {
        newParent.appendChild(current.nextSibling);
      }
    }
    if (newParent.hasChildNodes()) {
      if (splitLeft) {
        parent.parentNode.insertBefore(newParent, parent);
      } else {
        parent.parentNode.insertBefore(newParent, parent.nextSibling);
      }
    }
    current = parent;
    parent = current.parentNode;
  }
  return current;
}
function depthOfNode(inNode) {
  let depth = 0;
  let current = inNode;
  while (current.parentNode) {
    depth++;
    current = current.parentNode;
  }
  return depth;
}
var util = {
  isIE,
  isEdge,
  isFF,
  isMac,
  keyCode,
  blockContainerElementNames,
  emptyElementNames,
  extend,
  defaults,
  copyInto,
  isMetaCtrlKey,
  isKey,
  getKeyCode,
  isElement,
  isDescendant,
  traverseUp,
  htmlEntities,
  insertHTMLCommand,
  execFormatBlock,
  setTargetBlank,
  removeTargetBlank,
  addClassToAnchors,
  isListItem,
  cleanListDOM,
  findCommonRoot,
  isElementAtBeginningOfBlock,
  isMediumEditorElement,
  getContainerEditorElement,
  isBlockContainer,
  getClosestBlockContainer,
  getTopBlockContainer,
  getFirstSelectableLeafNode,
  getFirstTextNode,
  ensureUrlHasProtocol,
  warn,
  deprecated,
  deprecatedMethod,
  cleanupAttrs,
  cleanupTags,
  unwrapTags,
  getClosestTag,
  unwrap,
  guid,
  throttle,
  findOrCreateMatchingTextNodes,
  splitByBlockElements,
  findAdjacentTextNodeWithContent,
  findPreviousSibling,
  createLink,
  moveTextRangeIntoElement,
  splitOffDOMTree,
  depthOfNode
};

// src/events.ts
function isElementDescendantOfExtension(extensions, element) {
  if (!extensions) {
    return false;
  }
  const extensionArray = Array.isArray(extensions) ? extensions : Object.values(extensions);
  return extensionArray.some((extension) => {
    if (typeof extension.getInteractionElements !== "function") {
      return false;
    }
    let extensionElements = extension.getInteractionElements();
    if (!extensionElements) {
      return false;
    }
    if (!Array.isArray(extensionElements)) {
      extensionElements = [extensionElements];
    }
    return extensionElements.some((el) => {
      return util.isDescendant(el, element, true);
    });
  });
}

class Events {
  base;
  options;
  events = [];
  disabledEvents = {};
  customEvents = {};
  listeners = {};
  contentCache = {};
  eventsCache = [];
  execCommandListener;
  lastMousedownTarget = null;
  InputEventOnContenteditableSupported = !util.isIE && !util.isEdge;
  static InputEventOnContenteditableSupported = !util.isIE && !util.isEdge;
  constructor(instance) {
    this.base = instance;
    this.options = this.base.options;
  }
  attachDOMEvent(targets, event, listener, useCapture = false) {
    let targetArray;
    if (Array.isArray(targets)) {
      targetArray = targets;
    } else if (targets instanceof HTMLCollection) {
      targetArray = Array.from(targets);
    } else {
      targetArray = [targets];
    }
    targetArray.forEach((target) => {
      target.addEventListener(event, listener, useCapture);
      this.events.push({ target, event, listener, useCapture });
    });
  }
  detachDOMEvent(targets, event, listener, useCapture = false) {
    let targetArray;
    if (Array.isArray(targets)) {
      targetArray = targets;
    } else if (targets instanceof HTMLCollection) {
      targetArray = Array.from(targets);
    } else {
      targetArray = [targets];
    }
    targetArray.forEach((target) => {
      const index = this.indexOfListener(target, event, listener, useCapture);
      if (index !== -1) {
        const eventRecord = this.events.splice(index, 1)[0];
        eventRecord.target.removeEventListener(eventRecord.event, eventRecord.listener, eventRecord.useCapture);
      }
    });
  }
  indexOfListener(target, event, listener, useCapture) {
    for (let i = 0;i < this.events.length; i++) {
      const item = this.events[i];
      if (item.target === target && item.event === event && item.listener === listener && item.useCapture === useCapture) {
        return i;
      }
    }
    return -1;
  }
  detachAllDOMEvents() {
    let eventRecord = this.events.pop();
    while (eventRecord) {
      eventRecord.target.removeEventListener(eventRecord.event, eventRecord.listener, eventRecord.useCapture);
      eventRecord = this.events.pop();
    }
  }
  detachAllEventsFromElement(element) {
    const filtered = this.events.filter((e) => {
      const target = e.target;
      return target && target.getAttribute && target.getAttribute("medium-editor-index") === element.getAttribute("medium-editor-index");
    });
    filtered.forEach((eventRecord) => {
      this.detachDOMEvent(eventRecord.target, eventRecord.event, eventRecord.listener, eventRecord.useCapture);
    });
  }
  attachAllEventsToElement(element) {
    if (this.listeners.editableInput) {
      this.contentCache[element.getAttribute("medium-editor-index") || ""] = element.innerHTML;
    }
    if (this.eventsCache) {
      this.eventsCache.forEach((e) => {
        this.attachDOMEvent(element, e.name, e.handler.bind(this));
      });
    }
  }
  enableCustomEvent(event) {
    if (this.disabledEvents[event] !== undefined) {
      delete this.disabledEvents[event];
    }
  }
  disableCustomEvent(event) {
    this.disabledEvents[event] = true;
  }
  attachCustomEvent(event, listener) {
    if (!this.customEvents[event]) {
      this.customEvents[event] = [];
    }
    this.customEvents[event].push(listener);
  }
  detachCustomEvent(event, listener) {
    const index = this.indexOfCustomListener(event, listener);
    if (index !== -1) {
      this.customEvents[event].splice(index, 1);
    }
  }
  indexOfCustomListener(event, listener) {
    if (!this.customEvents[event] || !this.customEvents[event].length) {
      return -1;
    }
    return this.customEvents[event].indexOf(listener);
  }
  detachAllCustomEvents() {
    this.customEvents = {};
  }
  triggerCustomEvent(name, data, editable) {
    if (this.customEvents[name] && !this.disabledEvents[name]) {
      this.customEvents[name].forEach((listener) => {
        listener(data, editable);
      });
    }
  }
  setupListener(name) {
    if (this.listeners[name]) {
      return;
    }
    switch (name) {
      case "externalInteraction":
        this.attachDOMEvent(this.options.ownerDocument.body, "mousedown", this.handleBodyMousedown.bind(this), true);
        this.attachDOMEvent(this.options.ownerDocument.body, "click", this.handleBodyClick.bind(this), true);
        this.attachDOMEvent(this.options.ownerDocument.body, "focus", this.handleBodyFocus.bind(this), true);
        this.listeners[name] = true;
        break;
      case "blur":
        this.setupListener("externalInteraction");
        this.listeners[name] = true;
        break;
      case "focus":
        this.setupListener("externalInteraction");
        this.attachToEachElement("focus", this.handleElementFocus.bind(this));
        this.listeners[name] = true;
        break;
      case "editableInput":
        this.contentCache = {};
        this.base.elements.forEach((element) => {
          this.contentCache[element.getAttribute("medium-editor-index") || ""] = element.innerHTML;
        });
        this.listeners[name] = this.handleInput.bind(this);
        this.attachToEachElement("input", this.listeners[name]);
        break;
      case "editableClick":
        this.listeners[name] = this.handleClick.bind(this);
        this.attachToEachElement("click", this.listeners[name]);
        break;
      case "editableBlur":
        this.listeners[name] = this.handleBlur.bind(this);
        this.attachToEachElement("blur", this.listeners[name]);
        break;
      case "editableKeypress":
        this.listeners[name] = this.handleKeypress.bind(this);
        this.attachToEachElement("keypress", this.listeners[name]);
        break;
      case "editableKeyup":
        this.listeners[name] = this.handleKeyup.bind(this);
        this.attachToEachElement("keyup", this.listeners[name]);
        break;
      case "editableKeydown":
        this.listeners[name] = this.handleKeydown.bind(this);
        this.attachToEachElement("keydown", this.listeners[name]);
        break;
      case "editablePaste":
        this.listeners[name] = this.handlePaste.bind(this);
        this.attachToEachElement("paste", this.listeners[name]);
        break;
      case "editableDrag":
        this.listeners[name] = this.handleDrag.bind(this);
        this.attachToEachElement("dragstart", this.listeners[name]);
        this.attachToEachElement("dragover", this.listeners[name]);
        this.attachToEachElement("dragleave", this.listeners[name]);
        break;
      case "editableDrop":
        this.listeners[name] = this.handleDrop.bind(this);
        this.attachToEachElement("drop", this.listeners[name]);
        break;
    }
  }
  attachToEachElement(name, handler) {
    this.base.elements.forEach((element) => {
      this.attachDOMEvent(element, name, handler.bind(this));
    });
    this.eventsCache.push({ name, handler });
  }
  handleInput(event) {
    if (event.target) {
      this.updateInput(event.target, event);
    }
  }
  handleClick(event) {
    this.triggerCustomEvent("editableClick", event, event.target);
  }
  handleBlur(event) {
    this.triggerCustomEvent("editableBlur", event, event.target);
  }
  handleKeypress(event) {
    this.triggerCustomEvent("editableKeypress", event, event.target);
  }
  handleKeyup(event) {
    this.triggerCustomEvent("editableKeyup", event, event.target);
  }
  handleKeydown(event) {
    this.triggerCustomEvent("editableKeydown", event, event.target);
  }
  handleElementFocus(event) {
    this.updateFocus(event.target, event);
  }
  handlePaste(event) {
    this.triggerCustomEvent("editablePaste", event, event.target);
  }
  handleDrag(event) {
    this.triggerCustomEvent("editableDrag", event, event.target);
  }
  handleDrop(event) {
    this.triggerCustomEvent("editableDrop", event, event.target);
  }
  updateInput(target, eventObj) {
    const index = target.getAttribute("medium-editor-index");
    if (index && this.contentCache[index] && this.contentCache[index] !== target.innerHTML) {
      this.triggerCustomEvent("editableInput", eventObj, target);
    }
    if (index) {
      this.contentCache[index] = target.innerHTML;
    }
  }
  handleDocumentSelectionChange(_event) {
    if (this.base.options.ownerDocument.getSelection) {
      const selection = this.base.options.ownerDocument.getSelection();
      if (selection && !selection.isCollapsed) {
        this.base.checkSelection();
      }
    }
  }
  handleDocumentExecCommand() {
    this.base.checkSelection();
  }
  handleBodyClick(event) {
    this.updateFocus(event.target, event);
  }
  handleBodyFocus(event) {
    this.updateFocus(event.target, event);
  }
  handleBodyMousedown(event) {
    this.lastMousedownTarget = event.target;
  }
  updateFocus(target, eventObj) {
    const hadFocus = this.base.getFocusedElement();
    let toFocus = null;
    if (hadFocus && eventObj.type === "click" && this.lastMousedownTarget && (util.isDescendant(hadFocus, this.lastMousedownTarget, true) || isElementDescendantOfExtension(this.base.extensions, this.lastMousedownTarget))) {
      toFocus = hadFocus;
    }
    if (!toFocus) {
      this.base.elements.some((element) => {
        if (!toFocus && util.isDescendant(element, target, true)) {
          toFocus = element;
        }
        return !!toFocus;
      });
    }
    const externalEvent = !util.isDescendant(hadFocus, target, true) && !isElementDescendantOfExtension(this.base.extensions, target);
    if (toFocus !== hadFocus) {
      if (hadFocus && externalEvent) {
        hadFocus.removeAttribute("data-medium-focused");
        this.triggerCustomEvent("blur", eventObj, hadFocus);
      }
      if (toFocus) {
        toFocus.setAttribute("data-medium-focused", "true");
        this.triggerCustomEvent("focus", eventObj, toFocus);
      }
    }
    if (externalEvent) {
      this.triggerCustomEvent("externalInteraction", eventObj);
    }
  }
  focusElement(element) {
    element.focus();
    const focusEvent = new Event("focus");
    Object.defineProperty(focusEvent, "target", { value: element, writable: false });
    this.updateFocus(element, focusEvent);
  }
  cleanupElement(element) {
    element.removeAttribute("data-medium-focused");
  }
  attachToExecCommand() {
    if (this.execCommandListener) {
      return;
    }
    this.execCommandListener = (_execInfo) => {
      this.handleDocumentExecCommand();
    };
    this.wrapExecCommand();
    const doc = this.options.ownerDocument;
    if (!doc.execCommand.listeners) {
      doc.execCommand.listeners = [];
    }
    doc.execCommand.listeners.push(this.execCommandListener);
  }
  detachExecCommand() {
    const doc = this.options.ownerDocument;
    if (this.execCommandListener && doc.execCommand && doc.execCommand.listeners) {
      const index = doc.execCommand.listeners.indexOf(this.execCommandListener);
      if (index !== -1) {
        doc.execCommand.listeners.splice(index, 1);
      }
      if (doc.execCommand.listeners.length === 0) {
        this.unwrapExecCommand();
      }
    }
  }
  wrapExecCommand() {
    const doc = this.options.ownerDocument;
    if (doc.execCommand.listeners) {
      return;
    }
    const callListeners = (args, result) => {
      if (doc.execCommand.listeners) {
        doc.execCommand.listeners.forEach((listener) => {
          listener({ command: args[0], args, result });
        });
      }
    };
    const originalExecCommand = doc.execCommand;
    const wrapper = function(...args) {
      const result = originalExecCommand.apply(doc, args);
      callListeners(args, result);
      return result;
    };
    wrapper.listeners = [];
    wrapper.original = originalExecCommand;
    doc.execCommand = wrapper;
  }
  unwrapExecCommand() {
    const doc = this.options.ownerDocument;
    if (doc.execCommand.original) {
      doc.execCommand = doc.execCommand.original;
    }
  }
  destroy() {
    this.detachAllDOMEvents();
    this.detachAllCustomEvents();
    this.detachExecCommand();
    if (this.base.elements) {
      this.base.elements.forEach((element) => {
        element.removeAttribute("data-medium-focused");
      });
    }
  }
}

// src/extensions/placeholder.ts
class Placeholder {
  name = "placeholder";
  text = "Type your text";
  hideOnClick = true;
  hideOnFocus = false;
  editor;
  constructor(editor, options = {}) {
    this.editor = editor;
    this.text = options.text || this.text;
    this.hideOnClick = options.hideOnClick !== undefined ? options.hideOnClick : this.hideOnClick;
    if (options.hideOnFocus !== undefined) {
      this.hideOnFocus = options.hideOnFocus;
    } else {
      this.hideOnFocus = this.hideOnClick;
    }
  }
  init() {
    this.initPlaceholders();
    this.attachEventHandlers();
  }
  initPlaceholders() {
    this.editor.elements.forEach((el) => this.initElement(el));
  }
  handleAddElement(_data, editable) {
    if (editable) {
      this.initElement(editable);
    }
  }
  initElement(el) {
    if (!el.getAttribute("data-placeholder")) {
      el.setAttribute("data-placeholder", this.text);
    }
    this.updatePlaceholder(el);
  }
  destroy() {
    this.editor.elements.forEach((el) => this.cleanupElement(el));
  }
  handleRemoveElement(_event, editable) {
    if (!editable)
      return;
    this.cleanupElement(editable);
  }
  cleanupElement(el) {
    if (el.getAttribute("data-placeholder") === this.text) {
      el.removeAttribute("data-placeholder");
    }
  }
  showPlaceholder(el) {
    if (el) {
      if (this.isFirefox() && el.childNodes.length === 0) {
        el.classList.add("medium-editor-placeholder-relative");
        el.classList.remove("medium-editor-placeholder");
      } else {
        el.classList.add("medium-editor-placeholder");
        el.classList.remove("medium-editor-placeholder-relative");
      }
    }
  }
  hidePlaceholder(el) {
    if (el) {
      el.classList.remove("medium-editor-placeholder");
      el.classList.remove("medium-editor-placeholder-relative");
    }
  }
  updatePlaceholder(el, dontShow) {
    if (el.querySelector("img, blockquote, ul, ol, table") || el.textContent?.replace(/^\s+|\s+$/g, "") !== "") {
      return this.hidePlaceholder(el);
    }
    if (dontShow) {
      this.hidePlaceholder(el);
    } else {
      this.showPlaceholder(el);
    }
  }
  attachEventHandlers() {
    if (this.hideOnClick || this.hideOnFocus) {
      this.editor.subscribe("focus", this.handleFocus.bind(this));
    }
    this.editor.subscribe("editableInput", this.handleInput.bind(this));
    this.editor.subscribe("blur", this.handleBlur.bind(this));
    this.editor.subscribe("addElement", this.handleAddElement.bind(this));
    this.editor.subscribe("removeElement", this.handleRemoveElement.bind(this));
  }
  handleInput(_event, element) {
    if (!element)
      return;
    const dontShow = this.hideOnFocus && element === this.editor.getFocusedElement();
    this.updatePlaceholder(element, dontShow);
  }
  handleFocus(_event, element) {
    if (!element)
      return;
    if (this.hideOnFocus) {
      this.hidePlaceholder(element);
    }
  }
  handleBlur(_event, element) {
    if (!element)
      return;
    this.updatePlaceholder(element);
  }
  isFirefox() {
    return typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);
  }
}

// src/extensions/toolbar.ts
class Toolbar {
  name = "toolbar";
  options;
  toolbar;
  buttons = [];
  container;
  editor;
  constructor(options = {}, container = document.body, editor) {
    this.options = {
      buttons: ["bold", "italic", "underline", "anchor", "h2", "h3", "quote"],
      static: false,
      align: "center",
      sticky: false,
      updateOnEmptySelection: false,
      allowMultiParagraphSelection: true,
      standardizeSelectionStart: false,
      relativeContainer: null,
      diffLeft: 0,
      diffTop: 0,
      firstButtonClass: "medium-editor-button-first",
      lastButtonClass: "medium-editor-button-last",
      ...options
    };
    this.container = options.relativeContainer || container;
    this.editor = editor;
  }
  init() {
    this.createToolbar();
    this.attachEventListeners();
  }
  destroy() {
    if (this.toolbar) {
      this.toolbar.remove();
    }
    this.buttons = [];
  }
  createToolbar() {
    this.toolbar = document.createElement("div");
    this.toolbar.className = "medium-editor-toolbar";
    this.toolbar.setAttribute("data-static-toolbar", this.options.static ? "true" : "false");
    if (this.options.static) {
      this.toolbar.style.position = "static";
      this.toolbar.style.display = "block";
      this.toolbar.style.visibility = "visible";
    } else {
      this.toolbar.style.display = "none";
      this.toolbar.style.visibility = "hidden";
      this.toolbar.style.position = "absolute";
      this.toolbar.style.zIndex = "1000";
    }
    this.createButtons();
    this.container.appendChild(this.toolbar);
  }
  createButtons() {
    if (!this.options.buttons || !this.toolbar) {
      return;
    }
    this.options.buttons.forEach((buttonConfig, index) => {
      if (!buttonConfig) {
        return;
      }
      const buttonName = typeof buttonConfig === "string" ? buttonConfig : buttonConfig.name;
      const button = this.createButton(buttonName);
      if (button) {
        if (index === 0 && this.options.firstButtonClass) {
          button.classList.add(this.options.firstButtonClass);
        }
        if (index === this.options.buttons.length - 1 && this.options.lastButtonClass) {
          button.classList.add(this.options.lastButtonClass);
        }
        this.toolbar.appendChild(button);
        this.buttons.push(button);
      }
    });
  }
  createButton(name) {
    const button = document.createElement("button");
    button.className = `medium-editor-action medium-editor-action-${name}`;
    button.setAttribute("data-action", name);
    switch (name) {
      case "bold":
        button.innerHTML = "<b>B</b>";
        button.title = "Bold";
        break;
      case "italic":
        button.innerHTML = "<i>I</i>";
        button.title = "Italic";
        break;
      case "underline":
        button.innerHTML = "<u>U</u>";
        button.title = "Underline";
        break;
      case "anchor":
        button.innerHTML = "\uD83D\uDD17";
        button.title = "Link";
        break;
      case "h2":
        button.innerHTML = "H2";
        button.title = "Heading 2";
        break;
      case "h3":
        button.innerHTML = "H3";
        button.title = "Heading 3";
        break;
      case "quote":
        button.innerHTML = '""';
        button.title = "Quote";
        break;
      default:
        return null;
    }
    return button;
  }
  attachEventListeners() {
    if (!this.toolbar) {
      return;
    }
    this.toolbar.addEventListener("click", (event) => {
      const target = event.target;
      if (!target)
        return;
      const action = target.getAttribute("data-action");
      if (action) {
        this.handleButtonClick(action, event);
      }
    });
  }
  handleButtonClick(action, event) {
    event.preventDefault();
    if (this.editor && typeof this.editor.execAction === "function") {
      this.editor.execAction(action);
    } else {
      if (typeof document.execCommand !== "function") {
        this.applyFormattingFallback(action);
      } else {
        switch (action) {
          case "bold":
            document.execCommand("bold", false);
            break;
          case "italic":
            document.execCommand("italic", false);
            break;
          case "underline":
            document.execCommand("underline", false);
            break;
          case "h2":
            document.execCommand("formatBlock", false, "h2");
            break;
          case "h3":
            document.execCommand("formatBlock", false, "h3");
            break;
          case "quote":
            document.execCommand("formatBlock", false, "blockquote");
            break;
          case "anchor":
            this.createLink();
            break;
        }
      }
    }
    setTimeout(() => {
      if (this.editor && typeof this.editor.checkSelection === "function") {
        this.editor.checkSelection();
      } else {
        this.updateButtonStates();
      }
    }, 0);
  }
  applyFormattingFallback(action) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) {
      return;
    }
    if (this.editor && this.editor.elements && this.editor.elements.length > 0) {
      const editorElement = this.editor.elements[0];
      const content = editorElement.innerHTML;
      switch (action) {
        case "bold":
          if (content === `<strong>${selectedText}</strong>`) {
            editorElement.innerHTML = selectedText;
            return;
          }
          if (content === `<b>${selectedText}</b>`) {
            editorElement.innerHTML = selectedText;
            return;
          }
          break;
        case "italic":
          if (content === `<em>${selectedText}</em>`) {
            editorElement.innerHTML = selectedText;
            return;
          }
          if (content === `<i>${selectedText}</i>`) {
            editorElement.innerHTML = selectedText;
            return;
          }
          break;
        case "underline":
          if (content === `<u>${selectedText}</u>`) {
            editorElement.innerHTML = selectedText;
            return;
          }
          break;
      }
    }
    let wrappedContent = "";
    switch (action) {
      case "bold":
        wrappedContent = `<strong>${selectedText}</strong>`;
        break;
      case "italic":
        wrappedContent = `<em>${selectedText}</em>`;
        break;
      case "underline":
        wrappedContent = `<u>${selectedText}</u>`;
        break;
      case "h2":
        wrappedContent = `<h2>${selectedText}</h2>`;
        break;
      case "h3":
        wrappedContent = `<h3>${selectedText}</h3>`;
        break;
      case "quote":
        wrappedContent = `<blockquote>${selectedText}</blockquote>`;
        break;
      default:
        return;
    }
    try {
      range.deleteContents();
      const fragment = document.createRange().createContextualFragment(wrappedContent);
      range.insertNode(fragment);
      if (fragment.firstChild) {
        const newRange = document.createRange();
        newRange.selectNodeContents(fragment.firstChild);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } catch {
      const container = range.commonAncestorContainer;
      if (container.nodeType === Node.TEXT_NODE && container.parentElement) {
        const parent = container.parentElement;
        parent.innerHTML = parent.innerHTML.replace(selectedText, wrappedContent);
        try {
          const newRange = document.createRange();
          newRange.selectNodeContents(parent);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch {}
      }
    }
  }
  createLink() {
    const url = window.prompt("Enter URL:");
    if (url) {
      document.execCommand("createLink", false, url);
    }
  }
  showToolbar() {
    if (this.toolbar) {
      this.toolbar.style.display = "block";
      this.toolbar.style.visibility = "visible";
      this.toolbar.classList.add("medium-editor-toolbar-active");
      if (this.options.static && this.toolbar.style.position !== "static") {
        this.toolbar.style.position = "static";
      }
      if (this.editor && typeof this.editor.trigger === "function") {
        const selection = window.getSelection();
        let element = null;
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          element = range.commonAncestorContainer;
          if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentElement;
          }
          while (element && this.editor.elements && !this.editor.elements.includes(element)) {
            element = element.parentElement;
          }
        }
        this.editor.trigger("showToolbar", {}, element);
      }
    }
  }
  hideToolbar() {
    if (this.toolbar) {
      if (this.options.static) {
        return;
      }
      this.toolbar.style.display = "none";
      this.toolbar.style.visibility = "hidden";
      this.toolbar.classList.remove("medium-editor-toolbar-active");
      if (this.editor && typeof this.editor.trigger === "function") {
        let element = null;
        if (this.editor.elements && this.editor.elements.length > 0) {
          element = this.editor.elements[0];
        }
        this.editor.trigger("hideToolbar", {}, element);
      }
    }
  }
  getInteractionElements() {
    return this.toolbar ? [this.toolbar] : [];
  }
  getToolbarElement() {
    return this.toolbar || null;
  }
  checkState() {
    if (this.editor && this.editor.preventSelectionUpdates) {
      return;
    }
    if (this.options.static && this.toolbar && this.toolbar.style.position !== "static") {
      this.toolbar.style.position = "static";
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().trim() === "") {
      if (!this.options.static) {
        this.hideToolbar();
      }
      return;
    }
    this.updateButtonStates();
    this.positionToolbar();
  }
  positionToolbar() {
    if (!this.toolbar) {
      return;
    }
    if (this.options.static) {
      this.toolbar.style.position = "static";
      return;
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }
    if (!this.options.allowMultiParagraphSelection && this.hasMultiParagraphSelection(selection)) {
      this.hideToolbar();
      return;
    }
    this.showToolbar();
    try {
      const range = selection.getRangeAt(0);
      let rect = range.getBoundingClientRect();
      if (this.options.standardizeSelectionStart) {
        this.standardizeSelection(selection, range);
        rect = selection.getRangeAt(0).getBoundingClientRect();
      }
      if (rect.width === 0 && rect.height === 0) {
        const container = range.commonAncestorContainer;
        if (container.nodeType === Node.ELEMENT_NODE) {
          rect = container.getBoundingClientRect();
        } else if (container.parentElement) {
          rect = container.parentElement.getBoundingClientRect();
        }
        if (rect.width === 0 && rect.height === 0) {
          rect = { top: 50, left: 50, width: 100, height: 20 };
        }
      }
      let containerOffset = { top: 0, left: 0 };
      if (this.options.relativeContainer && this.options.relativeContainer !== document.body) {
        const containerRect = this.options.relativeContainer.getBoundingClientRect();
        containerOffset = { top: containerRect.top, left: containerRect.left };
      }
      const toolbarHeight = this.toolbar.offsetHeight || 40;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || 0;
      let top = Math.max(10, rect.top + scrollTop - toolbarHeight - 10);
      let left;
      switch (this.options.align) {
        case "left":
          left = rect.left + scrollLeft;
          break;
        case "right":
          left = rect.right + scrollLeft - this.toolbar.offsetWidth;
          break;
        case "center":
        default:
          left = rect.left + scrollLeft + rect.width / 2 - this.toolbar.offsetWidth / 2;
          break;
      }
      top += this.options.diffTop || 0;
      left += this.options.diffLeft || 0;
      if (this.options.relativeContainer && this.options.relativeContainer !== document.body) {
        top -= containerOffset.top;
        left -= containerOffset.left;
      }
      left = Math.max(10, Math.min(left, window.innerWidth + scrollLeft - this.toolbar.offsetWidth - 10));
      this.toolbar.style.position = "absolute";
      this.toolbar.style.top = `${top}px`;
      this.toolbar.style.left = `${left}px`;
      this.toolbar.style.zIndex = "1000";
      if (this.editor && typeof this.editor.trigger === "function") {
        const selection2 = window.getSelection();
        let element = null;
        if (selection2 && selection2.rangeCount > 0) {
          const range2 = selection2.getRangeAt(0);
          element = range2.commonAncestorContainer;
          if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentElement;
          }
          while (element && this.editor.elements && !this.editor.elements.includes(element)) {
            element = element.parentElement;
          }
        }
        this.editor.trigger("positionToolbar", {}, element);
      }
    } catch {
      this.toolbar.style.position = "absolute";
      this.toolbar.style.top = "50px";
      this.toolbar.style.left = "50px";
      this.toolbar.style.zIndex = "1000";
    }
  }
  hasMultiParagraphSelection(selection) {
    if (!selection || selection.rangeCount === 0) {
      return false;
    }
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node3) => {
        const element = node3;
        const tagName = element.tagName.toLowerCase();
        return ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "li"].includes(tagName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    let blockCount = 0;
    let node2 = walker.nextNode();
    while (node2) {
      if (range.intersectsNode(node2)) {
        blockCount++;
        if (blockCount > 1) {
          return true;
        }
      }
      node2 = walker.nextNode();
    }
    return false;
  }
  standardizeSelection(selection, range) {
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    if (startContainer.nodeType === Node.TEXT_NODE) {
      const textContent = startContainer.textContent || "";
      let newStartOffset = startOffset;
      while (newStartOffset > 0 && /\S/.test(textContent[newStartOffset - 1])) {
        newStartOffset--;
      }
      if (newStartOffset !== startOffset) {
        const newRange = document.createRange();
        newRange.setStart(startContainer, newStartOffset);
        newRange.setEnd(range.endContainer, range.endOffset);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  }
  updateButtonStates() {
    if (!this.toolbar) {
      return;
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      this.buttons.forEach((button) => {
        const action = button.getAttribute("data-action");
        if (action) {
          const isActive = this.isEditorContentFormatted(action);
          if (isActive) {
            button.classList.add("medium-editor-button-active");
          } else {
            button.classList.remove("medium-editor-button-active");
          }
        }
      });
      return;
    }
    this.buttons.forEach((button) => {
      const action = button.getAttribute("data-action");
      if (action) {
        const isActive = this.isCommandActive(action);
        if (isActive) {
          button.classList.add("medium-editor-button-active");
        } else {
          button.classList.remove("medium-editor-button-active");
        }
      }
    });
  }
  isEditorContentFormatted(action) {
    if (!this.editor || !this.editor.elements || this.editor.elements.length === 0) {
      return false;
    }
    const editorElement = this.editor.elements[0];
    const content = editorElement.innerHTML;
    switch (action) {
      case "bold":
        return content.includes("<strong>") || content.includes("<b>");
      case "italic":
        return content.includes("<em>") || content.includes("<i>");
      case "underline":
        return content.includes("<u>");
      default:
        return false;
    }
  }
  isCommandActive(command) {
    try {
      if (typeof document.queryCommandState !== "function") {
        return this.isCommandActiveBySelection(command);
      }
      switch (command) {
        case "bold":
          return document.queryCommandState("bold");
        case "italic":
          return document.queryCommandState("italic");
        case "underline":
          return document.queryCommandState("underline");
        default:
          return false;
      }
    } catch {
      return this.isCommandActiveBySelection(command);
    }
  }
  isCommandActiveBySelection(command) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return false;
    }
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (selectedText && this.editor && this.editor.elements && this.editor.elements.length > 0) {
      const editorElement = this.editor.elements[0];
      const content = editorElement.innerHTML;
      switch (command) {
        case "bold":
          if (content.includes("<strong>") && content.includes(selectedText) || content.includes("<b>") && content.includes(selectedText)) {
            if (content === `<strong>${selectedText}</strong>` || content === `<b>${selectedText}</b>`) {
              return true;
            }
          }
          break;
        case "italic":
          if (content.includes("<em>") && content.includes(selectedText) || content.includes("<i>") && content.includes(selectedText)) {
            if (content === `<em>${selectedText}</em>` || content === `<i>${selectedText}</i>`) {
              return true;
            }
          }
          break;
        case "underline":
          if (content.includes("<u>") && content.includes(selectedText)) {
            if (content === `<u>${selectedText}</u>`) {
              return true;
            }
          }
          break;
      }
    }
    const nodesToCheck = [
      range.commonAncestorContainer,
      range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentNode : range.startContainer,
      range.endContainer.nodeType === Node.TEXT_NODE ? range.endContainer.parentNode : range.endContainer
    ];
    for (const startNode of nodesToCheck) {
      if (!startNode)
        continue;
      let currentNode = startNode;
      while (currentNode && currentNode !== document.body && currentNode.nodeType === Node.ELEMENT_NODE) {
        const element = currentNode;
        switch (command) {
          case "bold":
            if (element.tagName === "B" || element.tagName === "STRONG" || element.style.fontWeight === "bold" || element.style.fontWeight === "700") {
              return true;
            }
            break;
          case "italic":
            if (element.tagName === "I" || element.tagName === "EM" || element.style.fontStyle === "italic") {
              return true;
            }
            break;
          case "underline":
            if (element.tagName === "U" || element.style.textDecoration === "underline") {
              return true;
            }
            break;
        }
        currentNode = currentNode.parentNode;
      }
    }
    return false;
  }
}

// src/selection.ts
function filterOnlyParentElements(node2) {
  if (util.isBlockContainer(node2)) {
    return NodeFilter.FILTER_ACCEPT;
  } else {
    return NodeFilter.FILTER_SKIP;
  }
}
var selection = {
  findMatchingSelectionParent(testElementFunction, contentWindow) {
    const selection2 = contentWindow.getSelection();
    if (!selection2 || selection2.rangeCount === 0) {
      return false;
    }
    const range = selection2.getRangeAt(0);
    const current = range.commonAncestorContainer;
    return util.traverseUp(current, testElementFunction);
  },
  getSelectionElement(contentWindow) {
    return this.findMatchingSelectionParent((node2) => {
      return util.isMediumEditorElement(node2);
    }, contentWindow);
  },
  exportSelection(root, doc) {
    if (!root) {
      return null;
    }
    let selectionState = null;
    const selection2 = doc.getSelection();
    if (selection2 && selection2.rangeCount > 0) {
      const range = selection2.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(root);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;
      selectionState = {
        start,
        end: start + range.toString().length
      };
      if (this.doesRangeStartWithImages(range, doc)) {
        selectionState.startsWithImage = true;
      }
      const trailingImageCount = this.getTrailingImageCount(root, selectionState, range.endContainer, range.endOffset);
      if (trailingImageCount) {
        selectionState.trailingImageCount = trailingImageCount;
      }
      if (start !== 0) {
        const emptyBlocksIndex = this.getIndexRelativeToAdjacentEmptyBlocks(doc, root, range.startContainer, range.startOffset);
        if (emptyBlocksIndex !== -1) {
          selectionState.emptyBlocksIndex = emptyBlocksIndex;
        }
      }
    }
    return selectionState;
  },
  importSelection(selectionState, root, doc, favorLaterSelectionAnchor = false) {
    if (!selectionState || !root) {
      return;
    }
    const range = doc.createRange();
    range.setStart(root, 0);
    range.collapse(true);
    let node2 = root;
    const nodeStack = [];
    let charIndex = 0;
    let foundStart = false;
    let foundEnd = false;
    let trailingImageCount = 0;
    let stop = false;
    let nextCharIndex;
    let allowRangeToStartAtEndOfNode = false;
    let lastTextNode = null;
    if (favorLaterSelectionAnchor || selectionState.startsWithImage || typeof selectionState.emptyBlocksIndex !== "undefined") {
      allowRangeToStartAtEndOfNode = true;
    }
    while (!stop && node2) {
      if (node2.nodeType > 3) {
        node2 = nodeStack.pop() || null;
        continue;
      }
      if (node2.nodeType === 3 && !foundEnd) {
        const textNode = node2;
        nextCharIndex = charIndex + textNode.length;
        if (!foundStart && selectionState.start >= charIndex && selectionState.start <= nextCharIndex) {
          if (allowRangeToStartAtEndOfNode || selectionState.start < nextCharIndex) {
            range.setStart(node2, selectionState.start - charIndex);
            foundStart = true;
          } else {
            lastTextNode = textNode;
          }
        }
        if (foundStart && selectionState.end >= charIndex && selectionState.end <= nextCharIndex) {
          if (!selectionState.trailingImageCount) {
            range.setEnd(node2, selectionState.end - charIndex);
            stop = true;
          } else {
            foundEnd = true;
          }
        }
        charIndex = nextCharIndex;
      } else {
        if (selectionState.trailingImageCount && foundEnd) {
          if (node2.nodeName.toLowerCase() === "img") {
            trailingImageCount++;
          }
          if (trailingImageCount === selectionState.trailingImageCount) {
            let endIndex = 0;
            while (node2.parentNode.childNodes[endIndex] !== node2) {
              endIndex++;
            }
            range.setEnd(node2.parentNode, endIndex + 1);
            stop = true;
          }
        }
        if (!stop && node2.nodeType === 1) {
          let i = node2.childNodes.length - 1;
          while (i >= 0) {
            nodeStack.push(node2.childNodes[i]);
            i -= 1;
          }
        }
      }
      if (!stop) {
        node2 = nodeStack.pop() || null;
      }
    }
    if (!foundStart && lastTextNode) {
      range.setStart(lastTextNode, lastTextNode.length);
    }
    if (favorLaterSelectionAnchor) {
      this.importSelectionMoveCursorPastAnchor(selectionState, range);
    }
    if (typeof selectionState.emptyBlocksIndex !== "undefined" && selectionState.start === selectionState.end) {
      this.importSelectionMoveCursorPastBlocks(doc, root, selectionState.emptyBlocksIndex, range);
    }
    const selection2 = doc.getSelection();
    if (selection2) {
      selection2.removeAllRanges();
      selection2.addRange(range);
    }
  },
  importSelectionMoveCursorPastAnchor(selectionState, range) {
    const nodeInsideAnchorTagFunction = (node2) => {
      return node2.nodeName.toLowerCase() === "a";
    };
    if (selectionState.start === selectionState.end && range.startContainer.nodeType === 3 && range.startOffset === range.startContainer.nodeValue.length) {
      const nodeInsideAnchorTag = util.traverseUp(range.startContainer, nodeInsideAnchorTagFunction);
      if (nodeInsideAnchorTag) {
        let nextNode = nodeInsideAnchorTag.nextSibling;
        if (nextNode && nextNode.nodeType === 3) {
          range.setStart(nextNode, 0);
          range.setEnd(nextNode, 0);
        } else if (nodeInsideAnchorTag.parentNode) {
          nextNode = nodeInsideAnchorTag.parentNode;
          const nodeIndex = Array.prototype.indexOf.call(nextNode.childNodes, nodeInsideAnchorTag);
          range.setStart(nextNode, nodeIndex + 1);
          range.setEnd(nextNode, nodeIndex + 1);
        }
      }
    }
  },
  importSelectionMoveCursorPastBlocks(doc, root, index, range) {
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, { acceptNode: filterOnlyParentElements });
    let emptyBlockContainer = null;
    let currIndex = 0;
    let node2;
    while (node2 = walker.nextNode()) {
      if (node2.textContent.trim() === "") {
        if (currIndex === index) {
          emptyBlockContainer = node2;
          break;
        }
        currIndex++;
      }
    }
    if (emptyBlockContainer) {
      range.setStart(emptyBlockContainer, 0);
      range.setEnd(emptyBlockContainer, 0);
    }
  },
  getIndexRelativeToAdjacentEmptyBlocks(doc, root, cursorContainer, cursorOffset) {
    if (cursorContainer.textContent && cursorContainer.textContent.length > 0 && cursorOffset > 0) {
      return -1;
    }
    let node2 = cursorContainer;
    if (node2.nodeType !== 3) {
      node2 = cursorContainer.childNodes[cursorOffset];
    }
    if (node2) {
      const isAtBeginning = util.isElementAtBeginningOfBlock(node2);
      if (!isAtBeginning) {
        return -1;
      }
      const previousSibling = util.findPreviousSibling(node2);
      if (!previousSibling) {} else if (previousSibling.nodeValue) {}
    }
    const closestBlock = util.getClosestBlockContainer(cursorContainer);
    const treeWalker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, filterOnlyParentElements);
    let emptyBlocksCount = 0;
    while (treeWalker.nextNode()) {
      const blockIsEmpty = treeWalker.currentNode.textContent === "";
      if (blockIsEmpty || emptyBlocksCount > 0) {
        emptyBlocksCount += 1;
      }
      if (treeWalker.currentNode === closestBlock) {
        return emptyBlocksCount;
      }
      if (!blockIsEmpty) {
        emptyBlocksCount = 0;
      }
    }
    return emptyBlocksCount;
  },
  doesRangeStartWithImages(range, doc) {
    if (range.startContainer.nodeType !== 3) {
      return false;
    }
    const textContent = range.startContainer.textContent;
    if (range.startOffset > 0 && textContent.substring(0, range.startOffset).trim() !== "") {
      return false;
    }
    const walker = doc.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_ALL, {
      acceptNode(node3) {
        if (range.intersectsNode(node3)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    });
    walker.currentNode = range.startContainer;
    let node2;
    while (node2 = walker.previousNode()) {
      if (node2.nodeName.toLowerCase() === "img") {
        return true;
      }
      if (node2.nodeType === 3 && node2.textContent.trim() !== "") {
        return false;
      }
    }
    return false;
  },
  getTrailingImageCount(root, selectionState, endContainer, endOffset) {
    let imageCount = 0;
    if (endContainer.nodeType !== 3) {
      if (endContainer.nodeType === 1) {
        const element = endContainer;
        for (let i = 0;i < endOffset; i++) {
          const child = element.childNodes[i];
          if (child && child.nodeName.toLowerCase() === "img") {
            imageCount++;
          }
        }
        return imageCount;
      }
      return 0;
    }
    const textNode = endContainer;
    const textAfterSelection = textNode.textContent.substring(endOffset);
    if (textAfterSelection.trim() !== "") {
      return 0;
    }
    let node2 = endContainer.nextSibling;
    while (node2) {
      if (node2.nodeName.toLowerCase() === "img") {
        imageCount++;
      } else if (node2.nodeType === 3 && node2.textContent.trim() !== "") {
        break;
      } else if (node2.nodeType === 1 && !node2.querySelector("img")) {
        break;
      }
      node2 = node2.nextSibling;
    }
    return imageCount;
  },
  selectionContainsContent(doc) {
    const selection2 = doc.getSelection();
    if (!selection2 || selection2.isCollapsed) {
      return false;
    }
    const range = selection2.getRangeAt(0);
    if (range.collapsed) {
      return false;
    }
    const contents = range.cloneContents();
    const textContent = contents.textContent || "";
    const hasText = textContent.trim().length > 0;
    const hasImages = contents.querySelector("img") !== null;
    return hasText || hasImages;
  },
  selectionInContentEditableFalse(contentWindow) {
    const selection2 = contentWindow.getSelection();
    if (!selection2 || selection2.rangeCount === 0) {
      return false;
    }
    const range = selection2.getRangeAt(0);
    let node2 = range.commonAncestorContainer;
    while (node2 && node2.nodeType !== 1) {
      node2 = node2.parentNode;
    }
    if (node2) {
      const element = node2;
      return element.contentEditable === "false";
    }
    return false;
  },
  getSelectionHtml(doc) {
    const selection2 = doc.getSelection();
    if (!selection2 || selection2.rangeCount === 0) {
      return "";
    }
    const range = selection2.getRangeAt(0);
    const contents = range.cloneContents();
    const div = doc.createElement("div");
    div.appendChild(contents);
    return div.innerHTML;
  },
  getCaretOffsets(element, range) {
    if (!range) {
      const selection2 = element.ownerDocument.getSelection();
      if (!selection2 || selection2.rangeCount === 0) {
        return { left: 0, right: 0 };
      }
      range = selection2.getRangeAt(0);
    }
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const left = preCaretRange.toString().length;
    const postCaretRange = range.cloneRange();
    postCaretRange.selectNodeContents(element);
    postCaretRange.setStart(range.endContainer, range.endOffset);
    const right = postCaretRange.toString().length;
    return { left, right };
  },
  rangeSelectsSingleNode(range) {
    const startNode = range.startContainer;
    const endNode = range.endContainer;
    return startNode === endNode && range.startOffset + 1 === range.endOffset;
  },
  getSelectedParentElement(range) {
    if (range.startContainer === range.endContainer) {
      let element = range.startContainer;
      if (element.nodeType === 3) {
        element = element.parentElement;
      }
      return element;
    }
    const commonAncestor = range.commonAncestorContainer;
    return commonAncestor.nodeType === 3 ? commonAncestor.parentElement : commonAncestor;
  },
  getSelectedElements(doc) {
    const selection2 = doc.getSelection();
    const selectedElements = [];
    if (!selection2 || selection2.rangeCount === 0) {
      return selectedElements;
    }
    for (let i = 0;i < selection2.rangeCount; i++) {
      const range = selection2.getRangeAt(i);
      const element = this.getSelectedParentElement(range);
      if (!selectedElements.includes(element)) {
        selectedElements.push(element);
      }
    }
    return selectedElements;
  },
  selectNode(node2, doc) {
    const range = doc.createRange();
    range.selectNodeContents(node2);
    this.selectRange(doc, range);
  },
  select(doc, startNode, startOffset, endNode, endOffset) {
    const range = doc.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    this.selectRange(doc, range);
  },
  clearSelection(doc, moveCursorToStart = false) {
    const selection2 = doc.getSelection();
    if (selection2) {
      if (moveCursorToStart && selection2.rangeCount > 0) {
        const range = selection2.getRangeAt(0);
        range.collapse(true);
        selection2.removeAllRanges();
        selection2.addRange(range);
      } else {
        selection2.removeAllRanges();
      }
    }
  },
  moveCursor(doc, node2, offset = 0) {
    this.select(doc, node2, offset, node2, offset);
  },
  getSelectionRange(ownerDocument) {
    const selection2 = ownerDocument.getSelection();
    if (selection2 && selection2.rangeCount > 0) {
      return selection2.getRangeAt(0);
    }
    return null;
  },
  selectRange(ownerDocument, range) {
    const selection2 = ownerDocument.getSelection();
    if (selection2) {
      selection2.removeAllRanges();
      selection2.addRange(range);
    }
  },
  getSelectionStart(ownerDocument) {
    const selection2 = ownerDocument.getSelection();
    if (selection2 && selection2.rangeCount > 0) {
      const range = selection2.getRangeAt(0);
      return range.startContainer;
    }
    return null;
  }
};

// src/core.ts
var editors = [];
var globalId = 0;
var DEFAULT_OPTIONS = {
  activeButtonClass: "medium-editor-button-active",
  buttonLabels: false,
  delay: 0,
  disableReturn: false,
  disableDoubleReturn: false,
  disableExtraSpaces: false,
  disableEditing: false,
  autoLink: false,
  elementsContainer: document.body,
  contentWindow: window,
  ownerDocument: document,
  targetBlank: false,
  extensions: {},
  spellcheck: true,
  toolbar: {
    buttons: ["bold", "italic", "underline", "anchor", "h2", "h3", "quote"]
  },
  placeholder: {
    text: "Type your text",
    hideOnClick: true
  }
};
var version = {
  major: 1,
  minor: 0,
  revision: 0,
  preRelease: "",
  toString() {
    return `${this.major}.${this.minor}.${this.revision}${this.preRelease ? `-${this.preRelease}` : ""}`;
  }
};
function parseVersionString(release) {
  const split = release.split("-");
  const versionParts = split[0].split(".");
  const preRelease = split.length > 1 ? split[1] : "";
  return {
    major: Number.parseInt(versionParts[0], 10),
    minor: Number.parseInt(versionParts[1], 10),
    revision: Number.parseInt(versionParts[2], 10),
    preRelease,
    toString() {
      return [versionParts[0], versionParts[1], versionParts[2]].join(".") + (preRelease ? `-${preRelease}` : "");
    }
  };
}
function handleDisableExtraSpaces(event) {
  const node2 = selection.getSelectionStart(this.options.ownerDocument);
  if (!node2)
    return;
  const textContent = node2.textContent || "";
  const caretOffsets = selection.getCaretOffsets(node2);
  if (textContent[caretOffsets.left - 1] === undefined || textContent[caretOffsets.left - 1].trim() === "" || textContent[caretOffsets.left] !== undefined && textContent[caretOffsets.left].trim() === "") {
    event.preventDefault();
  }
}
function handleDisabledEnterKeydown(event, element) {
  if (this.options.disableReturn || element.getAttribute("data-disable-return")) {
    event.preventDefault();
  } else if (this.options.disableDoubleReturn || element.getAttribute("data-disable-double-return")) {
    const node2 = selection.getSelectionStart(this.options.ownerDocument);
    if (node2 && node2.textContent?.trim() === "" && node2.nodeName.toLowerCase() !== "li") {
      const prev = node2.previousSibling;
      if (!prev || prev.nodeName.toLowerCase() !== "br" && prev.textContent?.trim() === "") {
        event.preventDefault();
      }
    }
  }
}
function handleTabKeydown(event) {
  const node2 = selection.getSelectionStart(this.options.ownerDocument);
  const tag = node2 && node2.nodeName?.toLowerCase();
  if (tag === "pre") {
    event.preventDefault();
    util.insertHTMLCommand(this.options.ownerDocument, "    ");
  }
  if (node2 && util.isListItem(node2)) {
    event.preventDefault();
    if (event.shiftKey) {
      this.options.ownerDocument.execCommand("outdent", false);
    } else {
      this.options.ownerDocument.execCommand("indent", false);
    }
  }
}
function handleAutoLink(element) {
  if (!this.options.autoLink) {
    return;
  }
  const selection2 = this.options.contentWindow.getSelection();
  if (!selection2 || selection2.rangeCount === 0) {
    return;
  }
  const range = selection2.getRangeAt(0);
  const textNode = range.startContainer;
  if (textNode.nodeType !== Node.TEXT_NODE) {
    return;
  }
  const textContent = textNode.textContent || "";
  const caretPosition = range.startOffset;
  console.log("AutoLink check:", {
    textContent: JSON.stringify(textContent),
    caretPosition,
    lastChar: JSON.stringify(textContent[caretPosition - 1])
  });
  const lastChar = textContent[caretPosition - 1];
  const isSpace = lastChar === " " || lastChar === " ";
  const isPeriod = lastChar === ".";
  const shouldTrigger = isSpace || isPeriod;
  console.log("Character check:", {
    lastChar: JSON.stringify(lastChar),
    charCode: lastChar ? lastChar.charCodeAt(0) : "undefined",
    isSpace,
    isPeriod,
    shouldTrigger,
    isRegularSpace: lastChar === " ",
    isNbsp: lastChar === " "
  });
  if (!shouldTrigger) {
    console.log("Not triggering - last char is not a space or period:", JSON.stringify(lastChar));
    return;
  }
  console.log("Trigger character detected (space or period), looking for URLs...");
  const urlRegex = /https?:\/\/[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|info|tech|app|dev|co|uk|ly|me|tv|ai|biz|ca|de|fr|jp|au|br|in|ru|cn|it|es|nl|se|no|dk|fi|be|at|ch|pl|cz|hu|ro|bg|hr|si|sk|lt|lv|ee|is|ie|pt|gr|cy|mt|lu|li|ad|sm|va|mc|gg|je|im|fo|gl|ax|sj|bv|hm|tf|aq|gs|cc|tk|ml|ga|cf)(?:\/\S*)?/g;
  const matches = Array.from(textContent.matchAll(urlRegex));
  console.log("Found matches:", matches.map((m) => ({ url: m[0], start: m.index, end: m.index + m[0].length })));
  for (const match of matches) {
    const url = match[0];
    const startPos = match.index;
    const endPos = startPos + url.length;
    console.log("Checking match:", { url, startPos, endPos, caretPosition, endPos_eq_caretPos_minus_1: endPos === caretPosition - 1 });
    if (endPos === caretPosition - 1) {
      let currentParent = textNode.parentNode;
      while (currentParent && currentParent !== element) {
        if (currentParent.nodeName.toLowerCase() === "a") {
          return;
        }
        currentParent = currentParent.parentNode;
      }
      const beforeText = textContent.substring(0, startPos);
      const afterText = textContent.substring(endPos);
      const beforeNode = beforeText ? this.options.ownerDocument.createTextNode(beforeText) : null;
      const afterNode = afterText ? this.options.ownerDocument.createTextNode(afterText) : null;
      const linkElement = this.options.ownerDocument.createElement("a");
      linkElement.href = url;
      linkElement.textContent = url;
      if (this.options.targetBlank) {
        linkElement.target = "_blank";
        linkElement.rel = "noopener noreferrer";
      }
      const parent = textNode.parentNode;
      if (beforeNode) {
        parent.insertBefore(beforeNode, textNode);
      }
      parent.insertBefore(linkElement, textNode);
      if (afterNode) {
        parent.insertBefore(afterNode, textNode);
      }
      parent.removeChild(textNode);
      const newRange = this.options.ownerDocument.createRange();
      if (afterNode) {
        const offset = isPeriod ? 1 : 0;
        newRange.setStart(afterNode, offset);
      } else {
        newRange.setStartAfter(linkElement);
      }
      newRange.collapse(true);
      selection2.removeAllRanges();
      selection2.addRange(newRange);
      this.checkContentChanged(element);
      return;
    }
  }
}
function createElementsArray(selector, doc, filterEditorElements) {
  let elements = [];
  if (typeof selector === "string") {
    const nodeList = doc.querySelectorAll(selector);
    elements = Array.from(nodeList).filter((node2) => node2.nodeType === Node.ELEMENT_NODE && typeof node2.setAttribute === "function");
  } else if (selector && typeof selector === "object" && "length" in selector) {
    elements = Array.from(selector).filter((node2) => node2 && node2.nodeType === Node.ELEMENT_NODE && typeof node2.setAttribute === "function");
  } else if (selector && typeof selector === "object") {
    if (selector.nodeType === Node.ELEMENT_NODE && typeof selector.setAttribute === "function") {
      elements = [selector];
    }
  }
  if (filterEditorElements) {
    elements = elements.filter((el) => !util.isMediumEditorElement(el));
  }
  return elements;
}
function initElement(element, editorId) {
  element.setAttribute("medium-editor-index", editorId.toString());
  element.setAttribute("contentEditable", "true");
  element.setAttribute("data-medium-editor-element", "true");
  element.classList.add("medium-editor-element");
}

class MediumEditor {
  id;
  elements = [];
  options;
  events;
  selection = selection;
  util = util;
  version = version;
  extensions = {};
  preventSelectionUpdates = false;
  savedSelection;
  originalSelector;
  originalContent = new Map;
  isEditorActive = true;
  constructor(elements, options) {
    this.id = ++globalId;
    this.options = util.defaults(options || {}, DEFAULT_OPTIONS);
    this.events = new Events(this);
    editors.push(this);
    if (elements) {
      this.originalSelector = elements;
      this.init(elements, options);
    }
  }
  init(elements, options) {
    this.options = util.defaults(options || {}, this.options);
    this.originalSelector = elements;
    this.elements = createElementsArray(elements, this.options.ownerDocument);
    if (this.elements.length === 0) {
      return this;
    }
    this.setup();
    return this;
  }
  setup() {
    if (this.elements.length === 0 && this.originalSelector) {
      this.elements = createElementsArray(this.originalSelector, this.options.ownerDocument);
    }
    this.elements.forEach((element, index) => {
      if (!this.originalContent.has(element)) {
        this.originalContent.set(element, element.innerHTML);
      }
      initElement(element, this.id + index);
    });
    this.initExtensions();
    this.attachHandlers();
    return this;
  }
  destroy() {
    const focusedElements = this.elements.filter((el) => el.getAttribute("data-medium-focused") === "true");
    Object.values(this.extensions).forEach((extension) => {
      if (extension && typeof extension.destroy === "function") {
        extension.destroy();
      }
    });
    this.events.destroy();
    this.elements.forEach((element) => {
      element.removeAttribute("medium-editor-index");
      element.removeAttribute("contentEditable");
      element.removeAttribute("data-medium-editor-element");
      element.classList.remove("medium-editor-element");
    });
    focusedElements.forEach((element) => {
      element.setAttribute("data-medium-focused", "false");
    });
    this.elements = [];
    const index = editors.indexOf(this);
    if (index !== -1) {
      editors.splice(index, 1);
    }
  }
  on(target, event, listener, useCapture = false) {
    this.events.attachDOMEvent(target, event, listener, useCapture);
    return this;
  }
  off(target, event, listener, useCapture = false) {
    this.events.detachDOMEvent(target, event, listener, useCapture);
    return this;
  }
  subscribe(event, listener) {
    this.events.attachCustomEvent(event, listener);
    return this;
  }
  unsubscribe(event, listener) {
    this.events.detachCustomEvent(event, listener);
    return this;
  }
  trigger(name, data, editable) {
    this.events.triggerCustomEvent(name, data, editable);
    return this;
  }
  delay(fn) {
    setTimeout(fn, this.options.delay || 0);
  }
  serialize() {
    const result = {};
    this.elements.forEach((element, index) => {
      const key = element.id || `element-${index}`;
      result[key] = element.innerHTML.trim();
    });
    return result;
  }
  getContent(index) {
    if (index !== undefined && this.elements[index]) {
      return this.elements[index].innerHTML.trim();
    }
    if (this.elements.length === 0) {
      return null;
    }
    return this.elements.map((el) => el.innerHTML.trim()).join("");
  }
  setContent(html, index) {
    let target;
    if (index !== undefined && this.elements[index]) {
      target = this.elements[index];
      target.innerHTML = html;
    } else if (this.elements[0]) {
      target = this.elements[0];
      target.innerHTML = html;
    }
    if (target) {
      this.checkContentChanged(target);
    }
  }
  resetContent(element) {
    if (element) {
      const originalContent = this.originalContent.get(element);
      if (originalContent !== undefined) {
        element.innerHTML = originalContent;
      }
    } else {
      this.elements.forEach((el) => {
        const originalContent = this.originalContent.get(el);
        if (originalContent !== undefined) {
          el.innerHTML = originalContent;
        }
      });
    }
  }
  checkContentChanged(editable) {
    const elements = editable ? [editable] : this.elements;
    elements.forEach((element) => {
      this.trigger("editableInput", null, element);
    });
  }
  exportSelection() {
    const selectionElement = this.selection.getSelectionElement(this.options.contentWindow);
    if (!selectionElement) {
      return null;
    }
    const editableElementIndex = this.elements.indexOf(selectionElement);
    let selectionState = null;
    if (editableElementIndex >= 0) {
      selectionState = this.selection.exportSelection(selectionElement, this.options.ownerDocument);
    }
    if (selectionState !== null && editableElementIndex !== 0) {
      selectionState.editableElementIndex = editableElementIndex;
    }
    return selectionState;
  }
  saveSelection() {
    this.savedSelection = this.exportSelection();
  }
  importSelection(selectionState, favorLaterSelectionAnchor = false) {
    if (!selectionState) {
      return;
    }
    const editableElement = this.elements[selectionState.editableElementIndex || 0];
    if (!editableElement) {
      return;
    }
    this.selection.importSelection(selectionState, editableElement, this.options.ownerDocument, favorLaterSelectionAnchor);
  }
  restoreSelection() {
    if (this.savedSelection) {
      this.importSelection(this.savedSelection);
    }
  }
  selectAllContents() {
    const focusedElement = this.getFocusedElement();
    if (focusedElement) {
      this.selection.selectNode(focusedElement, this.options.ownerDocument);
    }
  }
  selectElement(element) {
    this.selection.selectNode(element, this.options.ownerDocument);
    const selElement = this.selection.getSelectionElement(this.options.contentWindow);
    if (selElement) {
      this.events.focusElement(selElement);
    }
  }
  getFocusedElement() {
    return this.elements.find((el) => el.getAttribute("data-medium-focused") === "true") || null;
  }
  getSelectedParentElement(range) {
    const selectionRange = range || this.selection.getSelectionRange(this.options.ownerDocument);
    if (selectionRange) {
      return this.selection.getSelectedParentElement(selectionRange);
    }
    return this.options.ownerDocument.body;
  }
  stopSelectionUpdates() {
    this.preventSelectionUpdates = true;
  }
  startSelectionUpdates() {
    this.preventSelectionUpdates = false;
  }
  checkSelection() {
    const toolbar = this.getExtensionByName("toolbar");
    if (toolbar && typeof toolbar.checkState === "function") {
      toolbar.checkState();
    }
  }
  execAction(action, opts) {
    if (!this.options.ownerDocument || typeof this.options.ownerDocument.execCommand !== "function") {
      const toolbar = this.getExtensionByName("toolbar");
      if (toolbar && typeof toolbar.applyFormattingFallback === "function") {
        toolbar.applyFormattingFallback(action);
        return true;
      }
      return false;
    }
    return this.options.ownerDocument.execCommand(action, false, opts);
  }
  queryCommandState(action) {
    return this.options.ownerDocument.queryCommandState(action);
  }
  getExtensionByName(name) {
    return this.extensions[name];
  }
  addBuiltInExtension(_name, _opts) {
    return this;
  }
  addElements(selector) {
    const newElements = createElementsArray(selector, this.options.ownerDocument, true);
    newElements.forEach((element, index) => {
      initElement(element, this.id + this.elements.length + index);
      this.elements.push(element);
    });
    return this;
  }
  removeElements(selector) {
    const elementsToRemove = createElementsArray(selector, this.options.ownerDocument);
    elementsToRemove.forEach((element) => {
      const index = this.elements.indexOf(element);
      if (index !== -1) {
        this.elements.splice(index, 1);
        element.removeAttribute("medium-editor-index");
        element.removeAttribute("contentEditable");
        element.removeAttribute("data-medium-editor-element");
        element.classList.remove("medium-editor-element");
      }
    });
    return this;
  }
  activate() {
    this.isEditorActive = true;
    this.elements.forEach((element) => {
      element.setAttribute("contentEditable", "true");
      element.removeAttribute("disabled");
    });
    this.trigger("activate");
    return this;
  }
  deactivate() {
    this.isEditorActive = false;
    this.elements.forEach((element) => {
      element.setAttribute("contentEditable", "false");
      element.setAttribute("disabled", "true");
    });
    this.trigger("deactivate");
    return this;
  }
  isActive() {
    return this.isEditorActive;
  }
  createLink(opts) {
    const range = this.selection.getSelectionRange(this.options.ownerDocument);
    if (range) {
      const anchor = this.options.ownerDocument.createElement("a");
      anchor.href = opts.value;
      if (opts.target) {
        anchor.target = opts.target;
      }
      try {
        range.surroundContents(anchor);
      } catch {
        const contents = range.extractContents();
        anchor.appendChild(contents);
        range.insertNode(anchor);
      }
    }
  }
  cleanPaste(text) {
    return text.replace(/[\x00-\x1F\x7F]/g, "");
  }
  pasteHTML(html, options) {
    const tempDiv = this.options.ownerDocument.createElement("div");
    tempDiv.innerHTML = html;
    if (options?.cleanAttrs) {
      util.cleanupAttrs(tempDiv, options.cleanAttrs);
    }
    if (options?.cleanTags) {
      util.cleanupTags(tempDiv, options.cleanTags);
    }
    if (options?.unwrapTags) {
      util.unwrapTags(tempDiv, options.unwrapTags);
    }
    util.insertHTMLCommand(this.options.ownerDocument, tempDiv.innerHTML);
  }
  initExtensions() {
    if (this.options.toolbar) {
      const container = this.options.elementsContainer || document.body;
      const toolbarOptions = {
        buttons: ["bold", "italic", "underline", "anchor", "h2", "h3", "quote"],
        static: false,
        align: "center",
        sticky: false,
        updateOnEmptySelection: false,
        allowMultiParagraphSelection: true,
        standardizeSelectionStart: false,
        relativeContainer: null,
        diffLeft: 0,
        diffTop: 0,
        firstButtonClass: "medium-editor-button-first",
        lastButtonClass: "medium-editor-button-last",
        ...this.options.toolbar
      };
      const toolbar = new Toolbar(toolbarOptions, container, this);
      toolbar.init();
      this.extensions.toolbar = toolbar;
    }
    if (this.options.placeholder) {
      const placeholder = new Placeholder(this, this.options.placeholder);
      placeholder.init();
      this.extensions.placeholder = placeholder;
    }
    Object.keys(this.options.extensions || {}).forEach((name) => {
      const extension = this.options.extensions[name];
      if (extension && typeof extension.init === "function") {
        extension.init();
        this.extensions[name] = extension;
      }
    });
  }
  attachHandlers() {
    this.events.setupListener("focus");
    this.events.setupListener("blur");
    this.events.setupListener("editableKeydown");
    this.events.setupListener("editableKeyup");
    this.events.setupListener("editableInput");
    this.events.setupListener("editableClick");
    this.events.setupListener("editableBlur");
    this.events.setupListener("editablePaste");
    this.events.setupListener("editableDrag");
    this.events.setupListener("editableDrop");
    this.on(this.options.ownerDocument, "mouseup", () => {
      setTimeout(() => {
        this.checkSelection();
      }, 0);
    });
    this.elements.forEach((element) => {
      this.on(element, "keydown", (event) => {
        const keyEvent = event;
        if (util.isKey(keyEvent, util.keyCode.SPACE) && this.options.disableExtraSpaces) {
          handleDisableExtraSpaces.call(this, keyEvent);
        }
        if (util.isKey(keyEvent, util.keyCode.ENTER)) {
          handleDisabledEnterKeydown.call(this, keyEvent, element);
        }
        if (util.isKey(keyEvent, util.keyCode.TAB)) {
          handleTabKeydown.call(this, keyEvent);
        }
      });
      this.on(element, "mouseup", () => {
        setTimeout(() => {
          this.checkSelection();
        }, 10);
      });
      this.on(element, "input", () => {
        if (this.options.autoLink) {
          setTimeout(() => {
            handleAutoLink.call(this, element);
          }, 100);
        }
      });
    });
  }
  static parseVersionString = parseVersionString;
  static version = version;
  static util = util;
  static selection = selection;
}
// demo/ts/button-example.ts
document.addEventListener("DOMContentLoaded", () => {
  import_rangy.default.init();
  const editor = new MediumEditor(".editable", {
    toolbar: {
      buttons: ["bold", "italic", "underline"]
    },
    buttonLabels: "fontawesome"
  });
  setTimeout(() => {
    addHighlighterButton(editor);
  }, 200);
});
function addHighlighterButton(editor) {
  const toolbar = editor.getExtensionByName("toolbar");
  if (!toolbar || !toolbar.toolbar) {
    console.error("Toolbar not found");
    return;
  }
  const button = document.createElement("button");
  button.className = "medium-editor-action medium-editor-action-highlighter";
  button.setAttribute("data-action", "highlighter");
  button.innerHTML = "<b>H</b>";
  button.title = "Highlight";
  const classApplier = import_rangy.default.createClassApplier("highlight", {
    elementTagName: "mark",
    normalize: true
  });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    classApplier.toggleSelection();
    if (editor && editor.checkContentChanged) {
      editor.checkContentChanged();
    }
    updateButtonState(button);
  });
  toolbar.toolbar.appendChild(button);
  toolbar.buttons.push(button);
  document.addEventListener("selectionchange", () => {
    updateButtonState(button);
  });
}
function updateButtonState(button) {
  const selection2 = window.getSelection();
  if (selection2 && selection2.rangeCount > 0) {
    const range = selection2.getRangeAt(0);
    const container = range.commonAncestorContainer;
    let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
    let isHighlighted = false;
    while (element && element !== document.body) {
      if (element.tagName === "MARK" && element.classList.contains("highlight")) {
        isHighlighted = true;
        break;
      }
      element = element.parentElement;
    }
    if (isHighlighted) {
      button.classList.add("medium-editor-button-active");
    } else {
      button.classList.remove("medium-editor-button-active");
    }
  } else {
    button.classList.remove("medium-editor-button-active");
  }
}

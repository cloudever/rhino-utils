/*
 * HashMap-in-ArrayList sorting by fields utilite
 * Uses native java.util.Comparator
 * 
 * @param {java.util.ArrayList} - arrayList 
 * @param {function|string} - condition or callback
 * @param {boolean} - strong comparision of values, use == or ===, default is true
 * @returns {boolean}
 */
 
function hmSort(arrayList, condition, strong) {
    strong = strong || true;
    
    if (!arrayList || (arrayList instanceof java.util.ArrayList) === false) return false;

    var ascending = true;
    var keyMap = [];

    if (typeof condition === "string") {
        keyMap = parseConditionString(condition);
        if (keyMap.length === 0) return false;
    }

    var comparator = function(hashmapA, hashmapB) {
        return compare(hashmapA, hashmapB, keyMap, 0);
    };

    if (typeof condition === "function") {
        comparator = condition;
    }
    
    var IComparator = new Packages.java.util.Comparator({ compare: comparator });
    
    try {
        Packages.java.util.Collections.sort(arrayList, IComparator);
        return true;
    } catch (e) {
        return false;
    }

    // Default compare function, that goes recursive
    function compare(hashmapA, hashmapB, keyMap, i) {
        if (i === keyMap.length) return 0;

        var pair = keyMap[i];

        var a = hashmapA.get(pair.key);
        var b = hashmapB.get(pair.key);
        
        if (strong === true) {
            if (a === b) return compare(hashmapA, hashmapB, keyMap, ++i);
        } else {
            if (a == b) return compare(hashmapA, hashmapB, keyMap, ++i);
        }
        
        if (pair.asc) {
            return a > b ? 1 : -1;
        } else {
            return a < b ? 1 : -1;
        }
    };

    // Condition text parser
    function parseConditionString(condition) {
        var ASC = "asc";
        
        // Beautify string
        condition.replace(/\s\s+/g, " ");
        condition.trim();
        
        // keyMap contains both hasmap key and asc pair
        var keyMap = [];
        var conditionMap = condition.split(",");

        for (var i = 0; i < conditionMap.length; i++) {
            var conditionArr = conditionMap[i].trim().split(" ");

            if (conditionArr.length > 0) {

                var asc = ascending;
                if (conditionArr.length > 1) {
                    asc = (conditionArr[1].toLowerCase() === ASC);
                }

                var map = {
                    key: conditionArr[0],
                    asc: asc
                };

                keyMap.push(map);
            }
        }

        return keyMap;
    }
}

/*
 * This functions are writen for clear js development in the PageFlow 
 * with arrays and objects instead of java collections such as ArrayList and/or HashMap.
 * Implemented only for servers side
 * 
 * @author paivanov
 * 
 * Example:
 * var params = {
 *    primitiveInt: 1337,
 *
 *    arrayList: [{
 *       key: 'value'
 *    }, 'value', 1337],
 *
 *    fromFunction: function() {
 *       return { arrayList: [1337, { key: 'val' }] }
 *    },
 *
 *    predefinedType: {
 *       className: 'java.lang.Integer',
 *       value: 0
 *    }
 * }
 */

/*
 * Converts native JavaSrcipt object into Java ArrayList and/or HashMap set
 * @param {object} object - input JS object
 * @param {boolean} wrapNumbers - wrap Int primitives
 * @returns {mixed}
 */

function objectToJava(object, wrapNumbers) {
    wrapNumbers = (wrapNumbers === true) || false;
    
    var result = null;
    
//    var classNameMap = {
//        'java.math.BigDecimal': java.math.BigDecimal,
//        'java.lang.Integer'   : java.lang.Integer,
//        'java.lang.Long'      : java.lang.Long,
//        'java.util.Date'      : java.lang.Date
//    }
//    
//    function createClassFromString(className, value) {
//        if (classNameMap.hasOwnProperty(className.toLowerCase())) {
//            return new classNameMap[className](value);
//        } else {
//            return null;
//        }
//    }
    
    if (typeof object === 'undefined') {
        return null;
    }
    
    // Auto wrapping of Numbers
    if (wrapNumbers === true && typeof object === 'number') {
        if (object % 1 === 0) {
            if (object < java.lang.Integer.MAX_VALUE) {
                result = new java.lang.Integer(object);
            } else {
                result = new java.lang.Long(object);
            }
        } else if (object % 1 !== 0) {
            result = new java.math.BigDecimal(object);
        }
        
        return result;
    }
    
    if (Array.isArray(object)) {
        result = new java.util.ArrayList();
        for (var i = 0; i < object.length; i++) {
            result.add(objectToJava(object[i], wrapNumbers));
        }
    } else if (typeof object === 'object') {
        if (typeof object.className === 'string') {
            try {
                /*
                 * Proposal
                 * CODE: result = new createClassFromString(object.className, object.value);
                 * The eval function using should be deprecated by the reason of perfomance
                 */
                result = eval("new " + object.className + "(" + object.value + ")");
            } catch (e) {
                result = null;
            }
        } else {
            result = new java.util.HashMap();
            for (var i in object) {
                if (object.hasOwnProperty(i)) {
                    result.put(i, objectToJava(object[i], wrapNumbers));
                }
            }
        }
        
    } else if (typeof object === 'function') {
        var ctx = null;
        result = objectToJava(object.call(ctx));
    }
    
    if (typeof result !== 'undefined') {
        result = object;
    }
    
    return result;
}


/*
 * Converts Java ArrayList and/or HashMap set into native JavaSrcipt object
 * @param {object} object
 * @returns {object|array}
 */
function javaToObject(object) {
    var result = null;
        
    if (object instanceof java.util.ArrayList) {
        result = [];
        for (var i = 0; i < object.size(); i++) {
            result.push(javaToObject(object.get(i)));
        }
    } else if (object instanceof java.util.HashMap) {
        result = {};
        var it = object.entrySet().iterator();
        while (it.hasNext()) {
            var pair = it.next();
            var key = pair.getKey();
            object[key] = javaToObject(pair.getValue());
        }
    } else {
        result = object;
    }
    
    return result;
}

/*
 * Read and transpile input params directly into JavaScript object/array
 * @param {string} key
 * @returns {object|array}
 */
function getInputParamsJS(key) {
    var params = readIn(key);
    return javaToObject(params);
}

/*
 * Converts native JavaScript objects and/or arrays into Java presentation
 * It's possible to transpile an each element of object into single output parameter
 * by passing into the key an object and leave value empty
 * @param {string|object} key
 * @param {mixed} value
 */
function setOutputParamsJS(key, value) {
    if (typeof key === 'object' && typeof value === 'undefined') {
        var params = key;
        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                var param = objectToJava(params[i]);
                writeOut(i, param);
            }
        }
        return true;
    } else {
       var param = objectToJava(value);
       return writeOut(key, param);
    }
}

/*
 * Read a pack of params from single VARIABLE
 * @param {string} key
 * @returns {mixed}
 */
function getInputParamsPacked(key) {
    if (typeof key !== 'string' || !key) {
        key = 'PARAMS';
    }
    return javaToObject(readIn(key));
}

/*
 * Put a pack of params into single VARIABLE
 * @param {string|object} key
 * @param {object} object
 * @returns {unresolved}
 */
function setOutputParamsPacked(key, object) {
    if (typeof object === 'undefined') {
        object = key;
        key = 'PARAMS';
    }
    return writeOut(key, objectToJava(object));
}
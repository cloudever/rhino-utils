/* global java */

/*
 * HashMap-in-ArrayList sorting by fields utilite
 * Uses native java.util.Comparator
 * 
 * @param {java.util.ArrayList} - arrayList 
 * @param {function|string|object} - conditions or own callback
 * @returns {boolean}
 */

function hmSort(arrayList, condition) {

    if (!arrayList || (arrayList instanceof java.util.ArrayList) === false) {
        return false;
    }

    // Default direction
    var ascending = true;

    var keyMap = {};
    var keyNames = [];

    var comparator = null;

    if (typeof condition === "function") {
        comparator = condition;
    }
    else {
        if (typeof condition === "string") {
            keyMap = parseConditionString(condition, ascending);
        }
        else if (typeof condition === "object") {
            keyMap = condition;
        }

        if (keyMap.length === 0) {
            return arrayList;
        }

        keyNames = Object.keys(keyMap).toString().split(',');

    }

    // Default compare function, that goes recursive
    var compare = function compare(am, bm, i) {
        if (i === keyNames.length) {
            return 0;
        }

        var key = keyNames[i];

        var a = am.get(key);
        var b = bm.get(key);

        // If boxed java classes
        if (a instanceof java.lang.Object) {
            if (a.compareTo(b) === 0) {
                return compare(am, bm, ++i);
            }
            return keyMap.key ? a.compareTo(b) : -a.compareTo(b);
        }
        else {
            // Compare using only == by the reason of boxed types
            if (a == b) {
                return compare(am, bm, ++i);
            }
            return keyMap.key ? (a > b ? 1 : -1) : (a < b ? 1 : -1)
        }
    };

    comparator = (typeof condition === "function") ? condition : function(am, bm) {
        return compare(am, bm, 0);
    };

    var ComparatorInstance = new java.util.Comparator({
        compare: comparator
    });

    java.util.Collections.sort(arrayList, ComparatorInstance);
    return arrayList;
}



// Sort only by your own callback
function hmSortFn(arrayList, comparefn) {

    if (!arrayList || (arrayList instanceof java.util.ArrayList) === false) {
        return false;
    }

    var ComparatorInstance = new java.util.Comparator({
        compare: comparefn
    });

    java.util.Collections.sort(arrayList, ComparatorInstance);
}



// Condition text parser
function parseConditionString(condition, ascending) {

    var ASC = "asc";

    // Beautify string
    condition.replace(/\s\s+/g, " ");
    condition.trim();

    // keyMap contains both hasmap key and asc
    var keyMap = {};
    var conditionMap = condition.split(",");

    for (var i = 0; i < conditionMap.length; i++) {
        var conditionArr = conditionMap[i].trim().split(" ");

        if (conditionArr.length > 0) {

            var asc = ascending;
            if (conditionArr.length > 1) {
                asc = (conditionArr[1].toLowerCase() === ASC);
            }

            keyMap[conditionArr[0]] = asc;
        }
    }

    return keyMap;
}

/* global java */

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
    }
    else if (object instanceof java.util.Date) {
        result = new Date();
        result.setTime(object.getTime());
    }
    else if (object instanceof java.util.HashMap) {
        result = {};
        var it = object.entrySet().iterator();
        while (it.hasNext()) {
            var pair = it.next();
            var key = pair.getKey();
            object[key] = javaToObject(pair.getValue());
        }
    }
    else {
        result = object;
    }

    return result;
}

/*
 * This functions are writen for clear js development in the PageFlow 
 * with arrays and objects instead of java collections such as ArrayList and/or HashMap.
 * Implemented only for servers side
 * 
 * Example:
 * var params = {
 *    primitiveInt: 1337,
 *
 *    arrayList: [{
 *       key: "value"
 *    }, "value", 1337],
 *
 *    fromFunction: function() {
 *       return { arrayList: [1337, { key: "val" }] }
 *    },
 *
 *    predefinedType: {
 *       className: "java.lang.Integer",
 *       value: 0
 *    }
 * }
 */

/*
 * Converts native JavaSrcipt object into Java ArrayList and/or HashMap set
 * @param {object} object - input JS object
 * @param {boolean} wrapNumbers - wrap primitives
 * @returns {mixed}
 */

function objectToJava(object, wrapNumbers) {
    wrapNumbers = (wrapNumbers === true) || false;

    var result = null;

    if (typeof object === "undefined" || object === null) {
        return null;
    }

    // Auto wrapping of Numbers
    if (wrapNumbers && typeof object === "number") {
        if (object % 1 === 0) {
            if (object < java.lang.Integer.MAX_VALUE) {
                result = new java.lang.Integer(object);
            }
            else {
                result = new java.lang.Long(object);
            }
        }
        else if (object % 1 !== 0) {
            result = new java.math.BigDecimal(object);
        }

        return result;
    }

    if (Array.isArray(object)) {
        result = new java.util.ArrayList();
        for (var i = 0; i < object.length; i++) {
            result.add(objectToJava(object[i], wrapNumbers));
        }
    }
    else if (object instanceof Date) {
        result = new java.util.Date(object.getTime());
    }
    else if (typeof object === "object") {
        if (object instanceof java.lang.Object) {
            result = object;
        }
        else if (typeof object.className === "string") {
            try {
                result = eval("new " + object.className + "(" + object.value || null + ")");
            }
            catch (e) {
                result = null;
            }
        }
        else {
            result = new java.util.HashMap();
            for (var i in object) {
                if (object.hasOwnProperty(i)) {
                    result.put(i, objectToJava(object[i], wrapNumbers));
                }
            }
        }
    }
    else if (typeof object === "function") {
        var ctx = object;
        result = objectToJava(object.call(ctx), wrapNumbers);
    }

    if (typeof object !== "undefined") {
        result = object;
    }

    return result;
}

/*
 * A function is writen for clear js development over js
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
        result = objectToJava(object(), wrapNumbers);
    }

    if (typeof object !== "undefined") {
        result = object;
    }

    return result;
}

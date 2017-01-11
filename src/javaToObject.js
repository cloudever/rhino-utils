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

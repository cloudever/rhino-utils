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
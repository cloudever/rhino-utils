/* global java */

/*
 * HashMap-in-ArrayList sorting by fields utilite
 * Uses native java.util.Comparator
 * 
 * @param {java.util.ArrayList} - arrayList 
 * @param {function|string} - condition or callback
 * @param {boolean} - strong comparision of values, use == or ===, default is true
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
    } else {
        if (typeof condition === "string") {
            keyMap = parseConditionString(condition, ascending);
        } else if (typeof condition === "object") {
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
        } else {
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

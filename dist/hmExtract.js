/* Function extracts a field from hashmap iterated in arraylist and returns new one.
 *
 * @param {ArrayList} arralist
 * @param {string} fieldname
 * @param {reduce} flag to reduce source arraylist over each iteration
 */
function hmExtract(arrayList, fieldName, reduce) {
    reduce = (reduce === true) || false;
    
    if (!arrayList || (arrayList instanceof java.util.ArrayList) === false) {
        return false;
    }
    
    if (typeof fieldName !== "string") {
        return false;
    }
    
    var retList = new java.util.ArrayList();
    
    var arrayListSize = arrayList.size();
    
    for (var i = 0; i < arrayListSize; i++) {
        var item = reduce ? arrayList.remove(0).get(fieldName) : arrayList.get(i).get(fieldName);
        retList.add(item);
    }
    
    return retList;
}
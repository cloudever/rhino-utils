/* global java */

function hmExtract(arrayList, fieldName, reduce) {
    reduce = (reduce === true) || false;
    
    var retList = new java.util.ArrayList();
    
    if (!arrayList || (arrayList instanceof java.util.ArrayList) === false) {
        return false;
    }
    
    if (typeof fieldName !== "string") {
        return false;
    }
    
    var arrayListSize = arrayList.size();
    
    for (var i = 0; i < arrayListSize; i++) {
        var item = reduce ? arrayList.remove(0).get(fieldName) : arrayList.get(i).get(fieldName);
        retList.add(item);
    }
    
    return retList;
}
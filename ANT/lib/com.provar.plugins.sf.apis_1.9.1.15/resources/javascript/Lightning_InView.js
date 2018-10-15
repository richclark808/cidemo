
    /** Req: Elements are checked inview from scroll position 0
     * first scroll happens before inview to the element position so that element is at bottom
     * so if element is fully inview then scroll position is 0
     * if element is partially inview then scroll position is less than scroll height
     * if element is not present scroll position is equal to or more than scroll height
      */
// Get the element's bounds.
var obj = arguments[0];
var elementRect = obj.getBoundingClientRect();
var elementHeight = elementRect.height;
var topScrollPosition = 0;
console.log(arguments[0]);
if(!elementHeight){
    return "Not";
}
// Process the parents for scroll Position.
var parent = obj.parentNode;
while (parent) {
    if(parent.scrollTop){
        topScrollPosition = parent.scrollTop;
        break;
    }

    parent = parent.parentNode;
}
if(topScrollPosition){
    if(topScrollPosition < elementHeight){
        return "Partially";
    }else{
        return "Not";
    }
}

return "Fully";

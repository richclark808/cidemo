var el = arguments[0];
if(el){
    var scrollTop = el.scrollTop;
    var clientHeight = el.clientHeight;
    var scrollHeight = el.scrollHeight;
    if(scrollTop+clientHeight < scrollHeight){
    	el.scrollTop = scrollHeight;
    	return true;
    } else {
    	return false;
    }
}

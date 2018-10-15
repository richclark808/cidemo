var pageName = arguments[0];
var xpath = arguments[1];

if(!pageName || !xpath) {
	return null;
}

//TODO: check completely based on the namespace prefix and page name
//For now doing it as a similar one to xpath matching
var reqPath = "apex/" + pageName.toLowerCase();

var divs = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
var div = null;
var globalId = null;
while (div = divs.iterateNext()){
	if(!div) {
		break;
	}
    var component = $A.getComponent(div);
    if (!component) {
    	continue;
    }
    var auraPageAdress = component.getAttributeValueProvider().getConcreteComponent().get("v.address");
    if(auraPageAdress) {
    	var queryPos = auraPageAdress.indexOf('?');
		var query = null;
		if (queryPos >= 0) {
			auraPageAdress = auraPageAdress.substring(0, queryPos);
		}
	    if(auraPageAdress.toLowerCase().indexOf(reqPath) > 0) {
        	globalId = component.getGlobalId();
	        break;
	    }
    }
}
return globalId;

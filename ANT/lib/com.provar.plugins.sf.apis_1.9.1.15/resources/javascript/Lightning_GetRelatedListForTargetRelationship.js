var xpathToMatch = arguments[0];
var matchingTarget = arguments[1];
var matchingGlobalId = null;

if("RelatedProcessHistoryList" === matchingTarget) { // Activity History
	matchingTarget = "ProcessSteps";
}

var actionElements = document.evaluate(xpathToMatch, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
var actionEle = actionElements.iterateNext();
while (actionEle) {
	var auraId = actionEle.getAttribute("data-aura-rendered-by");
	var component = auraId ? $A.getComponent(auraId) : null;
	if(component && component.getAttributeValueProvider() && component.getAttributeValueProvider().getConcreteComponent()) {
		var apiName = component.getAttributeValueProvider().getConcreteComponent().get("v.relatedListId")
					|| component.getAttributeValueProvider().getConcreteComponent().get("v.relatedListConfig.relatedListApiName")
					; //winter 18
		
		if (!apiName) {
			apiName = component.getAttributeValueProvider().getConcreteComponent().get("v.headerTitleText");
			apiName = apiName.substring(0, apiName.lastIndexOf(' ('));
		}
		if(apiName && (matchingTarget.toLowerCase() === apiName.toLowerCase())){
			matchingGlobalId = auraId;
			break;
		}
	}
	actionEle = actionElements.iterateNext();
}
return matchingGlobalId;
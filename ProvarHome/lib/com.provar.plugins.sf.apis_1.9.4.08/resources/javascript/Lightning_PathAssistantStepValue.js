var xpathToMatch = arguments[0];
var matchingTarget = arguments[1];
var attributeToMatch = arguments[2];
var matchingGlobalId = null;

var pathStepElements = document.evaluate(xpathToMatch, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
var pathEle = pathStepElements.iterateNext();
while (pathEle) {
	var auraId = pathEle.getAttribute("data-aura-rendered-by");
	var component = auraId ? $A.getComponent(auraId) : null;
	if(component && component.getAttributeValueProvider() && component.getAttributeValueProvider().getConcreteComponent()) {
		var pathStepName;
		if (attributeToMatch === 'title') {
			pathStepName = component.getAttributeValueProvider().getConcreteComponent().get("v.title");
		} else if (attributeToMatch === 'value') {
			pathStepName = component.getAttributeValueProvider().getConcreteComponent().get("v.value");
		} else if (attributeToMatch === 'label') {
			pathStepName = component.getAttributeValueProvider().getConcreteComponent().get("v.label");
		}
	
		if(pathStepName && (matchingTarget.toLowerCase() === pathStepName.toLowerCase())){
			matchingGlobalId = auraId;
			break;
		}
	}
	pathEle = pathStepElements.iterateNext();
}
return matchingGlobalId;
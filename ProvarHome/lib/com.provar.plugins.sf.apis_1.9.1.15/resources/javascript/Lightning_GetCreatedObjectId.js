var xpath = "//div[contains(@class, 'forceToastManager')]//*[contains(@class,'toastContent')]//a[contains(@class, 'forceActionLink')]";
var matchingElements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
var matchingAnchor = null;
var recordId = null;
while (matchingAnchor = matchingElements.iterateNext()){
	if(null == matchingAnchor) {
		break;
	}
    var component = $A.getComponent(matchingAnchor);
    if (!component) {
    	continue;
    }
    var componentAction = component.getAttributeValueProvider().getConcreteComponent().get("v.action");
    if(componentAction) {
        recordId = componentAction.executionComponent.attributes.recordId;    	
    }
}
return recordId;

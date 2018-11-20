var xpathToMatch = arguments[0];
var matchingTarget = arguments[1];
var matchingGlobalId = null;

var actionElements = document.evaluate(xpathToMatch, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
var actionEle = actionElements.iterateNext();
while (actionEle) {
	var auraId = actionEle.getAttribute("data-aura-rendered-by");
	var component = auraId ? $A.getComponent(auraId) : null;
	if(component && component.getAttributeValueProvider() && component.getAttributeValueProvider().getConcreteComponent()) {
		var comp = component.getAttributeValueProvider().getConcreteComponent();
		var actionName = null;
		if(comp.type && "ui:actionMenuItem" === comp.type) {
			actionName = component.getAttributeValueProvider().getConcreteComponent().get("v.id"); //drop down menu item
		}
		else {
			actionName = component.getAttributeValueProvider().getConcreteComponent().get("v.targetValue");			
		}
		if(!actionName){
			actionName = component.getAttributeValueProvider().getConcreteComponent().get("v.id"); //drop down menu item
		}
		if(!actionName && actionEle.tagName === 'BUTTON'){
			actionName = component.getAttributeValueProvider().getConcreteComponent().getAttributeValueProvider().getConcreteComponent().get("v.targetValue");
		}
		if(actionName && (matchingTarget.toLowerCase() === actionName.toLowerCase())){
			matchingGlobalId = auraId;
			break;
		}
	}
	actionEle = actionElements.iterateNext();
}
return matchingGlobalId;
var webElement = arguments[1]
var auraId = webElement.getAttribute("data-aura-rendered-by");
var component = auraId ? $A.getComponent(auraId) : null;

if(component && component.getAttributeValueProvider()) {
	component.getAttributeValueProvider().set('v.value', arguments[0]);
}
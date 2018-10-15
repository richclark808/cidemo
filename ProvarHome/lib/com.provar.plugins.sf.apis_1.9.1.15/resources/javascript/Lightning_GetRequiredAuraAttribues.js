var auraId = arguments[0];
var attributeName = arguments[1];
if(!attributeName) {
	attributeName = "v.recordId";
}
var attributeValue = null;
var component = $A.getComponent(auraId);
if(component && component.getAttributeValueProvider() && component.getAttributeValueProvider().getConcreteComponent()) {
	attributeValue = component.getAttributeValueProvider().getConcreteComponent().get(attributeName);
}
return attributeValue;

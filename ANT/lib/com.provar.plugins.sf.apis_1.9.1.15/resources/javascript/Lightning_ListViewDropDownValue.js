var actionElements = document.evaluate("//div[contains(@class, 'forceVirtualAutocompleteMenuList')]//ul[contains(@class, 'slds-dropdown__list')]",
		document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
var listOptionItems = null;
var listOptionValues = [];
var actionEle = actionElements.iterateNext();
if (actionEle) {
	var auraId = actionEle.getAttribute("data-aura-rendered-by");
	var component = auraId ? $A.getComponent(auraId) : null;
	if(component && component.getAttributeValueProvider() && component.getAttributeValueProvider().getConcreteComponent()) {
		listOptionItems = component.getAttributeValueProvider().getConcreteComponent().get("v.items");
	}
}
if(listOptionItems) {
	var arrayLength = listOptionItems.length;
	for (var i = 1; i < arrayLength; i++) {
		var item = listOptionItems[i];
		listOptionValues.push(item.name);
		
	}
}
return listOptionValues;


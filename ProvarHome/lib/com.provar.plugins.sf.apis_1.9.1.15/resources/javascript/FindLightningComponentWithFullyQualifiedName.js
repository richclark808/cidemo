var fullyQualifiedName = arguments[0];
var contextXpath = arguments[1];
var lightningComponentIndex = arguments[2] ? arguments[2] : 0;
if(!contextXpath) {
	contextXpath = "(//div[contains(@class, 'active') and contains(@class, 'oneContent')]//div[contains(@class, 'flexipagePage')] | //div[contains(@class, 'open') and contains(@class, 'active')])";
}
var flexCompXpath = contextXpath + "//div[contains(@class, 'flexipageComponent') or contains(@class, 'forceChatterLightningComponent')]["+ ++lightningComponentIndex +"]";
var flexipageComponentDivIt = document.evaluate(flexCompXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

var flexipageComponentDiv = null;
while (flexipageComponentDiv = flexipageComponentDivIt.iterateNext()){
    var flexipageComponent = $A.getComponent(flexipageComponentDiv);
    if (!flexipageComponent) {
    	continue;
    }
    var attributeValueProvider = flexipageComponent.getAttributeValueProvider ? flexipageComponent.getAttributeValueProvider() : null;
    if (!attributeValueProvider) {
    	continue;
    }

    var lightningComponentQualifiedName = attributeValueProvider.get("v.lightningComponentQualifiedName");
    
    if (!lightningComponentQualifiedName) {
        var componentInfoDefRef = attributeValueProvider.get("v.componentInfoDefRef");
        var descriptor = componentInfoDefRef[0].componentDef.descriptor
        lightningComponentQualifiedName = descriptor.substring(9);
    }
    
    if (lightningComponentQualifiedName === fullyQualifiedName) {
        return flexipageComponentDiv;
    }
    

    var concreteComponent = attributeValueProvider.getConcreteComponent ? attributeValueProvider.getConcreteComponent() : null;
    if (!concreteComponent) {
    	continue;
    }
    var componentInfo = concreteComponent.get("v.componentInfo");
    if (!componentInfo) {
    	continue;
    }
    if (componentInfo.fullyQualifiedName === fullyQualifiedName) {
        return flexipageComponentDiv;
    }
}

return null;
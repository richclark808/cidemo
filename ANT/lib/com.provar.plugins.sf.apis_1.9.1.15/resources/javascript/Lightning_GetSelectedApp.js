var xpath = "//div[contains(@class, 'oneConsoleLayoutContainer') and not(contains(@class, 'hideEl'))]//nav | //one-appnav";
var matchingElements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
var appNavEle = null;
while (appNavEle = matchingElements.iterateNext()){
	if(null == appNavEle) {
		break;
	}
    var component = $A.getComponent(appNavEle);
    if (!component) {
    	continue;
    }
    if(component.getAttributeValueProvider() && component.getAttributeValueProvider().getConcreteComponent() ) {
    	var comp = component.getAttributeValueProvider().getConcreteComponent();
    	var label = null;
		if(comp.type && "one:appNavContainer" === comp.type) {
			label = comp.get('v.appMetadata.appDefinition.label');
		}
		else {
			label = comp.get('v.appName');		
		}
    	if(!label) {
    		label = comp.get('v.appMetadata.appDefinition.label');
    	}
    	var appProps ={
				label:label ,
		};
    	return appProps;
    }
}
return null;

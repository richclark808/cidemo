
function resolveAuraBy(componentXPath, searchContext, multiple) {
	
	console.log("resolveAuraBy componentXPath: " + componentXPath + ", multiple: " + multiple);
	var lightningCompXpath="//div[@data-ltngout-rendered-by and @id]";
	
	var componentNode=document.evaluate(lightningCompXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(componentNode){
		var vfLightningId=componentNode.getAttribute('data-ltngout-rendered-by');
	}
	var auraInfo = extractAuraInfo(true,null,vfLightningId);
	if (auraInfo.exception) {
		return auraInfo.exception;
	}
	
	var nsResolver = function(prefix) {
		var ns = {
		    'xhtml' : 'http://www.w3.org/1999/xhtml',
		    'mathml': 'http://www.w3.org/1998/Math/MathML'
		  };
  		return ns[prefix] || prefix;
	};
	
	var searchBaseXpath="//auradom";
	var searchXpath=searchBaseXpath + componentXPath;
	var rowXpath =null;
	if(searchContext){

		var rowNode=searchContext;

		var auraRowId=rowNode.getAttribute('data-aura-rendered-by');
		
		var auraRowInfo=auraInfo.components[auraRowId];
		if (auraRowInfo.apId) {
			auraRowInfo=auraInfo.components[auraRowInfo.apId];
		}
		var auraRowParent=auraInfo.components[auraRowInfo.pId];
		//in aura iteration indexVar attribute is a mandatory field to indicate the row indexOf
		var indexVar=auraRowParent.indexVar
		if(auraRowParent.indexVar){
			var indexVar=auraRowParent.indexVar
			rowXpath="//auradom//*[name() = 'aura:html'][@*[name()='elemTagName'] = 'TABLE']//*[@*[name()='elemTagName'] = 'TR'][@*[name()='"+indexVar+"'] = '"+auraRowInfo[indexVar]+"']";
			var rowXpathCount = document.querySelectorAll("auradom *[elemTagName='TABLE'] *[elemTagName='TR']["+indexVar+"='"+auraRowInfo._index+"']")
			if (rowXpathCount.length > 1) {
	  			rowXpath="//auradom//*[name() = 'aura:html'][@*[name()='elemTagName'] = 'TABLE']//*[@*[name()='elemTagName'] = 'TR'][@*[name()='"+indexVar+"'] = '"+auraRowInfo[indexVar]+"'][@*[name()='elemRbId'] ='"+auraRowInfo.elemRbId+"']";
			}		
		}
	}
	
	if(rowXpath){
		searchBaseXpath=rowXpath;
		searchXpath="."+componentXPath;
	}
	
	
	
	
	var searchDom = document.evaluate(searchBaseXpath, window.document, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
	
	var resultIt = document.evaluate(searchXpath, searchDom.singleNodeValue ? searchDom.singleNodeValue : window.document , nsResolver, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	
	
	var resultElem = resultIt.iterateNext();
	var results = [];
	if (resultElem && searchXpath.indexOf('aura:iteration') >= 0) {
		for(var i = 0; i < resultElem.children.length; i++) {
			 var auraComponent = $A.getComponent(resultElem.children[i].getAttribute("id"));
			 var htmlElem = auraComponent.getElement();
			 results.push(htmlElem);
		}
		return results;
	}
	
	while (resultElem) {
		console.log("resolveAuraBy Match: ", resultElem);
		var auraComponent = $A.getComponent(resultElem.getAttribute("id"));
		if (!auraComponent) {
			continue;
		}
		
		var htmlElem = auraComponent.getElement();
		if (!htmlElem) {
			continue;
		}
		
		if ((auraComponent.type === 'ui:inputText' || auraComponent.type === 'lightning:input'
			|| auraComponent.type === 'ui:inputNumber' || auraComponent.type === 'ui:inputDate' 
				|| auraComponent.type === 'ui:autocomplete') && htmlElem.tagName !== 'INPUT') {
			if (resultElem.hasChildNodes()) {
				htmlElem = getFirstInputElement(resultElem);
			}
			if (auraComponent.type === 'lightning:input' && htmlElem.tagName !== 'INPUT') {
				htmlElem = getFirstHtmlInputElement(htmlElem);
			}
		}
		
		if (auraComponent.type === 'lightning:buttonMenu' && htmlElem.tagName !== 'BUTTON') {
			if (resultElem.hasChildNodes()) {
				htmlElem = getFirstButtonElement(resultElem);
			}
		}
		
		if (auraComponent.type === 'aura:expression') {
			 auraComponent = $A.getComponent(resultElem.parentElement.getAttribute("id"));
		     htmlElem = auraComponent.getElement();
		}
		
		if (auraComponent.type === 'lightning:select' && htmlElem.tagName !== 'SELECT') {
			if (resultElem.hasChildNodes()) {
				htmlElem = getFirstSelectElement(resultElem);
			}
		}
		
		if (auraComponent.type === 'lightning:menuItem' && htmlElem.tagName !== 'A') {
			if (resultElem.hasChildNodes()) {
				htmlElem = getFirstAnchorElement(resultElem);
			}
		}
		
		if (!htmlElem) {
			continue;
		}
		
		if (!multiple) {
			return htmlElem;
		}
		results.push(htmlElem);
		
		resultElem = resultIt.iterateNext();
	}
    
	return results;
}

function getFirstHtmlInputElement(htmlElem) { 
	
	var elem = htmlElem.querySelector("input[lightning-input_input].slds-input");
	return elem;
}

function getFirstInputElement(resultElem) { 
	
	var elem = resultElem.querySelector("[elemTagName='INPUT']");
	var htmlElem = $A.getComponent(elem.getAttribute("id")).getElement();
	
	if (htmlElem.tagName === 'INPUT') {
		return htmlElem;
	} 
	else if (elem.getAttribute("elemRbId")){
		return $A.getComponent(elem.getAttribute("elemRbId")).getElement();
	}
}

function getFirstButtonElement(resultElem) { 
	
	var elem = resultElem.querySelector("[elemTagName='BUTTON']");
	return  $A.getComponent(elem.getAttribute("id")).getElement();
}

function getFirstSelectElement(resultElem) { 
	
	var elem = resultElem.querySelector("[elemTagName='SELECT']");
	return  $A.getComponent(elem.getAttribute("id")).getElement();
}

function getFirstAnchorElement(resultElem) { 
	
	var elem = resultElem.querySelector("[elemTagName='A']");
	return  $A.getComponent(elem.getAttribute("id")).getElement();
}

function extractAuraInfo(asXml, xpath,vfLightningId) {
   if(typeof $A === 'undefined'){
       return null;
   }
   var timings = {};
   var startUtc = new Date().getTime();

   var debugMode = $A.$clientService$ !== undefined;
   var saveAllowAccess; 
   if (debugMode) {
     // We're in Debug mode:
     // - replace the allowAccess method with one that always returns true.
     var saveAllowAccess = $A.$clientService$.$allowAccess$;
     $A.$clientService$.$allowAccess$ = function() {
       return true;  
     };
   }
   else {
       // We're in Prod mode:
       // - we can't replace the allowAccess function because of closures
       // - disable access checking and logging to speed up "non-work around" accesses 
       // - we use a special logic in appendAttributeInfo() to speed things up further
       //$A.getContext().Oa = false;  // $A.getContext().$enableAccessChecks$ = false;
       //$A.getContext().Wk = false; // $A.getContext().$logAccessFailures$ = false;
   }

   var parentIdVariable=retriveParentIdVariable(debugMode);
   var auraDom, auraElem, expressionsElem, valueProvidersElem;
   if (asXml) {
       auraDom = document.createDocumentFragment();
       auraElem = document.createElement("auraDom");
       auraElem.setAttribute("style", "display: none");
   //         auraElem.setAttribute("xmlns:force", "http://forcedotcom");
       auraDom.appendChild(auraElem);
       expressionsElem = document.createElement("expressions");
       auraElem.appendChild(expressionsElem);
       valueProvidersElem = document.createElement("valueProviders");
       auraElem.appendChild(valueProvidersElem);

       var auraElement=document.getElementsByTagName("auradom");
       
       if(auraElement[0]){
           auraElement[0].parentNode.removeChild(auraElement[0]);
       }
       document.documentElement.appendChild(auraDom);
   }
   var valueProviderValuesProperty = discoverValueProviderValuesProperty();
   var result = {
       rootComponentId: null,
       components: {},
       auraDom: auraElem
   };

   var root=null;
   // NOTE: it is important that the processing below does not throw uncaught exceptions:
   //     - otherwise the caller will never get their callback and the getDomInfo process will stall.
   
   try {
       
       //root=$A.getRoot();
       //$A.getCallback(function() {
           //if (root.isValid()) {
               //root.set("v.visible", true);
               var rootComponent=null;
               if(vfLightningId && vfLightningId !== 'null'){
                   rootComponent=$A.getComponent(vfLightningId);
               }else{
                   rootComponent=$A.getRoot();
               }
               var rootComponent = getComponentInfo(rootComponent, result.components, auraElem, expressionsElem, valueProvidersElem);
               result.rootComponentId = rootComponent.id;
               delete rootComponent.id;
           //}
       //});    
   }
   catch (e) {
       result.exception = e.toString();
   }

   // Reinstate the original allowAccess function if we replaced it.
   if (saveAllowAccess) {
       $A.$clientService$.$allowAccess$ = saveAllowAccess;
   }


   timings["total"] = new Date().getTime() - startUtc;
   console.log("Timings: ", timings);
   
   if (xpath) {
       var nsResolver = function(prefix) {
           return prefix;
       };
       
       var labelsIt = document.evaluate(xpath, auraElem, nsResolver, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
       var labelElem = labelsIt.iterateNext();
       while (labelElem) {
           console.log("Match: ", labelElem);
           labelElem = labelsIt.iterateNext();
       }
   }
   
   return result;
   //   return JSON.stringify(result);

      // Discover the name of the property on the ValueProvider that contains the name/value map:
   // - we know that the Root element has a 'Browser_S1Features_isEncryptedStorageEnabled' property
   // - so we search the ValueProvider for the parent property that contains this.
   function discoverValueProviderValuesProperty() {
       
       var rootValueProvider = $A.getRoot instanceof Function && $A.getRoot() ? $A.getRoot().get('v') : null;
      
       if(rootValueProvider){
            for (valueProviderProperty in rootValueProvider) {
               var valueProviderPropertyValue = rootValueProvider[valueProviderProperty];
               var attr=null;
               if(vfLightningId){
                   attr="body";
               }else{
                   attr="Browser_S1Features_isEncryptedStorageEnabled";
               }
               if (valueProviderPropertyValue[attr]) {
                   return valueProviderProperty;
               }
           }
       }
      


        return null;
    }

    function isPopulated(value) {
        if (!value) {
            return false;
        }

        if (value instanceof Array) {
            for (var i = 0; i < value.length; i++) {
                if (value[i]) {
                    return true;
                }
            }
            return false;
        }

        return true;
    }

    function appendAttributeInfo(auraInfo, auraElem, component, attributeName, asChildren, resultMap, expressionsElem, valueProvidersElem) {

        var componentValue = getAttributeValue(component, attributeName);
        
        if (componentValue) {
        	if (asChildren) {
        		if (componentValue instanceof Array) {
        			attrElem = document.createElement(attributeName);
        			auraInfo.appendChild(attrElem);
        			for (var i = 0, iLen = componentValue.length; i < iLen; i++) {
        				var child = componentValue[i];
        				getComponentInfo(child, resultMap, attrElem, expressionsElem, valueProvidersElem);
        			}
        		}
        	}else if(attributeName === 'referenceElement'){
                //this 'id' refers to related list quicklink in flexipage layout
                var id=componentValue.getAttribute('id');
                if(id){
                    setAuraInfoAttribute(auraInfo, auraElem, 'referenceElementId', id);
                }
            }
        	else {
        		setAuraInfoAttribute(auraInfo, auraElem, attributeName, componentValue);
        		 //fetching the name of the list items 
                if(attributeName === 'items' && auraInfo.descr === 'aura:iteration'){
                     var componentAttrValue=getRawAttributeValue(component,attributeName);
                      if(componentAttrValue.getExpression instanceof Function){
                          
                          setAuraInfoAttribute(auraInfo, auraElem, "iterationListName", componentAttrValue.getExpression());
                          
                      }
                      
                  }
        	}
        }
    }

    

      function getAttributeValue(component, attributeName) {

        try {
            var componentValue;
            var componentValueFetched = false;
            var attributeSupported = true;
            if (!debugMode && valueProviderValuesProperty) {
            	
            	// The component.get('v.attributeName') is taking a long time since Spring 17 due to internal access checks.
            	// As a work around, this processing recreates the processing the the .get() function.  
            	// You can see the implementation in the Aura code by:
            	// - Enabling Lightning debug mode (Settings/Lightning Components/Enable Debug Mode)
            	// - Executing this from the Dev Tools command prompt: $A.getRoot().get('v').get
            	
            	var valueProvider = null;
            	try {
            		valueProvider = component.get('v');
            	}
            	catch (e) {
            		attributeSupported = false;
            	}
            	componentValue = valueProvider ? valueProvider[valueProviderValuesProperty][attributeName] : null;
                componentValueFetched = !isExpressionValue(componentValue);

                /*if (isExpressionValue(componentValue) != aura.util.J(componentValue)){
              	  console.log("False positive for isExpressionValue.  attributeName: " + attributeName + ", componentValue: " + componentValue);
                }
                if (valueProvider && valueProvider.qg && valueProvider.qg[attributeName]) {
                	  console.log("Component value has decorator.  attributeName: " + attributeName + ", componentValue: " + componentValue);
                }*/
                
                // NOTE: we have removed the $decorators$ check because:
                // - it introduces an internal value dependency.
                // - and we can't find values with them
                //if (valueProvider && valueProvider.get && !valueProvider.qg[attributeName]) { // pg=$decorators$
                //	componentValue = valueProvider.n[attributeName]; // n=$values$
                //	componentValueFetched = !aura.util.J(componentValue); // J=isExpression()
                //}
                
                // NOTE: We don't do any Shadow value processing:
      		    // if(this.$shadowValues$.hasOwnProperty(key)) {
      		    //   value += this.$getShadowValue$(key)
      		    // }
                
            }
            if (attributeSupported && !componentValueFetched) {
              componentValue = component.get('v.' + attributeName);
            }            
        }
        catch (ex) {
        	componentValue = "ERROR: " + ex.message;
            componentValue = ex.message;
        }


       return componentValue;
   }

   function setAuraInfoAttribute (auraInfo, auraElem, attrName, attrValue) {

	   if(typeof attrValue === 'undefined'){
           return;
       }
	   if(attrName === 'items'){
           return;         
         }
       if(!(attrValue instanceof Function)){
           //if(typeof attrValue !== 'object'){
    	   if(!$A.util.isComponent(attrValue) && !$A.util.isAction(attrValue)){
               auraInfo[attrName] = attrValue;
               if (auraElem) {
                   if(attrName.indexOf(':') > 0){
                       var colonPos = attrName.indexOf(':');
                       var ns = colonPos > 0 ? attrName.substring(0, colonPos) : null;
                       auraElem.setAttributeNS(ns, attrName, attrValue);
                   }else{
                       auraElem.setAttribute(attrName, attrValue);
                   }
                   
               } 
           }
          
       }
       
   }
   
   function isExpressionValue(componentValue) {
       return componentValue && componentValue.evaluate instanceof Function ? true : false;
   }

   function getComponentInfo(component, resultMap, parentAuraDomElem, expressionsElem, valueProvidersElem, globalId) {

       // NOTE: we need to keep the field names as short as possible in the resulting auraInfo to
       //       reduce JSON stringify and decode overhead.
       
       if (!component || !(component.getGlobalId instanceof Function)) {
           return null;
       }
       
       var globalId = globalId ? globalId : component.getGlobalId();
       
       if(component.isConcrete() === false){
           var ccId=component.getConcreteComponent().getGlobalId();
           var ccInfo=resultMap[ccId];
           if(typeof ccInfo !== 'undefined'){
               resultMap[globalId] = ccInfo;
               return null;
           }
       }
       
       var auraInfo = resultMap[globalId];
       if (auraInfo) {
           if(!auraInfo.id){
               auraInfo.id=globalId;
           }
           return auraInfo;
       }

       var descr;
       var componentDef = component.getDef();
       if (componentDef) {
           var componentDescr = componentDef.getDescriptor();
           if (componentDescr) {
               descr = componentDescr.toString();
               if (descr.indexOf("markup://") === 0) {
                   descr = descr.substring(9);
               }
               if(descr.indexOf('layout:') >= 0){
                   descr="layoutRL";
               }
           }
       }

       var auraInfo = {
               id: globalId,
               descr: descr,
           };
       resultMap[globalId] = auraInfo;
       var auraElem;
       if (parentAuraDomElem) {
           var colonPos = descr.indexOf(':');
           var ns = colonPos > 0 ? descr.substring(0, colonPos) : null;
           auraElem = document.createElementNS(ns, descr);
           auraElem.setAttribute("id", globalId);
           parentAuraDomElem.appendChild(auraElem);
           //auraElem: auraElem
       }

       if (component.getElement instanceof Function) {
           var elem = component.getElement();
           if (elem) {
               setAuraInfoAttribute(auraInfo, auraElem, "elemTagName", elem.tagName);
               if (elem.getAttribute instanceof Function) {
                   setAuraInfoAttribute(auraInfo, auraElem, "elemRbId", elem.getAttribute("data-aura-rendered-by"));
               }
           }
       }
       var auraId=component.getLocalId();
       if(auraId){
           setAuraInfoAttribute(auraInfo, auraElem, "aura:id", auraId);
       }
       /*var press=component.getEvent('press');
       if(press && component.Xe.Ud.press.bubble){
           setAuraInfoAttribute(auraInfo, auraElem, "press", component.Xe.Ud.press.bubble[0].actionExpression);
       }*/

       //getEventDispatcher() is not applicable to interopClass in summer 17
       if(component.getEventDispatcher instanceof Function && typeof component.interopClass === 'undefined'){
            var events=component.getEventDispatcher();
            if (events){
               var pressEvent=events['press'];
            }
           if(pressEvent){
               
               if(pressEvent.bubble && Array.isArray(pressEvent.bubble)){
                   
                   var press=pressEvent.bubble;
                   for(var i=0;i<press.length;i++){
                       if(press[i].hasOwnProperty("actionExpression")){
                           if(typeof press[i].actionExpression === 'object'){
                               setAuraInfoAttribute(auraInfo, auraElem, "press", press[i].actionExpression.path);
                           }else{
                               setAuraInfoAttribute(auraInfo, auraElem, "press", press[i].actionExpression);
                           }
                           
                           break;
                       }
                   }
               }
           }
       }
       
       if(component.attributes && component.attributes.value && component.attributes.value.getExpression instanceof Function){
           setAuraInfoAttribute(auraInfo, auraElem, "value", "{!" + component.attributes.value.getExpression() +"}");
       }
     
       // Get the component's value, catering for arrays and nested components.
       var componentValue = getRawAttributeValue(component, "value");
       if (componentValue && componentValue.getExpression instanceof Function) {
           setAuraInfoAttribute(auraInfo, auraElem, "value", "{!" + componentValue.getExpression() + "}");
       }
       else {
           var componentValue = getAttributeValue(component, "value");
           if (componentValue  instanceof Array) {
               for (var i = 0, iLen = componentValue.length; i < iLen; i++) {
                   var childValue = componentValue[i];
                   if ($A.util.isComponent(childValue)) {
                       getComponentInfo(childValue, resultMap, auraElem, expressionsElem, valueProvidersElem);

                       var parentId = childValue[parentIdVariable];
                       if (parentId !== globalId) {
                           var parentAuraInfo = resultMap[parentId];
                           if (parentAuraInfo) {
                               getComponentInfo(childValue, resultMap, parentAuraDomElem ? parentAuraInfo.auraElem : null, expressionsElem, valueProvidersElem);
                           }
                       }
                   }
               }
           }
           else if ($A.util.isComponent(componentValue)) {
               getComponentInfo(componentValue, resultMap, auraElem, expressionsElem, valueProvidersElem);
           }
           else if (isPopulated(componentValue)) {
               setAuraInfoAttribute(auraInfo, auraElem, "value", componentValue);
           }
       }

       // Extract the component's attribute values:
       // NOTE: Looping through them all is quicker than checking for individual attribute names.
       /*var attMap = component.eb && component.eb.n ? component.eb && component.eb.n
           : component.ab.n;*/
       var attributeSet=null;
       try{
           attributeSet=component.get('v');
       } catch(e){}//some components are not supposed to have the attributes; In that cases aura throws exception
       
       var attMap = attributeSet && valueProviderValuesProperty ? attributeSet[valueProviderValuesProperty] : null;
       if (attMap) {
           for (var attName in attMap) {
        	 //referenceElement is node element, but this is required in scenario where hovel panel appears
               //this property has the id to the element it hovers
               if(attName === 'referenceElement'){
                   appendAttributeInfo(auraInfo, auraElem, component, attName);
               }
               if ("HTMLAttributes" === attName
                       //|| attMap[attName] instanceof Array
                       || checkComponentInfo(attMap,attName) //need component info for flexipage mapping in winter 18
                       || attMap[attName] instanceof Node
                       || $A.util.isComponent(attMap[attName])
                       || "body" === attName
                       || "value" === attName
                       || "loggingContext" === attName
                       || "wrappedActions" === attName
                       || "apiNamesToKeyPrefixes" === attName
                       || 'resizableColumnsConfig' === attName
                       || 'privateQuillInstance' === attName
                       || 'api' === attName
                       || 'selectableOptions' === attName
                       || '_state' === attName
                       || 'onclick' === attName
                       || 'targetRecordDeprecated' === attName
                       || 'dedupeConfig' === attName
                       || 'navService' === attName
                       || 'onresize' === attName
                       || 'supportedEntities' === attName
                       || 'appMetadata' === attName
                       || '_pluginCache' === attName
                       || 'focusTrigger' === attName
                       || 'picklistRefs' === attName
                       || 'onsortchange' === attName
                       || 'onselect' === attName
                       || 'onsortchange' === attName
                       || 'selectionModel' === attName
                       || 'infiniteLoadingDataProvider' === attName
                       || '_cache' === attName
                       || 'config' === attName
                       || 'service' === attName
                       || 'navigationServiceDelegate' === attName
                       || 'workspaceMap' === attName
                       || 'displayCreatedPromise' === attName
                       || 'metadata' === attName
                       || 'tabMap' === attName
                       //|| 'tabInfoMap' === attName
                       ) {
                   
                   continue;
               }
               appendAttributeInfo(auraInfo, auraElem, component, attName);
           }
       }

       // Recurse into the attributeValueProvider:
       // NOTE: The attribute providers globalId is not the same as its getGlobalId:
       // - The actual globalId is returned by the $globalId$ (debugMode) or A properties
       // - don't fully understand this.
       var attributeValueProvider = component.getAttributeValueProvider ? component.getAttributeValueProvider() : null;
       if (attributeValueProvider && attributeValueProvider.getGlobalId instanceof Function && attributeValueProvider.getGlobalId() !== globalId) {
           var attributeProviderId = attributeValueProvider.getConcreteComponent().getGlobalId();
           setAuraInfoAttribute(auraInfo, auraElem, "apId", attributeProviderId);
           var attributeValueProviderInfo = getComponentInfo(attributeValueProvider, resultMap, parentAuraDomElem ? valueProvidersElem : null, expressionsElem, valueProvidersElem, attributeProviderId);
       }
       
        if(attributeValueProvider && attributeValueProvider.getPrimaryProviderKeys instanceof Function){
            

               var values = {};
                var value;
                var keys;
                var provider = attributeValueProvider;
                while(provider && !("_$getSelfGlobalId$" in provider) && provider.getPrimaryProviderKeys instanceof Function) {
                    keys = provider.getPrimaryProviderKeys();
                    for(var c = 0; c<keys.length;c++) {
                        key = keys[c];
                        if(!values.hasOwnProperty(key)) {
                            value = provider.get(key);

                            if($A.util.isComponent(value)) {
                               /* values[key] = {
                                    "id": value
                                };*/
                            } else {
                                if(key !== 'wrappedAction'){
                                    //values[key] = value;
                                    setAuraInfoAttribute(auraInfo, auraElem, key, value);
                                }
                                
                            }
                        }
                    }
                    provider = provider.getComponent();

                }
                if(provider && "_$getSelfGlobalId$" in provider) {
                    //output["globalId"] = provider._$getSelfGlobalId$();
                }
                //output["values"] = values;
               
                
                 
        }
        
        //when a component type is an expression, we need to retrieve child component from v.value
        if(component.type && component.type === 'aura:expression'){
       	var componentValue =component.get('v.value');
       	 if (componentValue && componentValue  instanceof Array) {
              for (var i = 0, iLen = componentValue.length; i < iLen; i++) {
                  var childValue = componentValue[i];
                  if ($A.util.isComponent(childValue)) {
           
	                       var childInfo = getComponentInfo(childValue, resultMap, auraElem, expressionsElem, valueProvidersElem);
	                        if (childInfo ) {
	                       
	                            if (!childInfo.pId) {
	                                    childInfo.pId = globalId;
	                            }
	                            if(childInfo.id && typeof childInfo.id === 'string' && childInfo.id.indexOf(':')> 0) {
	                            	if (!auraInfo.cIds) {
	                                    auraInfo.cIds = "" + childInfo.id;
	                                }
	                                else {
	                                    auraInfo.cIds += "," + childInfo.id;
	                                }
	                                delete childInfo.id;
	                            }
	                        }
                  }
              }
          }else{
              if ($A.util.isComponent(componentValue)) {
                  let bodyValue = getRawAttributeValue(componentValue, "body");
                  if (bodyValue) {
                      auraInfo.cIds = null;
                      for (let bodyKey in bodyValue) {
                          let bodyArray = bodyValue[bodyKey];
                          if(bodyArray instanceof Array){
                              for (let i = 0, iLen = bodyArray.length; i < iLen; i++) {
                                  let child = bodyArray[i];
                                  let childInfo = getComponentInfo(child, resultMap, auraElem, expressionsElem, valueProvidersElem,null);
                                  if (childInfo ) {
                                 
                                      if (!childInfo.pId) {
                                              childInfo.pId = globalId;
                                      }
                                      if(childInfo.id && typeof childInfo.id === 'string'  && childInfo.id.indexOf(':')> 0) {
                                          if (!auraInfo.cIds) {
                                              auraInfo.cIds = "" + childInfo.id;
                                          }
                                          else {
                                              auraInfo.cIds += "," + childInfo.id;
                                          }
                                          delete childInfo.id;
                                      }
                                  }
                              }
                          }
                      
                      }
                      if (!auraInfo.cIds) {
                          delete auraInfo.cIds;
                      }
                  }
              }
          }
       }


       // Recurse into the concreteComponent if different:
      /* var concreteComponent = component.getConcreteComponent ? component.getConcreteComponent() : null;
       if (concreteComponent && concreteComponent.getGlobalId instanceof Function && concreteComponent.getGlobalId() !== globalId) {
           setAuraInfoAttribute(auraInfo, auraElem, "ccId", concreteComponent.getGlobalId());
           var concreteComponentInfo = getComponentInfo(concreteComponent, resultMap, parentAuraDomElem ? valueProvidersElem : null, expressionsElem, valueProvidersElem);
       }*/
       
       if(checkValidComponent(component)){
           var bodyValue = getRawAttributeValue(component, "body");
           if (bodyValue) {
               auraInfo.cIds = null;
               for (var bodyKey in bodyValue) {
                   var bodyArray = bodyValue[bodyKey];
                   if(bodyArray instanceof Array){
	                   for (var i = 0, iLen = bodyArray.length; i < iLen; i++) {
	                       var child = bodyArray[i];
	                       var childInfo = getComponentInfo(child, resultMap, auraElem, expressionsElem, valueProvidersElem);
	                       if (childInfo ) {
	                      
	                           if (!childInfo.pId) {
	                                   childInfo.pId = globalId;
	                           }
	                           if(childInfo.id && typeof childInfo.id === 'string' && childInfo.id.indexOf(':')> 0) {
	                               if (!auraInfo.cIds) {
	                                   auraInfo.cIds = "" + childInfo.id;
	                               }
	                               else {
	                                   auraInfo.cIds += "," + childInfo.id;
	                               }
	                               delete childInfo.id;
	                           }
	                       }
	                   }
                   }
               }
               if (!auraInfo.cIds) {
                   delete auraInfo.cIds;
               }
           }
           else {
                if (componentValue && componentValue.getExpression instanceof Function){
                   var expression=componentValue.getExpression();
                   var valueProvider=component.getAttributeValueProvider();
                   
                    var componentFacet=null;
                   try{
                       componentFacet=valueProvider.get(expression);
                   
                   }catch(e){
                       componentFacet=null;
                   }
              
                   //var componentFacet=componentValue && componentValue.lf ? componentValue.lf :componentValue;
                   if(componentFacet && isExpression(auraInfo) && isFacets(componentFacet)) {
                       auraInfo.cIds = null;
                       var facets = Array.isArray(componentFacet) ? componentFacet : [componentFacet];
                       for (var i = 0, iLen = facets.length; i < iLen; i++) {
                           var child = facets[i];
                           if (isComponentId(child)) {
                               child = $A.getComponent(facets[i]);
                           }
                           if (!child) {
                               continue;
                           }
                           var childInfo = getComponentInfo(child, resultMap, auraElem, expressionsElem, valueProvidersElem);
                           if (childInfo ) {
                    
                               if (!childInfo.pId) {
                                
                                       childInfo.pId = globalId;
                                   
                                   
                               }
                               if (!auraInfo.cIds) {
                                   auraInfo.cIds = "" + childInfo.id;
                               }
                               else {
                                   auraInfo.cIds += "," + childInfo.id;
                               }
                               delete childInfo.id;
                           }
                       }
                       if (!auraInfo.cIds) {
                           delete auraInfo.cIds;
                       }
                   }
               }
                   
               
               
           }
       }
       

       return auraInfo;
   }

   function getRawAttributeValue(component, attributeName) {
       if (component._$getRawValue$ && (typeof component.interopClass === 'undefined')){
           return component._$getRawValue$(attributeName);
       }
       else {
           /*if(component.ab){
               return component.ab.n[attributeName];
           }else if(component.eb){
               return component.eb.n[attributeName];
           }else{
               var attSet = component.$getValueProvider$('v');
                if (attSet && attSet.$values$) {
                    return attSet.$values$[attributeName];
                }              
                return null;
           }*/
             try {
              var attributeSet=component.get('v');
                  return attributeSet && valueProviderValuesProperty ? attributeSet[valueProviderValuesProperty][attributeName]:null;
              }
               catch(e) {//some components are not supposed to have the attributes; In that cases aura throws exception
                   return null;
               }
       }
    }

    function isComponentId(testId) {
        return typeof testId === "string" && testId.startsWith("\u263A");
    }

    function isComponent(testComponent) {
        return testComponent && testComponent.getGlobalId instanceof Function;
    }

    function isExpression(auraInfo) {
        return auraInfo.descr === "aura:expression";
    }
   
    function isFacets(value) {
        if(!Array.isArray(value)) { 
           return isComponent(value);
        }
        for(var c=0;c<value.length;c++) {
           if(!isComponent(value[c]) && !isComponentId(value[c])) { 
               return false; 
           }
        }
        return true;
   }  

   function checkValidComponent(component){

       // Chuba: Disabling because it is quicker without this check - sorry :(
   //        return true;
       
       var element=component.getElement();
       var className=null;
       if(element){
           className=element.className;
           if(className instanceof Object) {
               return false;
           }
       }
       var result=true;
       if(className && (className.indexOf('oneContent') >= 0 
           || (className.indexOf('tabs__content') >= 0 && className.indexOf('uiTab') >= 0 )
           || (className.indexOf('tabs__item') >=0)
           )){
           if(className.indexOf('active') >=0){
               result=true;
           }else{
               result=false;
           }
       }

       /*if(className && className.indexOf('riseTransitionEnabled') >= 0){
           if(className.indexOf('hideEl') >=0){
               result=true;
           }else{
               result=false;
           }
       }*/
       if(className && (
           //(className.indexOf('row') >=0 && className.indexOf('region-subheader') >=0 )
           (className.indexOf("bottomBar") >=0)
           || (className.indexOf("twoCol") >=0 && className.indexOf("forcePageBlockSection")>=0 && className.indexOf("forcePageBlockSectionView")>=0)
           //|| (className.indexOf("slds-global-header__item") >=0 && className.indexOf("slds-grid--vertical-align-center") >=0)
           //|| (className.indexOf("slds-global-header") >=0 && className.indexOf("slds-grid") >=0 && className.indexOf("slds-grid--align-spread") >=0)
           || (className.indexOf("full")>=0 && className.indexOf("forcePageBlockSectionRow") >=0)
           || (className.indexOf("hidden") >=0 && className.indexOf("slds-context-bar__item") >=0 && className.indexOf("slds-shrink-none") >=0 && className.indexOf("oneAppNavBarItem") >= 0)
           || (className.indexOf("dockingPanelOverflow")>=0 && className.indexOf("slds-docked_container")>=0 && className.indexOf("hidden") >=0 && className.indexOf("forceDockingPanelOverflow")>=0)
           || (className.indexOf("appLauncher")>=0 && className.indexOf("slds-context-bar__icon-action") >=0)
           || (className.indexOf("slds-grid")>=0 && className.indexOf("slds-page-header__detail-row") >=0)
           //|| (className.indexOf("slds-truncate") >=0)
           //|| (className.indexOf("hidden")>=0)
           || (className.indexOf("hideEl")>=0)
           || (className.indexOf("tooltip")>=0 && className.indexOf("advanced-wrapper") >=0 && className.indexOf("forceHeaderButton") >=0 && className.indexOf("header-tooltip") >=0 && className.indexOf("north")>=0 && className.indexOf("uiTooltipAdvanced") >=0)
           || (className.indexOf("NARROW") >=0 && className.indexOf("runtime_sales_activitiesActivityTimeline2")>=0)
           || (className.indexOf("tabs__nav") >=0)
           || (className.indexOf("slds-global-header_container") >=0)
           )){
           result=false;
       }

       
       return result;
   } 

   function retriveParentIdVariable(debugMode){
       var parentIdVar=null;
       if(debugMode){
           parentIdVar = "$containerComponentId$";
       }else{
           if($A.Component instanceof Function){
               var strComponentFunc=$A.Component.toString();
               var componentFuncArray=strComponentFunc.split('a.containerComponentId');
               var componentIndex=componentFuncArray[0].lastIndexOf(';');
               var componentStr=componentFuncArray[0].substring(componentIndex+1);
               var firstIndex=componentStr.indexOf('.');
               var lastIndex=componentStr.indexOf('=');
               parentIdVar = componentStr.substring(firstIndex+1,lastIndex);
           }
           
       }
       
       return parentIdVar;
   }

   function checkComponentInfo(attMap,attName){

	   if(attMap[attName] instanceof Array){
	       if(attName === 'componentInfoDefRef'
	    	   || attName === 'relatedLists' //related lists info in related list quick links   
	       ){
	               return false;
	           }else{
	               return true;
	           }
	           
	       }else{
	           return false;
	       }
   }

}

return resolveAuraBy(arguments[0], arguments[1], arguments[2]);


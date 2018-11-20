function resolveSteelBrickBy(tabName, webElement, makeFieldEditable){
	if(webElement && makeFieldEditable){
		return checkAndMakeReadOnlyFieldEditable(webElement);
	}
	
    var cssLocator = "sb-page-container/deep/sb-tabs/deep/paper-tabs/deep/paper-tab.noOverflow,sb-page-container/deep/sb-tabs/deep/li.overflow/deep/span";
    var elems = document.querySelectorAll(cssLocator);
    //find and navigate to specified tab
    for(var elem of elems){
        var tName = elem.textContent.toUpperCase().trim();
        tabName = tabName.toUpperCase().trim();
        if(tName === tabName){
        	var tag = elem.tagName;
        	if(tag === 'SPAN') {
        		//click on dropdown first
        		var dropDownElem = document.querySelector("sb-page-container/deep/sb-tabs/deep/paper-tabs/deep/paper-tab.overflowTab");
        		if(dropDownElem != null){
        			dropDownElem.click();
        		}
        	}
        	elem.click();
            var parentLocator = "sb-page-container/deep/sb-tabs";
            return document.querySelector(parentLocator);
        }
    }
    
    return null;
}

function checkAndMakeReadOnlyFieldEditable(webElement){
	var elem = webElement;
	var htmlElem = elem.getRootNode().host;
	var tagName = htmlElem.tagName;
	var className = htmlElem.getAttribute("class");
	if("SB-HTML" === tagName && className && className.indexOf("editable") >= 0){
	    while(htmlElem){
	        if(htmlElem.tagName === "SB-FIELD"){
	        	//make sure element gets clicked
	        	webElement.click();
	            return htmlElem.querySelector(':scope/deep/input');
	        }
	        htmlElem = htmlElem.getRootNode().host;
	    }
	} else {
		return "Field is not editable";
	}
}

return resolveSteelBrickBy(arguments[0], arguments[1], arguments[2]);
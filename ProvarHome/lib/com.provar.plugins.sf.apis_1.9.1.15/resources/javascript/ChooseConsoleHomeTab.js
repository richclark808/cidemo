var tabToNavigate = arguments[0];
var callback = arguments[arguments.length -1];

var setTab = function setTab(result) {
	 if (result.success) {
		 callback('success');
	 } else {
       	callback('something is wrong!');
     }
};

var getRequiredTab = function (result) {
	if(result == null){
		return;
	}
	 var tempItem = JSON.parse(result.items);
	 var len = tempItem.length;
		for (var i = 0;  i < len; i++) {
		if(tabToNavigate === tempItem[i].label) {
			sforce.console.setSelectedNavigationTab(setTab, tempItem[i].navigationTabId);
			return;
		}
	}
};

function setNavigationTab() {
	if (window.sforce && window.sforce.console) {
		tabToNavigate === 'HomeTab' ?  sforce.console.focusNavigationTab(setTab) :
			sforce.console.getNavigationTabs(getRequiredTab);
	} else {
		var script = document.createElement('script');
		if (script.readyState) { // upto IE10
			script.onreadystatechange = function () {
				if (script.readyState === "loaded" || script.readyState === "complete") {
					tabToNavigate === 'HomeTab' ?  sforce.console.focusNavigationTab(setTab) :
						sforce.console.getNavigationTabs(getRequiredTab);
					document.getElementsByTagName("head")[0].removeChild(script);
					try { 
						delete window.sforce; 
					} 
					catch(e) { 
						window["sforce"] = undefined;
					}
				}
			};
		} else { //others
			script.onload = function () {
				setTimeout(function() {
					tabToNavigate === 'HomeTab' ?  sforce.console.focusNavigationTab(setTab) :
						sforce.console.getNavigationTabs(getRequiredTab);
					script.onload = null;
					document.getElementsByTagName("head")[0].removeChild(script);
					try { 
						delete window.sforce; 
					} 
					catch(e) { 
						window["sforce"] = undefined;
					}
				}, 1000) ;
			}
		}
		script.src = "/support/console/34.0/integration.js";
		document.getElementsByTagName("head")[0].appendChild(script);
	}
}

setNavigationTab();
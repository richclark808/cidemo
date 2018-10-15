var handleUnsaveSubTabs = function handleUnsaveSubTabs(result, i) {
	if (i === undefined) {
		i = result.ids.length - 1;
	}
	if (i < 0) {
		return;
	}
	var subTabId = result.ids[i];
	
	sforce.console.setTabUnsavedChanges(false, function (response) {
		// Prior to v35 the callback arg on closeTab is not supported.
		if (sforce.console.closeTab.length == 2) {
			// callback is supported, so recurse once the tab is closed.
			sforce.console.closeTab(subTabId, function(){ 
				handleUnsaveSubTabs(result, i-1);
			});
		}
		else {
			// callback is not supported, so recurse immediately.
			sforce.console.closeTab(subTabId);
			handleUnsaveSubTabs(result, i-1);
		}
	}, subTabId);
};

var getSecondaryTabsAndClose = function getSecondaryTabsAndClose(result) {
	for (var i = 0, len = result.ids.length; i < len; i++) {
		sforce.console.getSubtabIds(result.ids[i], handleUnsaveSubTabs);
	}
};

function closeConsoleTabs() {
	if (window.sforce && window.sforce.console) {
		sforce.console.getPrimaryTabIds(getSecondaryTabsAndClose);
	} else {
		var script = document.createElement('script');
		if (script.readyState) { // upto IE10
			script.onreadystatechange = function () {
				if (script.readyState === "loaded" || script.readyState === "complete") {
					sforce.console.getPrimaryTabIds(getSecondaryTabsAndClose);
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
					sforce.console.getPrimaryTabIds(getSecondaryTabsAndClose);
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
		script.src = "/support/console/38.0/integration.js";
		document.getElementsByTagName("head")[0].appendChild(script);
	}
}

closeConsoleTabs();
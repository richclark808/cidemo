var tabId = arguments[0];
var tabType = arguments[1];
var callback = arguments[arguments.length -1];

var focusSuccess = function setTab(result) {
	 if (result.success) {
		 callback('success');
	 } else {
       	callback('something is wrong!');
     }
};

function switchTab() {
	if (window.sforce && window.sforce.console) {
		tabType === 'Primary' ?  sforce.console.focusPrimaryTabById(tabId, focusSuccess):
			sforce.console.focusSubtabById(tabId, focusSuccess);

	} else {
		var script = document.createElement('script');
		if (script.readyState) { // upto IE10
			script.onreadystatechange = function () {
				if (script.readyState === "loaded" || script.readyState === "complete") {
					tabType === 'Primary' ?  sforce.console.focusPrimaryTabById(tabId, focusSuccess):
						sforce.console.focusSubtabById(tabId, focusSuccess);
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
					tabType === 'Primary' ?  sforce.console.focusPrimaryTabById(tabId, focusSuccess):
						sforce.console.focusSubtabById(tabId, focusSuccess);
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

switchTab();
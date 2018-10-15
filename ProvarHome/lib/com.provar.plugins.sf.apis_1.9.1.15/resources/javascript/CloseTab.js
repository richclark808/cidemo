var tabId = arguments[0];
function closeTab() {
	if (window.sforce && window.sforce.console) {
		sforce.console.closeTab(tabId);
	} else {
		var script = document.createElement('script');
		if (script.readyState) { // upto IE10
			script.onreadystatechange = function () {
				if (script.readyState === "loaded" || script.readyState === "complete") {
					sforce.console.closeTab(tabId);
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
					sforce.console.closeTab(tabId);
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
closeTab();
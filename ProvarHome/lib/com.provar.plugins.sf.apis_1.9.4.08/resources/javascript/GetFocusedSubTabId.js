var callback = arguments[arguments.length -1];

var result = function setTab(result) {
	 if (result.success) {
		 callback(result.id);
	 } else {
       	callback('something is wrong!');
     }
};

function getFocusedSubTabId() {
	if (window.sforce && window.sforce.console) {
		
			sforce.console.getFocusedPrimaryTabId(result);

	} else {
		var script = document.createElement('script');
		if (script.readyState) { // upto IE10
			script.onreadystatechange = function () {
				if (script.readyState === "loaded" || script.readyState === "complete") {
					sforce.console.getFocusedPrimaryTabId(result);
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
					sforce.console.getFocusedPrimaryTabId(result);
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

getFocusedSubTabId();
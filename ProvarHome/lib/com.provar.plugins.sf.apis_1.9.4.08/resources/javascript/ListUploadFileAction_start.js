var fileDownloadButton = arguments[0];
return startListUploadFileAction(fileDownloadButton);

//Iterating first level childrens on aura component services. 
//TODO: We might need to iterate deeper later, but usual pattern is we get file uploader at first level of iteration
function getFileUploaderFromAuraComponentServices() {
	var services = $A.componentService;
	for(key in services) {
		if(services.hasOwnProperty(key)) {
			var s = services[key];
			for(k in s) {
				if(s[k] && typeof s[k] == 'object') {
					var fileUploader = s[k]["js://forceContent.contentLib.FileUploader"];
					if(fileUploader && typeof fileUploader == 'function') {
						return fileUploader;
					}
				}    
			}
		}
	}
}

function startListUploadFileAction(fileDownloadButton) {

    // Get the contentLib service from Aura:
    // - this has the FileUploader.selectFileFromDevice that we need to overwrite.
	var contentLibFileUploader;
	if($A.componentService.Ql && $A.componentService.Ql.Jb) {
	    contentLibFileUploader = $A.componentService.Ql.Jb["js://forceContent.contentLib.FileUploader"];
	} else if($A.componentService.cl && $A.componentService.cl.Ab) {
	    contentLibFileUploader = $A.componentService.cl.Ab["js://forceContent.contentLib.FileUploader"];
	} else if($A.componentService.$k && $A.componentService.$k.Fb) { //Spring18
		contentLibFileUploader = $A.componentService.$k.Fb["js://forceContent.contentLib.FileUploader"];
	} else if($A.componentService.xl && $A.componentService.xl.Jb) { //Summer18
		contentLibFileUploader = $A.componentService.xl.Jb["js://forceContent.contentLib.FileUploader"];
	} else if($A.componentService.yl && $A.componentService.yl.Jb) { //Summer18
		contentLibFileUploader = $A.componentService.yl.Jb["js://forceContent.contentLib.FileUploader"];
	} else {
		contentLibFileUploader = getFileUploaderFromAuraComponentServices();
	}
	if(!contentLibFileUploader) {
		return null;
	}

    // Override the definition of the selectFileFromDevice function so that:
    // 1.  Creates the file button, but does not click it
    // 2.  sets window._provarFileButton to the file button so that we can return it.
    var a = {};
    window._provarFileButton = null;
    contentLibFileUploader.selectFileFromDevice = function(e, b, c) {
        var f = document.createDocumentFragment()
          , d = document.createElement("input");
        d.type = "file";
        b && (d.multiple = b);
        c && (d.accept = c);
        a.fileInput = d;
        if ($A.util.isFunction(e))
            $A.util.on(d, "change", $A.getCallback(function(a) {
                e(this.files)
            }));
        f.appendChild(d);

        // Start of Provar mods
        //d.click()        
        window._provarFileButton = d;
        document.body.appendChild(d);
        // End of Provar mods
    };

    // Click the supplied button:
    // - this is not the actual file button, but will cause our overridden selectFileFromDevice 
    //   to be invoked.
    fileDownloadButton.click();

    // The Click will have populated the file button:
    // - we return it so that it can be typed into via Selenium.
    return window._provarFileButton;

}

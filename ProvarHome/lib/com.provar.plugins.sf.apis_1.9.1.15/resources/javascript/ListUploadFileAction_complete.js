var generatedFileElement = arguments[0];
if(generatedFileElement && generatedFileElement instanceof Node) {
	document.body.removeChild(generatedFileElement);
}
delete window._provarFileButton;


drop = function( source, target, transferArray ) {

	simulateEvent(source, target , transferArray);

	function simulateEvent(source, target, transferArray) {

		/*Simulating dragover*/
		type = 'dragenter';
		var dragoverEvent = createEvent(type, {});
		for (var i = 0; i < transferArray.length; i+=2) {
			dragoverEvent.dataTransfer.setData(transferArray[i], transferArray[i+1]);
		}
		dispatchEvent(target, type, dragoverEvent);

		/*Simulating drop*/
		type = 'drop';
		var dropEvent = createEvent(type, {});
		dropEvent.dataTransfer = dragoverEvent.dataTransfer;
		dispatchEvent(target, type, dropEvent);

		/*Simulating drag end*/
		type = 'dragend';
		var dragEndEvent = createEvent(type, {});
		dragEndEvent.dataTransfer = dragoverEvent.dataTransfer;
		dispatchEvent(source, type, dragEndEvent);
	}
	
	function createEvent(type) {
		var event = document.createEvent("CustomEvent");
		event.initCustomEvent(type, true, true, null);
		event.dataTransfer = {
				data: {
				},
				types: [],
				setData: function(type, val){
					this.data[type] = val;
					this.types.push(type);
				},
				getData: function(type){
					return this.data[type];
				}
		};
		return event;
	}
	
	function dispatchEvent(elem, type, event) {
		if(elem.dispatchEvent) {
			elem.dispatchEvent(event);
		}else if( elem.fireEvent ) {
			elem.fireEvent("on"+type, event);
		}
	}
};
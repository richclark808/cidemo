dnd = function( source, target ) {

	simulateEvent(source , target);

	function simulateEvent(source, target) {
		/*Simulating drag start*/
		var type = 'dragstart';
		var event = createEvent(type);
		dispatchEvent(source, type, event);

		/*Simulating dragover*/
		type = 'dragenter';
		var dragoverEvent = createEvent(type, {});
		dragoverEvent.dataTransfer = event.dataTransfer;
		dispatchEvent(target, type, dragoverEvent);

		/*Simulating drop*/
		type = 'drop';
		var dropEvent = createEvent(type, {});
		dropEvent.dataTransfer = event.dataTransfer;
		dispatchEvent(target, type, dropEvent);

		/*Simulating drag end*/
		type = 'dragend';
		var dragEndEvent = createEvent(type, {});
		dragEndEvent.dataTransfer = event.dataTransfer;
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
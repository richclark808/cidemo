dragStart = function( source ) {

	var transferArray = [];
	simulateEvent(source);
	return transferArray;

	function simulateEvent(source) {
		/*Simulating drag start*/
		var type = 'dragstart';
		var event = createEvent(type);
		dispatchEvent(source, type, event);
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
					
					transferArray.push(type);
					transferArray.push(val);
					
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
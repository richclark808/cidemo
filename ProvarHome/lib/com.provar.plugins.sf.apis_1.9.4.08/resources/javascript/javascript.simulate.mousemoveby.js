moveBy = function( source, realOrEmulatedDevice, byX, byY ) {

	var touchSeq=0;
	
	simulateMouseStart(source, realOrEmulatedDevice);
	simulateMouseMove(source, realOrEmulatedDevice, byX, byY);
	simulateMouseEnd(source, realOrEmulatedDevice);
	
	function simulateMouseStart(source, target) {
		var type = 'mousedown';
		var event = createMouseEvent(source, type, realOrEmulatedDevice, [{x: 10, y: 10}]);
		dispatchEvent(source, type, event);
	}
	
	function simulateMouseMove(source, target, byX, byY) {
		var type = 'mousemove';
		var event = createMouseEvent(source, type, realOrEmulatedDevice, [{x: byX, y: byY}]);
		dispatchEvent(source, type, event);
	}
	
	function simulateMouseEnd(source, target, byX, byY) {
		var type = 'mouseup';
		var event = createMouseEvent(source, type, realOrEmulatedDevice);
		dispatchEvent(source, type, event);
	}

	function createMouseEvent(source, type, realOrEmulatedDevice, points) {
		var event = document.createEvent("MouseEvent");
		event.initEvent(type, true, true, null);
        event.constructor.name; // Event (not TouchEvent)

        if (points) {
        	event.touches = [];
        	for (var p = 0, pLen = points.length; p < pLen; p++) {
        		var point = points[p];
        		var touch = {
        				target: source,
        				identifier: Date.now() + touchSeq++,
        				pageX: point.x,
        				pageY: point.y,
        				screenX: point.x,
        				screenY: point.y,
        				clientX: point.x,
        				clientY: point.y
        		};
        		event.touches.push(touch);
        	}
        }
        
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
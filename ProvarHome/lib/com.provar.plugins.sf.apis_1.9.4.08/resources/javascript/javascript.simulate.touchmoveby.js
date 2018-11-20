moveBy = function( source, realOrEmulatedDevice, byX, byY ) {

	var touchSeq=0;
	
	simulateTouchStart(source, realOrEmulatedDevice);
	simulateTouchMove(source, realOrEmulatedDevice, byX, byY);
	simulateTouchEnd(source, realOrEmulatedDevice);
	
	function simulateTouchStart(source, target) {
		var type = 'touchstart';
		var event = createTouchEvent(source, type, realOrEmulatedDevice, [{x: 10, y: 10}]);
		dispatchEvent(source, type, event);
	}
	
	function simulateTouchMove(source, target, byX, byY) {
		var type = 'touchmove';
		var event = createTouchEvent(source, type, realOrEmulatedDevice, [{x: byX, y: byY}]);
		dispatchEvent(source, type, event);
	}
	
	function simulateTouchEnd(source, target, byX, byY) {
		var type = 'touchend';
		var event = createTouchEvent(source, type, realOrEmulatedDevice);
		dispatchEvent(source, type, event);
	}

	function createTouchEvent(source, type, realOrEmulatedDevice, points) {
		var event = document.createEvent(realOrEmulatedDevice ? "TouchEvent" : "UIEvent");
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
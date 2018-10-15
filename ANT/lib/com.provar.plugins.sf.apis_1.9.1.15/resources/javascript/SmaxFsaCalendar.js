function fireTouchEvent (element, type, pageX, pageY) {
    var e,
        touch,
        touches,
        targetTouches,
        changedTouches
        identifier = new Date().getTime();

    touch = document.createTouch(window, element, identifier, pageX, pageY, pageX, pageY);

    if (type == 'touchend') {
        touches = document.createTouchList();
        targetTouches = document.createTouchList();
        changedTouches = document.createTouchList(touch);
    } else {
        touches = document.createTouchList(touch);
        targetTouches = document.createTouchList(touch);
        changedTouches = document.createTouchList(touch);
    }

    e = document.createEvent('TouchEvent');
    e.initTouchEvent(type, true, true, window, null, 0, 0, 0, 0, false, false, false, false, touches, targetTouches, changedTouches, 1, 0);

    window.dispatchEvent(e);
};

function openEvent(eventId) {
    
    var eventWrapperElement = document.querySelector('.e-' + eventId);
    fireTouchEvent(eventWrapperElement, 'touchstart', 0, 0);
    fireTouchEvent(eventWrapperElement, 'touchend', 0, 0);

};

function editEvent(eventId) {
	
	var eventElement = document.querySelector('.e-' + eventId);
	console.log('eventElement', eventElement);
	if (!eventElement) {
		return;
	}
	
	var eventEditElement = eventElement.querySelector('.sfmevent-icon-edit');
	console.log('eventEditElement', eventEditElement);
	if (!eventEditElement) {
		return;
	}

	var calendarElement = eventEditElement.parentElement;
	while (calendarElement) {
		if (calendarElement.id && calendarElement.id.indexOf('ext-touchcalendarview-') === 0) {
			break;
		}
		calendarElement = calendarElement.parentElement;
	}
	console.log('calendarElement', calendarElement);
	if (!calendarElement) {
		return;
	}

	var calendarCmp = Ext.getCmp(calendarElement.getAttribute('data-componentid'));
	console.log('calendarCmp', calendarCmp);
	if (!calendarCmp) {
		return;
	}

	var eventRecord = calendarCmp.eventStore.getByInternalId(eventId);
	console.log('eventRecord', eventRecord);
	if (!eventRecord) {
		return;
	}
	
	var tapEvt = {type: 'tap'
		, target:  eventEditElement
		, currentTarget:  eventEditElement
		, delegatedTarget:  eventEditElement
		, stopEvent: function() {}
		, getTarget: function (selector, maxDepth, returnEl) {  return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target); }
		};
	calendarCmp.fireEvent('eventtap', eventRecord, tapEvt);
	
};

if (arguments[1] === 'editEvent') {
	editEvent(arguments[0]);
}
else {
	openEvent(arguments[0]);
}


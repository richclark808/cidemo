
  var forElem = arguments[0];

  // Get the event id.
  let eventId = forElem.getAttribute('eventid');
  if (!eventId) {
    return null;
  }
  
  // Get the enclosing Calendar View component.
  let smaxCalendarViewCmp = null;
  let parentElem = forElem.parentElement;
  while (parentElem) {
    if (parentElem.id && parentElem.id.indexOf('ext-touchcalendarview-') === 0) {
      smaxCalendarViewCmp = Ext.getCmp(parentElem.id);
      break;
    }
    parentElem = parentElem.parentElement;
  }
  if (!smaxCalendarViewCmp || !smaxCalendarViewCmp.eventStore) {
    return null;
  }
  
  // Get the event from the event store.
  let eventData = smaxCalendarViewCmp.eventStore.getByInternalId(eventId);
  if (!eventData || !eventData.data) {
    return null;
  }
  
  return {
    subject: eventData.data.subject,
    title: eventData.data.title,
    priority: eventData.data.priority,
    
    startTime: eventData.data.start ? eventData.data.start.toISOString().substring(11,16) : null,
    endTime: eventData.data.end ? eventData.data.end.toISOString().substring(11,16) : null,
    
    account: eventData.data.account,
    woName: eventData.data.woName,
    
    multiDayEvent: eventData.data.multiDayEvent,
    multiDayEventIndex: eventData.data.multiDayEventIndex
  };
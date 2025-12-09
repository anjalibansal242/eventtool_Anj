// EventName.js
import React from 'react';
import { useEvent } from './EventDetailsContext';

const EventName = () => {
  const { eventDetails } = useEvent();

  if (!eventDetails || !eventDetails.eventName) {
    return null;
  }

  return (
      <div className="pageDetailsWrp">
          <span>{eventDetails.eventName}</span>
      </div>
  );
};

export default EventName;

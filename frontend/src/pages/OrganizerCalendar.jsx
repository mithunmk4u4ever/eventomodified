import React from 'react'
import CalendarComponent from '../components/CalendarComponent';

const OrganizerCalendar = () => {
    return <CalendarComponent apiUrl="http://localhost:5000/api/organizers/events" />;
  };
  
  export default OrganizerCalendar;
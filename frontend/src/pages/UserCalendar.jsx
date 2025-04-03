import React from 'react'
import CalendarComponent from '../components/CalendarComponent';

const UserCalendar = () => {
    return <CalendarComponent apiUrl="http://localhost:5000/api/users/allevents" />;
  };
  
  export default UserCalendar;
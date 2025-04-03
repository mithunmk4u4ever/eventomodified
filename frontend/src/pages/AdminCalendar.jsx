import React from 'react'
import CalendarComponent from '../components/CalendarComponent';


const AdminCalendar = () => {
    return <CalendarComponent apiUrl="http://localhost:5000/api/admin/allevents" />;
  };
  
  export default AdminCalendar;
"use client";

import { useState, useEffect } from 'react';
import styles from './CustomCalendar.module.css';

const CustomCalendar = ({ value, onChange, minDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    
    // Check if date is before minimum date (today)
    if (minDate && clickedDate < minDate) {
      return;
    }

    setSelectedDate(clickedDate);
    onChange(clickedDate);
  };

  const isDateDisabled = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return minDate && date < minDate;
  };

  const isDateSelected = (day) => {
    if (!selectedDate) return false;
    const date = new Date(currentYear, currentMonth, day);
    return selectedDate.toDateString() === date.toDateString();
  };

  const isToday = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return today.toDateString() === date.toDateString();
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDateDisabled(day);
    const selected = isDateSelected(day);
    const todayClass = isToday(day);

    calendarDays.push(
      <button
        key={day}
        className={`${styles.calendarDay} ${disabled ? styles.disabled : ''} ${selected ? styles.selected : ''} ${todayClass ? styles.today : ''}`}
        onClick={() => handleDateClick(day)}
        disabled={disabled}
        type="button"
      >
        {day}
      </button>
    );
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button
          type="button"
          className={styles.navButton}
          onClick={goToPreviousMonth}
        >
          ‹
        </button>
        <div className={styles.monthYear}>
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button
          type="button"
          className={styles.navButton}
          onClick={goToNextMonth}
        >
          ›
        </button>
      </div>
      
      <div className={styles.weekdaysHeader}>
        {dayNames.map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>
      
      <div className={styles.calendarGrid}>
        {calendarDays}
      </div>
    </div>
  );
};

export default CustomCalendar;

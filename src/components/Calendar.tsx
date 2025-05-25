import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isBefore, 
  startOfDay,
  addMonths,
  subMonths,
  parseISO,
  isSameDay
} from 'date-fns';
import type { Booking } from '../types';

interface CalendarProps {
  bookings?: Booking[];
  selectedDateFrom?: Date | null;
  selectedDateTo?: Date | null;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export function Calendar({ 
  bookings = [], 
  selectedDateFrom, 
  selectedDateTo, 
  onDateSelect,
  className = "" 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const isDateBooked = (date: Date) => {
    return bookings.some(booking => {
      const bookingStart = parseISO(booking.dateFrom);
      const bookingEnd = parseISO(booking.dateTo);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, startOfDay(new Date())) || isDateBooked(date);
  };

  const isDateInRange = (date: Date) => {
    if (!selectedDateFrom || !selectedDateTo) return false;
    return date >= selectedDateFrom && date <= selectedDateTo;
  };

  const isDateSelected = (date: Date) => {
    if (selectedDateFrom && isSameDay(date, selectedDateFrom)) return true;
    if (selectedDateTo && isSameDay(date, selectedDateTo)) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date) || !onDateSelect) return;
    onDateSelect(date);
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-md"
          aria-label="Previous month"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-md"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const disabled = isDateDisabled(day);
          const booked = isDateBooked(day);
          const selected = isDateSelected(day);
          const inRange = isDateInRange(day);
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={`
                p-2 text-sm rounded-md transition-colors
                ${!isSameMonth(day, currentMonth) ? 'text-gray-300' : ''}
                ${today ? 'ring-2 ring-blue-500' : ''}
                ${selected ? 'bg-blue-600 text-white' : ''}
                ${inRange && !selected ? 'bg-blue-100 text-blue-900' : ''}
                ${booked ? 'bg-red-100 text-red-500 cursor-not-allowed' : ''}
                ${disabled && !booked ? 'text-gray-300 cursor-not-allowed' : ''}
                ${!disabled && !selected && !inRange && !booked ? 'hover:bg-gray-100' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
          Selected
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
          Range
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
          Booked
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border-2 border-blue-500 rounded mr-2"></div>
          Today
        </div>
      </div>
    </div>
  );
}
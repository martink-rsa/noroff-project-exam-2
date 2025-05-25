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
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className={`bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-soft ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-primary-50 rounded-xl transition-colors duration-200"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} className="text-primary-600" />
        </button>
        <h3 className="text-lg font-semibold text-neutral-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-primary-50 rounded-xl transition-colors duration-200"
          aria-label="Next month"
        >
          <ChevronRight size={20} className="text-primary-600" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-neutral-500">
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
                p-2 text-sm rounded-xl transition-colors duration-200
                ${!isSameMonth(day, currentMonth) ? 'text-neutral-300' : ''}
                ${today ? 'ring-2 ring-primary-400' : ''}
                ${selected ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-neutral-900' : ''}
                ${inRange && !selected ? 'bg-primary-100 text-primary-800' : ''}
                ${booked ? 'bg-error-100 text-error-600 cursor-not-allowed' : ''}
                ${disabled && !booked ? 'text-neutral-300 cursor-not-allowed' : ''}
                ${!disabled && !selected && !inRange && !booked ? 'hover:bg-primary-50 text-neutral-700' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-neutral-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded mr-2"></div>
          Selected
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-primary-100 rounded mr-2"></div>
          Range
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-error-100 rounded mr-2"></div>
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
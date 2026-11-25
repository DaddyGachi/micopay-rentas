import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { day } from '../format';

interface BookedRange {
  check_in: string;
  check_out: string;
}

interface CalendarProps {
  booked: BookedRange[];
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  minDate?: string;
}

type DateState = 'free' | 'booked' | 'selected' | 'in-range';

export default function Calendar({ booked, checkIn, checkOut, onCheckInChange, onCheckOutChange, minDate }: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => new Date(checkIn || minDate || new Date()));
  const gridRef = useRef<HTMLDivElement>(null);

  // Build set of booked dates for O(1) lookup
  const bookedDates = useMemo(() => {
    const set = new Set<string>();
    booked.forEach(({ check_in, check_out }) => {
      const start = new Date(check_in);
      const end = new Date(check_out);
      const current = new Date(start);
      while (current < end) {
        set.add(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
      }
    });
    return set;
  }, [booked]);

  // Get days for current month view
  const monthDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay(); // 0 = Sunday
    const days: Date[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startOffset; i++) {
      days.push(new Date(0)); // sentinel
    }

    // Add actual days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [viewMonth]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDateState = useCallback((date: Date): DateState => {
    if (date.getTime() === 0) return 'free';
    const iso = date.toISOString().slice(0, 10);
    if (bookedDates.has(iso)) return 'booked';
    if (iso === checkIn || iso === checkOut) return 'selected';
    if (checkIn && checkOut && iso > checkIn && iso < checkOut) return 'in-range';
    return 'free';
  }, [bookedDates, checkIn, checkOut]);

  const isDateDisabled = useCallback((date: Date): boolean => {
    if (date.getTime() === 0) return true;
    const iso = date.toISOString().slice(0, 10);
    if (minDate && iso < minDate) return true;
    return false;
  }, [minDate]);

  const handleDateClick = useCallback((date: Date) => {
    if (isDateDisabled(date)) return;
    const iso = date.toISOString().slice(0, 10);
    const state = getDateState(date);

    if (state === 'booked') return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start new range
      onCheckInChange(iso);
      onCheckOutChange('');
    } else if (iso < checkIn) {
      // Clicked before check-in: move check-in
      onCheckInChange(iso);
    } else if (iso === checkIn) {
      // Clicked check-in: clear range
      onCheckInChange('');
      onCheckOutChange('');
    } else {
      // Set check-out
      onCheckOutChange(iso);
    }
  }, [checkIn, checkOut, onCheckInChange, onCheckOutChange, isDateDisabled, getDateState]);

  const prevMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1));
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, date: Date) => {
    if (isDateDisabled(date)) return;

    let newDate: Date | null = null;
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();

    switch (e.key) {
      case 'ArrowLeft':
        newDate = new Date(y, m, d - 1);
        break;
      case 'ArrowRight':
        newDate = new Date(y, m, d + 1);
        break;
      case 'ArrowUp':
        newDate = new Date(y, m, d - 7);
        break;
      case 'ArrowDown':
        newDate = new Date(y, m, d + 7);
        break;
      case 'Home':
        newDate = new Date(y, m, 1);
        break;
      case 'End':
        newDate = new Date(y, m + 1, 0);
        break;
      case 'PageUp':
        newDate = new Date(y, m - 1, d);
        break;
      case 'PageDown':
        newDate = new Date(y, m + 1, d);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleDateClick(date);
        return;
      default:
        return;
    }

    if (newDate && newDate.getMonth() === m && newDate.getDate() > 0) {
      e.preventDefault();
      const iso = newDate.toISOString().slice(0, 10);
      const element = document.querySelector(`[data-date="${iso}"]`) as HTMLElement;
      element?.focus();
    }
  }, [isDateDisabled, handleDateClick]);

  // Focus management for month navigation
  useEffect(() => {
    if (gridRef.current) {
      const firstDay = gridRef.current.querySelector('button:not(:disabled)') as HTMLElement;
      firstDay?.focus();
    }
  }, [viewMonth]);

  const renderDayCell = (date: Date, index: number) => {
    if (date.getTime() === 0) {
      return <div key={`empty-${index}`} className="w-12 h-12" aria-hidden="true" />;
    }

    const iso = date.toISOString().slice(0, 10);
    const state = getDateState(date);
    const disabled = isDateDisabled(date);
    const formatted = day(iso);

    const baseClasses = 'w-12 h-12 flex items-center justify-center text-[15px] font-bold rounded-lg border-2 transition-none focus:outline-2 focus:outline-offset-2 focus:outline-tinta';
    const stateClasses: Record<DateState, string> = {
      free: 'bg-papel text-tinta border-line hover:border-tinta hover:shadow-solida-sm',
      booked: 'bg-papel text-gris-2 border-line line-through decoration-2 decoration-tinta',
      selected: 'bg-naranja text-papel border-tinta shadow-solida-sm',
      'in-range': 'bg-naranja-suave text-tinta border-naranja-borde',
    };

    return (
      <button
        key={iso}
        data-date={iso}
        type="button"
        disabled={disabled || state === 'booked'}
        className={`${baseClasses} ${stateClasses[state]} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
        onClick={() => handleDateClick(date)}
        onKeyDown={(e) => handleKeyDown(e, date)}
        aria-label={state === 'booked' ? `${formatted}, booked` : state === 'selected' ? `${formatted}, selected` : state === 'in-range' ? `${formatted}, in selected range` : `${formatted}, no booking registered`}
        aria-pressed={state === 'selected'}
        aria-disabled={disabled || state === 'booked'}
      >
        {date.getDate()}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="min-h-12 px-3 py-2 rounded-lg border-2 border-tinta bg-papel text-tinta font-bold text-[15px] hover:shadow-solida-sm focus:outline-2 focus:outline-offset-2 focus:outline-tinta active:translate-x-[1px] active:translate-y-[1px] active:shadow-solida-xs"
          aria-label="Previous month"
        >
          ←
        </button>
        <span className="text-[15px] font-bold text-tinta">
          {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="min-h-12 px-3 py-2 rounded-lg border-2 border-tinta bg-papel text-tinta font-bold text-[15px] hover:shadow-solida-sm focus:outline-2 focus:outline-offset-2 focus:outline-tinta active:translate-x-[1px] active:translate-y-[1px] active:shadow-solida-xs"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Calendar">
        {weekDays.map((wd) => (
          <div key={wd} className="text-center text-[12px] font-bold text-gris py-2" aria-label={wd}>
            {wd}
          </div>
        ))}
        <div ref={gridRef} className="contents" role="rowgroup">
          {monthDays.map((date, i) => renderDayCell(date, i))}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[12px] text-gris">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded border-2 border-line bg-papel" />
          <span>No booking registered</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded border-2 border-line bg-papel line-through decoration-tinta" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded border-2 border-tinta bg-naranja" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../../forms/css-modules/DateFilter.module.css';

interface DateRange {
  startDate: Date | null;
  endDate: Date;
}

// Define the props interface with the callback type
interface DateFilterProps {
  onDateRangeChange: (newDateRange: DateRange) => void;
  controlledDateRange: DateRange;
}

const DateFilter: React.FC<DateFilterProps> = ({ onDateRangeChange, controlledDateRange }) => {
  const [dateRange, setDateRange] = useState<DateRange>(controlledDateRange);
  const [viewMode, setViewMode] = useState<'year' | 'month' | 'custom'>('year');
  const [currentMonthView, setCurrentMonthView] = useState<Date>(new Date());

  // Generate years for selection (from current year to 10 years before)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 12; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  // Generate months for the year view
  const months = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Apr', value: 3 },
    { name: 'May', value: 4 },
    { name: 'Jun', value: 5 },
    { name: 'Jul', value: 6 },
    { name: 'Aug', value: 7 },
    { name: 'Sep', value: 8 },
    { name: 'Oct', value: 9 },
    { name: 'Nov', value: 10 },
    { name: 'Dec', value: 11 }
  ];

  // Generate days for the calendar view
  const generateDaysForMonth = (year: number, month: number) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Create array for days of previous month to fill the first week
    const prevMonthDays = [];
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      prevMonthDays.unshift({
        day: daysInPrevMonth - i,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false
      });
    }

    // Create array for days of current month
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }

    // Create array for days of next month to fill the last week
    const nextMonthDays = [];
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
    const daysNeeded = Math.ceil(totalDaysDisplayed / 7) * 7 - totalDaysDisplayed;

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;

    for (let i = 1; i <= daysNeeded; i++) {
      nextMonthDays.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Navigate to previous month in calendar view
  const goToPrevMonth = () => {
    const newDate = new Date(currentMonthView);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonthView(newDate);
  };

  // Navigate to next month in calendar view
  const goToNextMonth = () => {
    const newDate = new Date(currentMonthView);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonthView(newDate);
  };

  // Decrement the year by 1
  const goToPrevYear = () => {
    const year = dateRange.endDate.getFullYear();
    const newStartDate = new Date(dateRange.startDate!);
    newStartDate.setFullYear(year - 1);
    setDateRange({ startDate: newStartDate, endDate: dateRange.startDate! });
  }

  const goToNextYear = () => {
    const year = dateRange.endDate.getFullYear();
    if (year >= new Date().getFullYear()) {
      // The year is at the current year, prevent going forward
      return;
    }

    // Increment the year by 1
    const newEndDate = new Date(dateRange.startDate!);
    newEndDate.setFullYear(dateRange.endDate.getFullYear() + 1);
    setDateRange({ startDate: dateRange.endDate, endDate: newEndDate });
  }

  // Handle year selection
  const handleYearClick = (year: number) => {
    if (viewMode === 'year') {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      setDateRange({
        startDate,
        endDate
      });
    } else {
      setViewMode('month');
    }
  };

  // Handle month selection
  const handleMonthClick = (month: number) => {
    if (viewMode === 'month') {
      const startDate = new Date(dateRange.endDate.getFullYear(), month, 1);
      const endDate = new Date(dateRange.endDate.getFullYear(), month + 1, 0);
      setDateRange({
        startDate,
        endDate
      });
    } else {
      setCurrentMonthView(new Date(dateRange.endDate.getFullYear(), month));
      setViewMode('custom');
    }
  };

  // Handle day selection in the date picker
  const handleDayClick = (day: number, month: number, year: number) => {
    const clickedDate = new Date(year, month, day);

    if (dateRange.startDate !== dateRange.endDate) {
      // If both dates are selected, start a new selection
      setDateRange({
        startDate: clickedDate,
        endDate: clickedDate
      });
    } else {
      // If start date is already selected, set the end date
      if (clickedDate < dateRange.startDate!) {
        setDateRange({
          startDate: clickedDate,
          endDate: dateRange.startDate!
        });
      } else {
        setDateRange({
          startDate: dateRange.startDate,
          endDate: clickedDate
        });
      }
    }
  };

  // Handle "Set" button click
  const handleSetClick = () => {
    if (dateRange.startDate) {
      onDateRangeChange({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate || dateRange.startDate
      });
    }
  };

  // Format the selected range for display
  const formatSelectedRange = () => {
    if (!dateRange.startDate) return 'Select a time period';

    if (viewMode === 'year' && dateRange.startDate) {
      return dateRange.startDate.getFullYear().toString();
    } else if (viewMode === 'month' && dateRange.startDate) {
      return dateRange.startDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    } else if (dateRange.startDate && dateRange.endDate) {
      return `${dateRange.startDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })} - ${dateRange.endDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (dateRange.startDate) {
      return dateRange.startDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return 'Select a time period';
  };

  // Render the appropriate picker based on view mode
  const renderPicker = () => {
    if (viewMode === 'year') {
      return (
        <div className={styles.yearPicker}>
          <div className={styles.yearGrid}>
            {generateYears().map(year => (
              <button
                key={year}
                className={`${styles.yearButton} ${year === dateRange.endDate.getFullYear() ? styles.selected : ''}`}
                onClick={() => handleYearClick(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      );
    } else if (viewMode === 'month') {
      return (
        <div className={styles.monthPicker}>
          <div className={styles.monthNavigator}>
            <button className={styles.navButton} onClick={() => {
              goToPrevYear();
            }}>
              &lt; {/* Left arrow */}
            </button>
            <div className={styles.yearDisplay}>{dateRange.endDate.getFullYear()}</div>
            <button className={styles.navButton} onClick={() => {
              goToNextYear();
            }}>
              &gt; {/* Right arrow */}
            </button>
          </div>
          <div className={styles.monthGrid}>
            {months.map(month => (
              <button
                key={month.name}
                className={`${styles.monthButton} ${dateRange.endDate.getMonth() === month.value ? styles.selected : ''}`}
                onClick={() => handleMonthClick(month.value)}
              >
                {month.name}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      // Calendar view for custom date selection
      if (!dateRange.startDate) {
        setDateRange({
          startDate: new Date(),
          endDate: new Date()
        })
      }

      const days = generateDaysForMonth(
        currentMonthView.getFullYear(),
        currentMonthView.getMonth()
      );

      return (
        <div className={styles.calendarPicker}>
          <div className={styles.monthNavigator}>
            <button className={styles.navButton} onClick={goToPrevMonth}>
              &lt; {/* Left arrow */}
            </button>
            <div className={styles.monthYearDisplay}>
              {currentMonthView.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button className={styles.navButton} onClick={goToNextMonth}>
              &gt; {/* Right arrow */}
            </button>
          </div>

          <div className={styles.weekdayLabels}>
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className={styles.calendarGrid}>
            {days.map((day, index) => {
              const date = new Date(day.year, day.month, day.day);
              const isSelected =
                date >= dateRange.startDate! &&
                date <= dateRange.endDate;

              const isStart =
                dateRange.startDate &&
                date.getDate() === dateRange.startDate.getDate() &&
                date.getMonth() === dateRange.startDate.getMonth() &&
                date.getFullYear() === dateRange.startDate.getFullYear();

              const isEnd =
                dateRange.endDate &&
                date.getDate() === dateRange.endDate.getDate() &&
                date.getMonth() === dateRange.endDate.getMonth() &&
                date.getFullYear() === dateRange.endDate.getFullYear();

              return (
                <button
                  key={index}
                  className={`
                    ${styles.dayButton} 
                    ${!day.isCurrentMonth ? styles.otherMonth : ''} 
                    ${isSelected ? styles.selected : ''} 
                    ${isStart ? styles.startDate : ''} 
                    ${isEnd ? styles.endDate : ''}
                  `}
                  onClick={() => handleDayClick(day.day, day.month, day.year)}
                >
                  {day.day}
                </button>
              );
            })}
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.dateFilter}>
      <div className={styles.datePickerHeader}>
        <span>Project start date</span>
        <span className={styles.headerIcon}>−</span>
      </div>

      <div className={styles.datePickerContent}>
        <div className={styles.dateDisplay}>
          <span>{formatSelectedRange()}</span>
          <button
            className={styles.setButton}
            disabled={!dateRange.startDate}
            onClick={handleSetClick}
          >
            Set
          </button>
        </div>

        <div className={styles.viewModeSelector}>
          <button
            className={`${styles.modeButton} ${viewMode === 'year' ? styles.active : ''}`}
            onClick={() => setViewMode('year')}
          >
            Year
          </button>
          <button
            className={`${styles.modeButton} ${viewMode === 'month' ? styles.active : ''}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
          <button
            className={`${styles.modeButton} ${viewMode === 'custom' ? styles.active : ''}`}
            onClick={() => setViewMode('custom')}
          >
            Custom
          </button>
        </div>

        {renderPicker()}
      </div>
    </div>
  );
};

export default DateFilter;
export { type DateRange }
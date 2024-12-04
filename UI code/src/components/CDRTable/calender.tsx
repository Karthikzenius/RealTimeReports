import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../CDRTable/calender.scss";
interface Calendarfilterdata {
  startDate: Date | null;
  EndDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  // onFilterClick: void=>()
}

const Calendar: React.FC<Calendarfilterdata> = ({
  startDate,
  setStartDate,
  EndDate,
  setEndDate,
  // onFilterClick
}) => {
  return (
    <div className="calendar-container">
      <DatePicker
        selected={startDate || undefined}
        onChange={(date: Date | null) => setStartDate(date)}
        selectsStart
        startDate={startDate || undefined}
        endDate={EndDate || undefined}
        inline
        monthsShown={1}
        calendarStartDay={0}
        placeholderText="Select start date"
      />
      <DatePicker
        selected={EndDate || undefined}
        onChange={(date: Date | null) => setEndDate(date)}
        selectsEnd
        startDate={startDate || undefined}
        endDate={EndDate || undefined}
        minDate={startDate || undefined}
        inline
        monthsShown={1}
        calendarStartDay={0}
        placeholderText="Select end date"
      />
    </div>
  );
};

export default Calendar;

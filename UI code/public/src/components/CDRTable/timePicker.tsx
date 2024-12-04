import React, { useState } from "react";
import "./timepicker.scss";

interface TimePickerProps {
  onTimeSelect: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onTimeSelect }) => {
  const [timepickerPopup, setTimePickerPopup] = useState(false);
  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const openTimePickerPopup = () => {
    setTimePickerPopup(!timepickerPopup);
  };

  const handleHourSelect = (hour: number) => {
    const newHour = hour.toString().padStart(2, "0");
    setSelectedHour(newHour);
    onTimeSelect(`${newHour}:${selectedMinute}`);
  };

  const handleMinuteSelect = (minute: number) => {
    const newMinute = minute.toString().padStart(2, "0");
    setSelectedMinute(newMinute);
    onTimeSelect(`${selectedHour}:${newMinute}`);
  };

  return (
    <div className="timepickermain-container">
      <div className="insidetimepicker-container">
        <div className="input-timepicker" onClick={openTimePickerPopup}>
          <input
            type="text"
            value={`${selectedHour}:${selectedMinute}`}
            readOnly
          />
          <i className="fa-regular fa-clock clockicon"></i>
        </div>
        {timepickerPopup && (
          <div className="timepickerlist-container">
            <div className="hour-container">
              <ul>
                {Array.from({ length: 24 }, (_, i) => (
                  <li key={i} onClick={() => handleHourSelect(i)}>
                    {i.toString().padStart(2, "0")}
                  </li>
                ))}
              </ul>
            </div>
            <div className="minute-container">
              <ul>
                {Array.from({ length: 60 }, (_, i) => (
                  <li key={i} onClick={() => handleMinuteSelect(i)}>
                    {i.toString().padStart(2, "0")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;

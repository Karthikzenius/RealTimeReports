import React, { useState, useEffect } from "react";
import "../RealtimeMetricsTable/Metrics.scss";

interface SelectedOption {
  onSelectionChange: (metricselectedItems: string[]) => void;
  initiallySelectedMetrics: string[];
}

const Queueperformancemertics = ({
  onSelectionChange,
  initiallySelectedMetrics,
}: SelectedOption) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [openPerformanceMetrics, setOpenPerformanceMetrics] = useState(true);
  const [performanceSelectedItems, setPerformanceSelectedItems] = useState<
    string[]
  >(
    initiallySelectedMetrics.filter((item) =>
      [
        "Queue",
        "DestinationNumber",
        "UUID",
        "CallerId",
        "AnswerTime",
        "Direction",
        "Duration",
        "SipCallId",
        "EndTime",
        "StartTime",
        "billsec",
      ].includes(item)
    )
  );

  const CDRMetricsItems = [
    "Queue",
    "DestinationNumber",
    "UUID",
    "CallerId",
    "AnswerTime",
    "Direction",
    "Duration",
    "SipCallId",
    "EndTime",
    "StartTime",
    "billsec",
  ];

  const performanceHandleCheckboxChange = (item: string) => {
    const newSelectedItems = performanceSelectedItems.includes(item)
      ? performanceSelectedItems.filter((i) => i !== item)
      : [...performanceSelectedItems, item];
    setPerformanceSelectedItems(newSelectedItems);
  };

  useEffect(() => {
    onSelectionChange([...performanceSelectedItems]);
  }, [performanceSelectedItems, onSelectionChange]);

  const filteredPerformanceItems = CDRMetricsItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOpenPerformanceMetrics = () => {
    setOpenPerformanceMetrics(!openPerformanceMetrics);
  };

  return (
    <div className="agent-fileds">
      {/* Performance */}
      <div className="Contact-content">
        <div
          className="contact-chevronicon"
          onClick={toggleOpenPerformanceMetrics}
        >
          <h5>CDR-Metrics</h5>
          <i
            className={`fa-solid ${
              openPerformanceMetrics ? "fa-chevron-up" : "fa-chevron-down"
            } chevron-dropdown-icon`}
          ></i>
        </div>
        {openPerformanceMetrics && (
          <div className="open-content">
            {filteredPerformanceItems.map((item) => (
              <div key={item} className="AgentSearch-item">
                <input
                  type="checkbox"
                  id={item}
                  className="performance-checkbox"
                  checked={performanceSelectedItems.includes(item)}
                  onChange={() => performanceHandleCheckboxChange(item)}
                />
                <label htmlFor={item}>{item}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queueperformancemertics;

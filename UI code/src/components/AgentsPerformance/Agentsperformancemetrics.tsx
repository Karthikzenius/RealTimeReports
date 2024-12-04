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
        "Inbound",
        "Answered",
        "NoAnswered",
        "AHT",
        "Answerrate",
        // "Outbound",
        // "Answered",
        // "NoAswered",
        // "AHT",
        // "Answerrate",
        "Queues",
      ].includes(item)
    )
  );

  const performanceItems = [
    "Inbound",
    "Answered",
    "NoAnswered",
    "AHT",
    "Answerrate",
    // "Outbound",
    // "Answered",
    // "NoAswered",
    // "AHT",
    // "Answerrate",
    "Queues",
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

  const filteredPerformanceItems = performanceItems.filter((item) =>
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
          <h5>Performance</h5>
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

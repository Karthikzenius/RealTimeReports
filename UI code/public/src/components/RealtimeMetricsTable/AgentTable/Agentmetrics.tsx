import React, { useState, useEffect } from "react";
import "../../RealtimeMetricsTable/Metrics.scss";

interface SelectedOption {
  onSelectionChange: (metricselectedItems: string[]) => void;
  initiallySelectedMetrics: string[];
}

const Agentmetrics = ({
  onSelectionChange,
  initiallySelectedMetrics,
}: SelectedOption) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openAgentMetrics, setOpenAgentMetrics] = useState(true);
  const [agentSelectedItems, setAgentSelectedItems] = useState<string[]>(
    initiallySelectedMetrics.filter((item) =>
      ["Activity", "Duration", "Capacity"].includes(item)
    )
  );

  const [openContactMetrics, setOpenContactMetrics] = useState(false);
  const [contactSelectedItems, setContactSelectedItems] = useState<string[]>(
    initiallySelectedMetrics.filter((item) =>
      ["Availability", "Contact State", "Duration", "Queue"].includes(item)
    )
  );

  const [openPerformanceMetrics, setOpenPerformanceMetrics] = useState(false);
  const [performanceSelectedItems, setPerformanceSelectedItems] = useState<
    string[]
  >(
    initiallySelectedMetrics.filter((item) =>
      ["Abandoned", "Handled In", "LCHT"].includes(item)
    )
  );

  // Metrics
  const agentItems = ["Activity", "Duration", "Capacity"];

  const contactItems = [
    // "Active",
    "Availability",
    "Contact State",
    "Duration",
    "Queue",
  ];

  const performanceItems = ["Abandoned", "Handled In", "LCHT"];

  const agentHandleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const agentHandleCheckboxChange = (item: string) => {
    const newSelectedItems = agentSelectedItems.includes(item)
      ? agentSelectedItems.filter((i) => i !== item)
      : [...agentSelectedItems, item];
    setAgentSelectedItems(newSelectedItems);
  };

  const contactHandleCheckboxChange = (item: string) => {
    const newSelectedItems = contactSelectedItems.includes(item)
      ? contactSelectedItems.filter((i) => i !== item)
      : [...contactSelectedItems, item];
    setContactSelectedItems(newSelectedItems);
  };

  const performanceHandleCheckboxChange = (item: string) => {
    const newSelectedItems = performanceSelectedItems.includes(item)
      ? performanceSelectedItems.filter((i) => i !== item)
      : [...performanceSelectedItems, item];
    setPerformanceSelectedItems(newSelectedItems);
  };

  useEffect(() => {
    onSelectionChange([
      ...agentSelectedItems,
      ...contactSelectedItems,
      ...performanceSelectedItems,
    ]);
  }, [
    agentSelectedItems,
    contactSelectedItems,
    performanceSelectedItems,
    onSelectionChange,
  ]);

  const filteredAgentItems = agentItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContactItems = contactItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPerformanceItems = performanceItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOpenAgentMetrics = () => {
    setOpenAgentMetrics(!openAgentMetrics);
  };

  const toggleOpenContactMetrics = () => {
    setOpenContactMetrics(!openContactMetrics);
  };

  const toggleOpenPerformanceMetrics = () => {
    setOpenPerformanceMetrics(!openPerformanceMetrics);
  };

  return (
    <div>
      <div className="agent-fileds">
        <div className="agent-chevronicon" onClick={toggleOpenAgentMetrics}>
          <h5>Agents</h5>
          <i
            className={`fa-solid ${
              openAgentMetrics ? "fa-chevron-up" : "fa-chevron-down"
            } chevron-dropdown-icon`}
          ></i>
        </div>
        {openAgentMetrics && (
          <div className="open-content">
            {filteredAgentItems.map((item) => (
              <div key={item} className="AgentSearch-item">
                <input
                  type="checkbox"
                  id={item}
                  className="agent-checkbox"
                  checked={agentSelectedItems.includes(item)}
                  onChange={() => agentHandleCheckboxChange(item)}
                />
                <label htmlFor={item}>{item}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Contacts */}
      <div className="Contact-content">
        <div className="contact-chevronicon" onClick={toggleOpenContactMetrics}>
          <h5>Contacts</h5>
          <i
            className={`fa-solid ${
              openContactMetrics ? "fa-chevron-up" : "fa-chevron-down"
            } chevron-dropdown-icon`}
          ></i>
        </div>
        {openContactMetrics && (
          <div className="open-content">
            {filteredContactItems.map((item) => (
              <div key={item} className="AgentSearch-item">
                <input
                  type="checkbox"
                  id={item}
                  className="contact-checkbox"
                  checked={contactSelectedItems.includes(item)}
                  onChange={() => contactHandleCheckboxChange(item)}
                />
                <label htmlFor={item}>{item}</label>
              </div>
            ))}
          </div>
        )}
      </div>
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

export default Agentmetrics;

import React from "react";
import "../AgentTable/AgentTable.scss";
// import agentcustomerdata from "../CustomerData";
import { useState, useEffect } from "react";
import Pagination from "../../Pagination/Pagination";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
// import Data from "../SearchData";
import Agentmetrics from "../AgentTable/Agentmetrics";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SharingOption from "../../CDRTable/SharingOption";

const AgentTable = () => {
  const [agentplay, setAgentplay] = useState(true);
  const [puse, setpuse] = useState(false);
  const [Agentsettingpopup, setAgentSettingpopup] = useState(false);
  const [Agentdata, setData] = useState([]);
  const [AgentcurrentPage, setAgentCurrentPage] = useState(1);
  const [AgentpostsPerPage] = useState(5);
  const [Agentcounter, setCounter] = useState(1);
  const [AgentshowparPage, setAgentShowparPage] = useState(5);
  const [agentquery, setAgentQuery] = useState("");
  // const [agentfilteredData, setAgebtFilteredData] = useState(Data);
  const [agentpaginition, setAgentPaginition] = useState({
    start: 0,
    end: AgentshowparPage,
  });
  const [agentsearchpopup, setAgentSearchpopup] = useState(false);
  const [agentradiobutton, setAgentRadiobutton] = useState(true);
  const [agenttimezone, setAgentTimezone] = useState(false);
  const [agenttopping, setAgentTopping] = useState(true);
  const [groupigtopping, setAgentGroupigTopping] = useState(true);
  const [routingtopping, setAgentRoutingTopping] = useState(false);
  const [agentgroupSelection, setAgentGroupSelection] = useState("Queues");
  const [agentactiveIndex, setAgentActiveIndex] = useState(0);
  const [agentgroupingsection, setAgentGroupingsection] = useState(false);
  const [agentTimerangesection, setAgentTimerangesection] = useState(true);
  const [agentfiltersection, setAgentFilterSection] = useState(true);
  const [agentmetricssection, setAgentMetricsSection] = useState(false);
  const [agentfilterpopup, setAgentFilteringPopup] = useState(false);
  const [agentselectedoption, SetAgentSelectedOption] = useState("Agents");
  const [agentactionpopup, setAgentActionpopup] = useState(false);
  const [agentsearchTerm, setAgentSearchTerm] = useState("");
  const [agentselectedItems, setAgentSelectedItems] = useState<string[]>([]);
  const [agentsearchDropdown, setAgentSearchDropdown] = useState(false);
  const [agentfilterroutingqueue, setAgentFileterRotingQueue] = useState(false);
  const [agentRoutingProfilepopup, setAgentRoutingProfilepopup] =
    useState(false);
  const [agentQueuepopup, setAgentQueuepopup] = useState(true);
  const [agentChannelpopup, setAgentChannelpopup] = useState(false);
  const [isediting, setIsEditing] = useState(false);
  const [changeAgentName, setchangeAgentName] = useState("Agents");
  const [agenttempSelectedItems, setAgentTempSelectedItems] = useState<
    string[]
  >([]);

  const indexOfLastPost = AgentcurrentPage * AgentpostsPerPage;
  const indexOfFirstPost = indexOfLastPost - AgentpostsPerPage;
  const currentPosts = Agentdata.slice(indexOfFirstPost, indexOfLastPost);

  const [agentselectedMetrics, setAgentSelectedMetrics] = useState<string[]>(
    []
  );
  const [agentsettingPopup, setAgentSettingPopup] = useState(false);
  const [agentcurrentTime, setAgentCurrentTime] = useState(new Date());
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [agentcustomerdata, setAgentCustomerdata] = useState([]);
  const [agentitems, setAgentitems] = useState<string[]>([]);
  const [filtertimerange, setFiltertimerRange] = useState(2);
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [openSharingPopup, setOpenSharingPopup] = useState(false);

  const backRealtimeMetrics = () => {
    navigate("../Real-timemetrics");
  };
  // =============================================================
  const fetchData = () => {
    fetch("http://10.16.7.113:4000/api/Realtime-AgentsMetrics-Data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAgentCustomerdata(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =================================================================
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (agentplay) {
      interval = setInterval(() => {
        setAgentCurrentTime(new Date());
        agenttriggerRefreshAnimation();
        fetchData();
      }, 6000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [agentplay]);

  const agentPlayPauseClick = () => {
    setAgentplay((prevPlay) => !prevPlay);
    if (!agentplay) {
      setAgentCurrentTime(new Date());
    }
  };

  const agentEditClick = () => {
    console.log("click on edite");
    setIsEditing(true);
  };

  const agentInputChange = (e: any) => {
    setchangeAgentName(e.target.value);
  };

  const agentInputBlur = () => {
    setIsEditing(false);
  };
  const agentSaveClick = () => {
    setIsEditing(false);
  };

  const agentFormatTime = (time: Date) => {
    return time.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  };

  const agenttriggerRefreshAnimation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  const [appliedAgnetMetrics, setAppliedAgnetMetrics] = useState<string[]>([
    "Name",
    "Type",
    "Activity",
    "Duration",
    "Capacity",
    "Availability",
    "Contact State",
    "Duration",
    "Queue",
    "Avg ACW",
    "Abandoned",
    "Handled In",
    "LCHT",
    // "Answerrate",
  ]);

  const agentCloseSettingPopup = () => {
    setAgentSettingPopup(false);
  };

  const agentMetricSelectionChange = (selectedItems: string[]) => {
    console.log("logs in the handleMetricSelectionChange", selectedItems);
    setAgentSelectedMetrics(selectedItems);
  };

  const AgentsMetrics = ["Activity", "Duration", "Capacity"];
  const AgentscontactMetrics = [
    "Availability",
    "Contact State",
    "Duration",
    "Queue",
  ];
  const AgentsperformanceMetrics = [
    "ACW",
    "Abandoned",
    "Handled In",
    "LCHT",
    // "Answerrate",
  ];

  const toggleShareOptions = () => {
    setShareOptionsVisible(true);
    setOpenSharingPopup(true);
  };

  const closeSharingPopup = () => {
    setOpenSharingPopup(false);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(agentcustomerdata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");
    XLSX.writeFile(workbook, "AgentReports.xlsx");
  };

  // ========================================================================
  const handleDownload = () => {
    const AgentName = `${changeAgentName}`;
    const headers = ["Name"];
    if (appliedAgnetMetrics.includes("Type")) headers.push("Type");
    if (appliedAgnetMetrics.includes("Activity")) headers.push("Status");
    if (appliedAgnetMetrics.includes("Duration"))
      headers.push("Statusduration");
    if (appliedAgnetMetrics.includes("Capacity")) headers.push("Capacity");
    if (appliedAgnetMetrics.includes("Availability"))
      headers.push("Availability");
    if (appliedAgnetMetrics.includes("Contact State"))
      headers.push("contact_state");
    if (appliedAgnetMetrics.includes("Duration"))
      headers.push("Contact_state_Duration");
    if (appliedAgnetMetrics.includes("Queue")) headers.push("Queue");
    if (appliedAgnetMetrics.includes("ACW")) headers.push("ACW");
    if (appliedAgnetMetrics.includes("Abandoned"))
      headers.push("Agent_non_response");
    if (appliedAgnetMetrics.includes("Handled In"))
      headers.push("Calls_handled");
    if (appliedAgnetMetrics.includes("LCHT")) headers.push("LCHT");
    // if (appliedAgnetMetrics.includes("Answerrate")) headers.push("answer_rate");

    const data = [
      { Name: `${AgentName}` },
      headers.reduce((acc, header) => ({ ...acc, [header]: header }), {}),
      ...(agentFilteredCustomerData.length > 0
        ? agentFilteredCustomerData
        : agentcustomerdata
      ).map((item: any) => {
        const result: { [key: string]: string | number | undefined } = {
          Name: item.Name,
        };
        if (appliedAgnetMetrics.includes("Type")) result.Type = item.Type;
        if (appliedAgnetMetrics.includes("Activity"))
          result.Status = item.Status;
        if (appliedAgnetMetrics.includes("Duration"))
          result.Statusduration = item.Statusduration;
        if (appliedAgnetMetrics.includes("Capacity"))
          result.Capacity = item.Capacity;
        if (appliedAgnetMetrics.includes("Availability"))
          result.Availability = item.Availability;
        if (appliedAgnetMetrics.includes("Contact State"))
          result.contact_state = item.contact_state;
        if (appliedAgnetMetrics.includes("Duration"))
          result.Contact_state_Duration = item.Contact_state_Duration;
        if (appliedAgnetMetrics.includes("Queue")) result.Queue = item.Queue;
        if (appliedAgnetMetrics.includes("ACW")) result.ACW = item.ACW;
        if (appliedAgnetMetrics.includes("Abandoned"))
          result.Agent_non_response = item.Agent_non_response;
        if (appliedAgnetMetrics.includes("Handled In"))
          result.Calls_handled = item.Calls_handled;

        if (appliedAgnetMetrics.includes("LCHT")) result.LCHT = item.LCHT;
        // if (appliedAgnetMetrics.includes("Answerrate"))
        //   result.answer_rate = item.answer_rate;
        return result;
      }),
    ];

    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    const csv = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "RealtimeMetricsAgents.csv");
  };

  const agentApplyMetrics = () => {
    console.log("selectedMetrics", agentselectedMetrics);
    setAppliedAgnetMetrics(agentselectedMetrics);
    setAgentSettingpopup(false);
  };

  useEffect(() => {
    // console.log("Customer Data:", agentcustomerdata);
  }, [agentcustomerdata]);

  const agentSearchChange = (event: any) => {
    setAgentSearchTerm(event.target.value);
  };

  const RemoveItems = (item: any) => {
    setAgentTempSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((i) => i !== item)
    );
  };

  const agentCheckboxChange = (item: any) => {
    setAgentTempSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };

  const RemoveItemsALL = () => {
    setAgentTempSelectedItems([]);
    setAgentSearchTerm("");
  };

  const agentFilteredItems = agentitems.filter(
    (item) => item && item.toLowerCase().includes(agentsearchTerm.toLowerCase())
  );

  const agenttoggleDropdown = () => {
    setAgentSearchDropdown((prevSearchDropdown) => !prevSearchDropdown);
  };

  const AgentFilterApplying = () => {
    setAgentSelectedItems(agenttempSelectedItems);
    setAgentSettingpopup(false);
    setAgentSearchDropdown(false);
  };

  const agentFilteredCustomerData = agentcustomerdata.filter(
    (item: any) =>
      agentselectedItems.length === 0 || agentselectedItems.includes(item.Name)
  );
  // .slice(agentpaginition.start, agentpaginition.end);

  useEffect(() => {
    const updatedItems = agentcustomerdata.map((item: any) => item.Name);
    setAgentitems(updatedItems);
  }, [agentcustomerdata]);
  // ========================================

  const Routingagentqueue = [
    "Zenius_Queue",
    "11testqueueroutingprofile",
    "Admin_Q ",
    "VHOC-1",
    "HVOC -RP",
    "OpenCTI_TETH",
    "PRIYA-HVOC",
    "Priya-Tethere",
    "test",
    "TETHRED-MAB",
    "Zenius_TestQueue",
  ];
  useEffect(() => {
    const value = AgentshowparPage * Agentcounter;
    agentpaginationChange(value - AgentshowparPage, value);
  }, [Agentcounter, AgentshowparPage]);

  const RoutingAgentTotoggleDropdown = () => {
    setAgentFileterRotingQueue(!agentfilterroutingqueue);
  };

  const RoutingQueueagentCheckboxChange = (RoutingQueus: any) => {
    setAgentTempSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(RoutingQueus)
        ? prevSelectedItems.filter((i) => i !== RoutingQueus)
        : [...prevSelectedItems, RoutingQueus]
    );
  };

  const RoutingQueueAgentfilteredItems = Routingagentqueue.filter(
    (Routingagentqueue) =>
      Routingagentqueue.toLowerCase().includes(agentsearchTerm.toLowerCase())
  );

  const agentpaginationChange = (a: any, b: any) => {
    setAgentPaginition({ start: a, end: b });
  };

  const agentshowPerPageHandler = (val: any) => {
    console.log("getting value in show per page", val);
    setAgentShowparPage(val);
  };

  const OpenAgentSettingpopup = () => {
    setAgentSettingpopup(true);
  };

  const CloseAgentSettingpopup = () => {
    setAgentSettingpopup(false);
  };

  const agenthandleClick = (index: any) => {
    setAgentActiveIndex(index);
    switch (index) {
      case 0:
        agentHandleFileterSection();
        break;
      case 1:
        agentHandleMetricsSection();
        break;
      default:
        break;
    }
  };

  const agentHandleFileterSection = () => {
    setAgentFilterSection(true);

    setAgentMetricsSection(false);
  };

  const agentHandleMetricsSection = () => {
    setAgentMetricsSection(true);

    setAgentFilterSection(false);
  };

  const OpenAgentFilteringPopup = () => {
    setAgentFilteringPopup(!agentfilterpopup);
    setAgentFileterRotingQueue(false);
    setAgentSearchDropdown(false);
  };
  const CloseAgentFilteringPopup = () => {
    setAgentFilteringPopup(false);
  };

  const OpenAgentActionPopup = () => {
    setAgentActionpopup(!agentactionpopup);
  };

  const agentSelectedFilterOption = (option: any) => {
    SetAgentSelectedOption(option);
    if (option === "Agents") {
      setAgentQueuepopup(true);
      setAgentRoutingProfilepopup(false);

      console.log("after queue selection", agentQueuepopup);
    } else if (option === "Routing Profiles") {
      setAgentQueuepopup(false);
      setAgentRoutingProfilepopup(true);

      console.log("after routing selection", agentRoutingProfilepopup);
    }
  };

  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="title-container">
          <h2>Real-time Metrics</h2>
          <div className="title-rightsidecontent">
            <div className="update-timecontent">
              <p>Last Update: {agentFormatTime(agentcurrentTime)}</p>
            </div>

            <div className="play-Icon" onClick={agentPlayPauseClick}>
              <i
                className={`fa-solid ${
                  agentplay ? "fa-pause" : "fa-play"
                } PalyIcon`}
              ></i>
            </div>

            <div className="refresh-icon">
              <i
                className={`fa-solid fa-rotate-right ${
                  isloading ? "icon-loading" : ""
                }`}
              ></i>
            </div>

            <div className="action-dropdownmain" onClick={OpenAgentActionPopup}>
              <input
                type="text"
                name="select"
                placeholder="Actions"
                className="Action-dropdown"
              ></input>
              <div className="actiondropdown-icon">
                <i
                  className={`fa-solid ${
                    agentactionpopup ? "fa-caret-up" : "fa-caret-down"
                  } actiondropdownicon`}
                ></i>
              </div>
              {agentactionpopup && (
                <div
                  className="Actionlist-content"
                  onClick={CloseAgentFilteringPopup}
                >
                  <ul>
                    <li onClick={backRealtimeMetrics}>Clear</li>

                    <li onClick={handleDownload}>Download CVS</li>

                    <li onClick={toggleShareOptions}>Share reports</li>
                  </ul>
                </div>
              )}
            </div>

            <button
              className="button-26"
              role="button"
              onClick={handleDownloadExcel}
            >
              Save report
            </button>
          </div>
        </div>
        <SharingOption
          openSharingPopup={openSharingPopup}
          shareOptionsVisible={shareOptionsVisible}
          closeSharingPopup={closeSharingPopup}
        />
        <div className="table-headingcontainer">
          <div className="Table_namecontainer">
            <div className="queue-edit">
              {isediting ? (
                <input
                  type="text"
                  value={changeAgentName}
                  onChange={agentInputChange}
                  onBlur={agentInputBlur}
                  autoFocus
                  className="Queue-editinput"
                />
              ) : (
                <h5>{changeAgentName}</h5>
              )}
              {isediting ? (
                <i
                  className="fa-solid fa-floppy-disk save-icon"
                  onClick={agentSaveClick}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-pen edit-icon"
                  onClick={agentEditClick}
                ></i>
              )}
            </div>
          </div>
          <div className="Table-rightsidecontent">
            <p className="time-range">Time range: updating every 6 seconds</p>

            <i
              className="fa-solid fa-gear settingicon"
              onClick={OpenAgentSettingpopup}
            ></i>
          </div>
          {/* agentsettingpopup here */}
          {Agentsettingpopup && (
            <div className="setting-popup">
              <div className="insidesetting-popup">
                <h2>Table Settings</h2>
                <i
                  className="fa-solid fa-x closeicon "
                  onClick={CloseAgentSettingpopup}
                ></i>
              </div>
              <div className="list-component">
                {["Filters", "Metrics"].map((item, index) => (
                  <div
                    key={index}
                    className={`list-item ${
                      index === agentactiveIndex ? "active" : ""
                    }`}
                    onClick={() => agenthandleClick(index)}
                  >
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              {/* Filter section */}
              {agentfiltersection && (
                <div className="filter-section">
                  <div className="insidefilter-section">
                    <p>
                      The setting will determine the main rows (primary
                      grouping) in the table.
                    </p>

                    <p className="filtering">Filter primary groupings by</p>
                    <div className="filtering-content">
                      <input
                        type="text"
                        name="search"
                        className="filtering-input"
                        value={agentselectedoption}
                        onClick={OpenAgentFilteringPopup}
                      ></input>
                      <div
                        className="dropdown-icon"
                        onClick={OpenAgentFilteringPopup}
                      >
                        <i
                          className={`fa-solid ${
                            agentfilterpopup ? "fa-caret-up" : "fa-caret-down"
                          } dropdownicon`}
                        ></i>
                      </div>
                    </div>
                    {agentfilterpopup && (
                      <div
                        className="list-content"
                        onClick={CloseAgentFilteringPopup}
                      >
                        <ul>
                          <li
                            onClick={() => agentSelectedFilterOption("Agents")}
                          >
                            Agents
                          </li>
                          <li
                            onClick={() =>
                              agentSelectedFilterOption("Routing Profiles")
                            }
                          >
                            Routing Profiles
                          </li>
                        </ul>
                      </div>
                    )}
                    <div className="App">
                      {agentQueuepopup && (
                        <div className="includesearch-maincontent">
                          <p>Include</p>
                          <div
                            className="includesearch-insidecontent"
                            onClick={agenttoggleDropdown}
                          >
                            <div className="Search-icon">
                              <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                            <input
                              type="text"
                              placeholder="Search"
                              value={agentsearchTerm}
                              onChange={agentSearchChange}
                            />
                            <div
                              className="close-icon"
                              onClick={() => RemoveItemsALL()}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                          <div className="selected-items">
                            {agenttempSelectedItems.map((item) => (
                              <div key={item} className="selected-item">
                                {item}
                                <i
                                  className="fa-solid fa-xmark remove-icon"
                                  onClick={() => RemoveItems(item)}
                                ></i>
                              </div>
                            ))}
                          </div>
                          {agentsearchDropdown && (
                            <div className="search-selectoptions">
                              {/* {agentFilteredItems.map((item) => (
                                <div key={item} className="Search-item">
                                  <input
                                    type="checkbox"
                                    id={item}
                                    className="checkboxs"
                                    checked={agenttempSelectedItems.includes(
                                      item
                                    )}
                                    onChange={() => agentCheckboxChange(item)}
                                  />
                                  <label htmlFor={item}>{item}</label>
                                </div>
                              ))} */}
                              {agentFilteredItems.length > 0 ? (
                                agentFilteredItems.map((item) => (
                                  <div key={item} className="Search-item">
                                    <input
                                      type="checkbox"
                                      id={item}
                                      className="checkboxs"
                                      checked={agenttempSelectedItems.includes(
                                        item
                                      )}
                                      onChange={() => agentCheckboxChange(item)}
                                    />
                                    <label htmlFor={item}>{item}</label>
                                  </div>
                                ))
                              ) : (
                                <p className="no_results">No results found</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {agentRoutingProfilepopup && (
                        <div className="includesearch-maincontent">
                          <p>Include</p>
                          <div
                            className="includesearch-insidecontent"
                            onClick={RoutingAgentTotoggleDropdown}
                          >
                            <div className="Search-icon">
                              <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                            <input
                              type="text"
                              placeholder="Search"
                              value={agentsearchTerm}
                              onChange={agentSearchChange}
                            />
                            <div
                              className="close-icon"
                              onClick={() => RemoveItemsALL()}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                          <div className="selected-items">
                            {agentselectedItems.map((RoutingQueus) => (
                              <div key={RoutingQueus} className="selected-item">
                                {RoutingQueus}
                                <i
                                  className="fa-solid fa-xmark remove-icon"
                                  onClick={() => RemoveItems(RoutingQueus)}
                                ></i>
                              </div>
                            ))}
                          </div>
                          {agentfilterroutingqueue && (
                            <div className="search-selectoptions">
                              {RoutingQueueAgentfilteredItems.map(
                                (RoutingQueus) => (
                                  <div
                                    key={RoutingQueus}
                                    className="Search-item"
                                  >
                                    <input
                                      type="checkbox"
                                      id={RoutingQueus}
                                      className="checkboxs"
                                      checked={agenttempSelectedItems.includes(
                                        RoutingQueus
                                      )}
                                      onChange={() =>
                                        RoutingQueueagentCheckboxChange(
                                          RoutingQueus
                                        )
                                      }
                                    />
                                    <label htmlFor={RoutingQueus}>
                                      {RoutingQueus}
                                    </label>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Filter section */}

              {/* Metric section */}
              {agentmetricssection && (
                <div className="metrics-section">
                  <div className="metricsinside-section">
                    <p>Metrics show up as columns of table data.</p>

                    <Agentmetrics
                      onSelectionChange={agentMetricSelectionChange}
                      initiallySelectedMetrics={appliedAgnetMetrics}
                    />
                  </div>
                </div>
              )}

              {/* Metric section */}
              {agentfiltersection && (
                <div className="bottom-content">
                  <div className="bottun-content">
                    <button
                      className="Cancel-btn"
                      onClick={CloseAgentSettingpopup}
                    >
                      Cancel
                    </button>
                    <button className="Apply-btn" onClick={AgentFilterApplying}>
                      Apply
                    </button>
                  </div>
                </div>
              )}
              {agentmetricssection && (
                <div className="bottom-content">
                  <div className="bottun-content">
                    <button
                      className="Cancel-btn"
                      onClick={CloseAgentSettingpopup}
                    >
                      Cancel
                    </button>
                    <button className="Apply-btn" onClick={agentApplyMetrics}>
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-1">
          <div className="table-responsive wrapper-maintable-content-agents">
            {agentFilteredCustomerData.length === 0 ? (
              <p className="NoDatafound">No data found</p>
            ) : (
              <table className="agentmain-table">
                <thead>
                  <tr className="table-header">
                    <th colSpan={1} rowSpan={2} className="headers">
                      Name
                    </th>
                    <th colSpan={1} rowSpan={2} className="headers">
                      Type
                    </th>
                    {appliedAgnetMetrics.some((metric) =>
                      AgentsMetrics.includes(metric)
                    ) && (
                      <th
                        colSpan={
                          AgentsMetrics.filter((metric) =>
                            appliedAgnetMetrics.includes(metric)
                          ).length
                        }
                        className="headers"
                      >
                        Agent
                      </th>
                    )}
                    {appliedAgnetMetrics.some((metric) =>
                      AgentscontactMetrics.includes(metric)
                    ) && (
                      <th
                        colSpan={
                          AgentscontactMetrics.filter((metric) =>
                            appliedAgnetMetrics.includes(metric)
                          ).length
                        }
                        className="headers"
                      >
                        Contacts
                      </th>
                    )}
                    {appliedAgnetMetrics.some((metric) =>
                      AgentsperformanceMetrics.includes(metric)
                    ) && (
                      <th
                        colSpan={
                          AgentsperformanceMetrics.filter((metric) =>
                            appliedAgnetMetrics.includes(metric)
                          ).length
                        }
                        className="headers"
                      >
                        Performance
                      </th>
                    )}
                  </tr>
                  <tr className="table-header">
                    {appliedAgnetMetrics.includes("Activity") && (
                      <th>Activity</th>
                    )}
                    {appliedAgnetMetrics.includes("Duration") && (
                      <th>Duration</th>
                    )}
                    {appliedAgnetMetrics.includes("Capacity") && (
                      <th>Capacity</th>
                    )}
                    {appliedAgnetMetrics.includes("Availability") && (
                      <th>Availability</th>
                    )}
                    {appliedAgnetMetrics.includes("Contact State") && (
                      <th>Contact State</th>
                    )}
                    {appliedAgnetMetrics.includes("Duration") && (
                      <th>Duration</th>
                    )}
                    {appliedAgnetMetrics.includes("Queue") && <th>Queue</th>}
                    {appliedAgnetMetrics.includes("ACW") && <th>ACW</th>}
                    {appliedAgnetMetrics.includes("Abandoned") && (
                      <th>Abandoned</th>
                    )}
                    {appliedAgnetMetrics.includes("Handled In") && (
                      <th>Handled In</th>
                    )}
                    {appliedAgnetMetrics.includes("LCHT") && <th>LCHT</th>}
                    {/* {appliedAgnetMetrics.includes("Answerrate") && (
                      <th>Answerrate(%)</th>
                    )} */}
                  </tr>
                </thead>
                <tbody>
                  {agentFilteredCustomerData
                    .slice(agentpaginition.start, agentpaginition.end)
                    .map((item: any) => (
                      <tr key={item.Name} className="table-body-content">
                        <td className="table-data-name">{item.Name}</td>
                        <td className="table-data-name">{item.Type}</td>
                        {appliedAgnetMetrics.includes("Activity") && (
                          <td>{item.Status}</td>
                        )}
                        {appliedAgnetMetrics.includes("Duration") && (
                          <td>{item.Statusduration}</td>
                        )}
                        {appliedAgnetMetrics.includes("Capacity") && (
                          <td>{item.Capacity}</td>
                        )}
                        {appliedAgnetMetrics.includes("Availability") && (
                          <td>{item.Availability}</td>
                        )}
                        {appliedAgnetMetrics.includes("Contact State") && (
                          <td>{item.contact_state}</td>
                        )}
                        {appliedAgnetMetrics.includes("Duration") && (
                          <td>{item.Contact_state_Duration}</td>
                        )}
                        {appliedAgnetMetrics.includes("Queue") && (
                          <td>{item.Queue}</td>
                        )}
                        {appliedAgnetMetrics.includes("ACW") && (
                          <td>{item.ACW}</td>
                        )}
                        {appliedAgnetMetrics.includes("Abandoned") && (
                          <td>{item.Agent_non_response}</td>
                        )}
                        {appliedAgnetMetrics.includes("Handled In") && (
                          <td>{item.Calls_handled}</td>
                        )}
                        {appliedAgnetMetrics.includes("LCHT") && (
                          <td>{item.LCHT}</td>
                        )}
                        {/* {appliedAgnetMetrics.includes("Answerrate") && (
                        <td>{item.answer_rate}</td>
                      )} */}
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <Pagination
          total={agentcustomerdata.length}
          showparPage={AgentshowparPage}
          counter={Agentcounter}
          setCounter={setCounter}
          paginationChange={agentpaginationChange}
          showPerPageHandler={agentshowPerPageHandler}
        />
      </div>
    </div>
  );
};

export default AgentTable;

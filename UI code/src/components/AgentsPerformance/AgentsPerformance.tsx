import React from "react";
import "../AgentsPerformance/AgentsPerformance.scss";
// import customerdata from "../RealtimeMetricsTable/CustomerData";
import { useState, useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Metrics from "../AgentsPerformance/Agentsperformancemetrics";
import SharingOption from "../CDRTable/SharingOption";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainHeader from "../RealtimeMetricsTable/MainHeader";

const AgentsPerformance = () => {
  const [play, setplay] = useState(true);
  const [settingpopup, setsettingpopup] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [counter, setCounter] = useState(1);
  const [showparPage, setShowparPage] = useState(5);
  const [openSharingPopup, setOpenSharingPopup] = useState(false);
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [paginition, setPaginition] = useState({
    start: 0,
    end: showparPage,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [filtersection, setFilterSection] = useState(true);
  const [metricssection, setMetricsSection] = useState(false);
  const [filterpopup, setFilteringPopup] = useState(false);
  const [selectedoption, SetSelectedOption] = useState("Agents performance");
  const [actionpopup, setActionpopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [filterroutingqueue, setFileterRotingQueue] = useState(false);
  const [RoutingProfilepopup, setRoutingProfilepopup] = useState(false);
  const [Queuepopup, setQueuepopup] = useState(true);
  const [Channelpopup, setChannelpopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [changeAgentName, setchangeAgentName] = useState("Agents performance");
  const [temporarySelectedItems, setTemporarySelectedItems] = useState<
    string[]
  >([]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [customerdata, setcustomerdata] = useState([]);
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backRealtimeMetrics = () => {
    navigate("../Real-timemetrics");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://10.16.7.113:6001/agent");
        setcustomerdata(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = () => {
    console.log("click on edite");
    setIsEditing(true);
  };

  const handleInputChange = (e: any) => {
    setchangeAgentName(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };
  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const [appliedAgnetMetrics, setAppliedAgnetMetrics] = useState<string[]>([
    "Inbound",
    "Answered",
    "NoAnswered",
    "AHT",
    "Answerrate",
    "Outbound",
    "Answered",
    "NoAswered",
    "AHT",
    "Answerrate",
    "Queues",
  ]);

  const handleMetricSelectionChange = (selectedItems: string[]) => {
    console.log("logs in the handleMetricSelectionChange", selectedItems);
    setSelectedMetrics(selectedItems);
  };

  const performanceMetrics = [
    "Inbound",
    "Answered",
    "NoAnswered",
    "AHT",
    "Answerrate",
    "Outbound",
    "Answered",
    "NoAswered",
    "AHT",
    "Answerrate",
    "Queues",
  ];
  const handleDownloadExcel = () => {
    const dataWithQueues = customerdata.map((item: any) => ({
      ...item,
      queues:
        item.queues && item.queues.length > 0 && item.queues[0] !== null
          ? item.queues.join(", ")
          : "null",
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataWithQueues);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");
    XLSX.writeFile(workbook, "AgentPerformance.xlsx");
  };

  // ========================================================================
  const handleDownload = () => {
    const AgentName = `${changeAgentName}`;
    const headers = ["Name"];
    if (appliedAgnetMetrics.includes("Queues")) headers.push("queues");
    if (appliedAgnetMetrics.includes("Inbound")) headers.push("inbound");
    if (appliedAgnetMetrics.includes("Answered"))
      headers.push("answered_inbound");
    if (appliedAgnetMetrics.includes("NoAnswered"))
      headers.push("noanswer_inbound");
    if (appliedAgnetMetrics.includes("AHT")) headers.push("aht_inbound");
    if (appliedAgnetMetrics.includes("Answerrate"))
      headers.push("occupancy_inbound");

    const data = [
      { Name: `${AgentName}` },
      headers.reduce((acc, header) => ({ ...acc, [header]: header }), {}),
      ...(filteredCustomerData.length > 0
        ? filteredCustomerData
        : customerdata
      ).map((item: any) => {
        const result: { [key: string]: string | number | undefined } = {
          Name: item.agent,
        };
        if (appliedAgnetMetrics.includes("Queues")) {
          result.queues =
            item.queues && item.queues.length > 0 && item.queues[0] !== null
              ? item.queues.join(", ")
              : "null";
        }
        if (appliedAgnetMetrics.includes("Inbound"))
          result.inbound = item.inbound;
        if (appliedAgnetMetrics.includes("Answered"))
          result.answered_inbound = item.answered_inbound;
        if (appliedAgnetMetrics.includes("NoAnswered"))
          result.noanswer_inbound = item.noanswer_inbound;
        if (appliedAgnetMetrics.includes("AHT"))
          result.aht_inbound = item.aht_inbound;
        if (appliedAgnetMetrics.includes("Answerrate"))
          result.occupancy_inbound = item.occupancy_inbound;

        return result;
      }),
    ];

    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    const csv = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "RealtimeAgentsperformance.csv");
  };

  // ========================================================================

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

  const OpenAgentActionPopup = () => {
    setActionpopup(!actionpopup);
  };
  const CloseAgentFilteringPopup = () => {
    setFilteringPopup(false);
  };

  const toggleShareOptions = () => {
    setShareOptionsVisible(true);
    setOpenSharingPopup(true);
  };

  const closeSharingPopup = () => {
    setOpenSharingPopup(false);
  };

  const handleApplyMetrics = () => {
    console.log("selectedMetrics", selectedMetrics);
    setAppliedAgnetMetrics(selectedMetrics);
    setsettingpopup(false);
  };

  useEffect(() => {
    console.log("Customer Data:", customerdata);
  }, [customerdata]);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const removeItem = (item: any) => {
    setTemporarySelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((i) => i !== item)
    );
  };

  const handleCheckboxChange = (item: any) => {
    setTemporarySelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(item)
        ? prevSelectedItems.filter((i) => i !== item)
        : [...prevSelectedItems, item]
    );
  };

  const RemoveItemALL = () => {
    setTemporarySelectedItems([]);
    setSearchTerm("");
  };

  const filteredItems = items.filter(
    (item) => item && item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    setSearchDropdown((prevSearchDropdown) => !prevSearchDropdown);
  };

  const FilterApplying = () => {
    setSelectedItems(temporarySelectedItems);
    setsettingpopup(false);
    setSearchDropdown(false);
  };

  const filteredCustomerData = customerdata.filter(
    (item: any) =>
      selectedItems.length === 0 || selectedItems.includes(item.agent)
  );
  // .slice(paginition.start, paginition.end);

  useEffect(() => {
    const updatedItems = customerdata.map((item: any) => item.agent);
    setItems(updatedItems);
  }, [customerdata]);

  // ========================================

  useEffect(() => {
    const value = showparPage * counter;
    paginationChange(value - showparPage, value);
  }, [counter, showparPage]);

  const paginationChange = (a: any, b: any) => {
    setPaginition({ start: a, end: b });
  };

  const showPerPageHandler = (val: any) => {
    console.log("getting value in show per page", val);
    setShowparPage(val);
  };

  const OpenSettingpopup = () => {
    setsettingpopup(true);
  };

  const CloseSettingpopup = () => {
    setsettingpopup(false);
  };

  const handleClick = (index: any) => {
    setActiveIndex(index);
    switch (index) {
      case 0:
        HandleFileterSection();
        break;

      case 1:
        HandleMetricsSection();
        break;
      default:
        break;
    }
  };

  const HandleFileterSection = () => {
    setFilterSection(true);
    setMetricsSection(false);
  };

  const HandleMetricsSection = () => {
    setMetricsSection(true);
    setFilterSection(false);
  };

  const OpenFilteringPopup = () => {
    setFilteringPopup(!filterpopup);
    setFileterRotingQueue(false);
    setSearchDropdown(false);
  };
  const CloseFilteringPopup = () => {
    setFilteringPopup(false);
  };

  const SelectedFilterOption = (option: any) => {
    SetSelectedOption(option);
    if (option === "Agents performance") {
      setQueuepopup(true);
      setChannelpopup(false);
      console.log("after queue selection", Queuepopup);
    } else if (option === "Channel") {
      setChannelpopup(true);
      setQueuepopup(false);

      console.log("after channel selection", Channelpopup);
    }
  };

  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="title-container">
          <h2>Agents Performance-Reports</h2>
          <div className="title-rightsidecontent">
            <div className="update-timecontent">
              <p>Last Update: {agentFormatTime(currentTime)}</p>
            </div>

            {/* <div className="play-Icon" onClick={agentPlayPauseClick}>
              <i
                className={`fa-solid ${
                  agentplay ? "fa-pause" : "fa-play"
                } PalyIcon`}
              ></i>
            </div> */}

            {/* <div className="refresh-icon">
              <i
                className={`fa-solid fa-rotate-right ${
                  isloading ? "icon-loading" : ""
                }`}
              ></i>
            </div> */}

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
                    actionpopup ? "fa-caret-up" : "fa-caret-down"
                  } actiondropdownicon`}
                ></i>
              </div>
              {actionpopup && (
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
            <div className="queuesperformance-edit">
              {isEditing ? (
                <input
                  type="text"
                  value={changeAgentName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  autoFocus
                  className="Queue-editinput"
                />
              ) : (
                <h5>{changeAgentName}</h5>
              )}
              {isEditing ? (
                <i
                  className="fa-solid fa-floppy-disk save-icon"
                  onClick={handleSaveClick}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-pen edit-icon"
                  onClick={handleEditClick}
                ></i>
              )}
            </div>
          </div>
          <div className="Table-rightsidecontent">
            <i
              className="fa-solid fa-gear settingicon"
              onClick={OpenSettingpopup}
            ></i>
          </div>
          {settingpopup && (
            <div className="setting-popup">
              <div className="insidesetting-popup">
                <h2>Table Settings</h2>
                <i
                  className="fa-solid fa-x closeicon "
                  onClick={CloseSettingpopup}
                ></i>
              </div>
              <div className="list-component">
                {["Filters", "Metrics"].map((item, index) => (
                  <div
                    key={index}
                    className={`list-item ${
                      index === activeIndex ? "active" : ""
                    }`}
                    onClick={() => handleClick(index)}
                  >
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              {/* Filter section */}
              {filtersection && (
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
                        value={selectedoption}
                        // onClick={OpenFilteringPopup}
                      ></input>
                      <div
                        className="dropdown-icon"
                        onClick={OpenFilteringPopup}
                      >
                        <i
                          className={`fa-solid ${
                            filterpopup ? "fa-caret-up" : "fa-caret-down"
                          } dropdownicon`}
                        ></i>
                      </div>
                    </div>
                    {filterpopup && (
                      <div
                        className="list-content"
                        onClick={CloseFilteringPopup}
                      >
                        <ul>
                          <li
                            onClick={() =>
                              SelectedFilterOption("Agents performance")
                            }
                          >
                            Agents performance
                          </li>

                          {/* <li onClick={() => SelectedFilterOption("Channel")}>
                            Channel
                          </li> */}
                        </ul>
                      </div>
                    )}
                    <div className="App">
                      {Queuepopup && (
                        <div className="includesearch-maincontent">
                          <p>Include</p>
                          <div
                            className="includesearch-insidecontent"
                            onClick={toggleDropdown}
                          >
                            <div className="Search-icon">
                              <i className="fa-solid fa-magnifying-glass"></i>
                            </div>
                            <input
                              type="text"
                              placeholder="Search"
                              value={searchTerm}
                              onChange={handleSearchChange}
                            />
                            <div
                              className="close-icon"
                              onClick={() => RemoveItemALL()}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </div>
                          </div>
                          <div className="selected-items">
                            {temporarySelectedItems.map((item) => (
                              <div key={item} className="selected-item">
                                {item}
                                <i
                                  className="fa-solid fa-xmark remove-icon"
                                  onClick={() => removeItem(item)}
                                ></i>
                              </div>
                            ))}
                          </div>
                          {searchDropdown && (
                            <div className="search-selectoptions">
                              {/* {filteredItems.map((item) => (
                                <div key={item} className="Search-item">
                                  <input
                                    type="checkbox"
                                    id={item}
                                    className="checkboxs"
                                    checked={temporarySelectedItems.includes(
                                      item
                                    )}
                                    onChange={() => handleCheckboxChange(item)}
                                  />
                                  <label htmlFor={item}>{item}</label>
                                </div>
                              ))} */}
                              {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                  <div key={item} className="Search-item">
                                    <input
                                      type="checkbox"
                                      id={item}
                                      className="checkboxs"
                                      checked={temporarySelectedItems.includes(
                                        item
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(item)
                                      }
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
                      {Channelpopup && (
                        <div className="Channel-container">
                          <p>
                            Select a channel to filter your report to include
                            contacts only for that channel. If you do not select
                            a channel, all channels are included in the report.
                          </p>
                          <div className="checkbox-container">
                            <div className="insidecheckbox-container">
                              <input type="checkbox" name="Voice" />
                              <p>Voice</p>
                            </div>
                            <div className="insidecheckbox-container">
                              <input type="checkbox" name="Chat" />
                              <p>Chat</p>
                            </div>
                            <div className="task-checkbox">
                              <input type="checkbox" name="Tast" />
                              <p>Task</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Filter section */}

              {/* Metric section */}
              {metricssection && (
                <div className="metrics-section">
                  <div className="metricsinside-section">
                    <p>Metrics show up as columns of table data.</p>

                    <Metrics
                      onSelectionChange={handleMetricSelectionChange}
                      initiallySelectedMetrics={appliedAgnetMetrics}
                    />
                  </div>
                </div>
              )}

              {/* Metric section */}
              {filtersection && (
                <div className="bottom-content">
                  <div className="bottun-content">
                    <button className="Cancel-btn" onClick={CloseSettingpopup}>
                      Cancel
                    </button>
                    <button className="Apply-btn" onClick={FilterApplying}>
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {metricssection && (
                <div className="bottom-content">
                  <div className="bottun-content">
                    <button className="Cancel-btn" onClick={CloseSettingpopup}>
                      Cancel
                    </button>
                    <button className="Apply-btn" onClick={handleApplyMetrics}>
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* ==============table============= */}

        <div className="mt-1">
          <div className="table-responsive wrapper-maintable-content-agents">
            {filteredCustomerData.length === 0 ? (
              <p className="NoDatafound">No data found</p>
            ) : (
              <table className="main-table">
                <thead>
                  <tr className="table-header">
                    <th colSpan={1} rowSpan={2} className="headers">
                      Name
                    </th>

                    {appliedAgnetMetrics.some((metric) =>
                      performanceMetrics.includes(metric)
                    ) && (
                      <th
                        colSpan={
                          performanceMetrics.filter((metric) =>
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
                    {appliedAgnetMetrics.includes("Queues") && <th>Queues</th>}
                    {appliedAgnetMetrics.includes("Inbound") && (
                      <th>Inbound</th>
                    )}

                    {appliedAgnetMetrics.includes("Answered") && (
                      <th>Answered</th>
                    )}
                    {appliedAgnetMetrics.includes("NoAnswered") && (
                      <th>NoAnswered</th>
                    )}

                    {appliedAgnetMetrics.includes("AHT") && <th>AHT</th>}
                    {appliedAgnetMetrics.includes("Answerrate") && (
                      <th>Answerrate(%)</th>
                    )}

                    {/* {appliedAgnetMetrics.includes("Outbound") && (
                      <th>Outbound</th>
                    )}

                    {appliedAgnetMetrics.includes("Answered") && (
                      <th>Answered</th>
                    )}
                    {appliedAgnetMetrics.includes("NoAswered") && (
                      <th>NoAswered</th>
                    )}

                    {appliedAgnetMetrics.includes("AHT") && <th>AHT</th>}
                    {appliedAgnetMetrics.includes("Answerrate") && (
                      <th>Answerrate(%)</th>
                    )} */}
                    {/* 
                    {appliedAgnetMetrics.includes("Answerrate") && (
                      <th>Answerrate(%)</th>
                    )} */}
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomerData
                    .slice(paginition.start, paginition.end)
                    .map((item: any) => (
                      <tr key={item.agent} className="table-body-content">
                        <td className="table-data-name">{item.agent}</td>

                        {appliedAgnetMetrics.includes("Queues") && (
                          <td>
                            {item.queues &&
                            item.queues.length > 0 &&
                            item.queues[0] !== null
                              ? item.queues.join(", ")
                              : "null"}
                          </td>
                        )}

                        {appliedAgnetMetrics.includes("Inbound") && (
                          <td>{item.inbound}</td>
                        )}
                        {appliedAgnetMetrics.includes("Answered") && (
                          <td>{item.answered_inbound}</td>
                        )}
                        {appliedAgnetMetrics.includes("NoAnswered") && (
                          <td>{item.noanswer_inbound}</td>
                        )}
                        {appliedAgnetMetrics.includes("AHT") && (
                          <td>{item.aht_inbound}</td>
                        )}
                        {appliedAgnetMetrics.includes("Answerrate") && (
                          <td>{item.occupancy_inbound}</td>
                        )}
                        {/* {appliedAgnetMetrics.includes("Outbound") && (
                        <td>{item.outbound}</td>
                      )}

                      {appliedAgnetMetrics.includes("Answered") && (
                        <td>{item.answered_outbound}</td>
                      )}
                      {appliedAgnetMetrics.includes("NoAswered") && (
                        <td>{item.noanswer_outbound}</td>
                      )}
                      {appliedAgnetMetrics.includes("AHT") && (
                        <td>{item.aht_outbound}</td>
                      )}
                      {appliedAgnetMetrics.includes("Answerrate") && (
                        <td>{item.occupancy_outbound}</td>
                      )} */}
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <Pagination
          total={customerdata.length}
          showparPage={showparPage}
          counter={counter}
          setCounter={setCounter}
          paginationChange={paginationChange}
          showPerPageHandler={showPerPageHandler}
        />
        {/* ==============table============= */}
      </div>
    </div>
  );
};

export default AgentsPerformance;

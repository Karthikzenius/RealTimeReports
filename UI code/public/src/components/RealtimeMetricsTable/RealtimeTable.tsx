import React from "react";
import "../RealtimeMetricsTable/RealtimeTable.scss";
// import customerdata from "./CustomerData";
import { useState, useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
// import Data from "./SearchData";
import Metrics from "./Metrics";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SharingOption from "../CDRTable/SharingOption";

const RealtimeTable = () => {
  const [play, setplay] = useState(true);
  const [puse, setpuse] = useState(false);
  const [settingpopup, setsettingpopup] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [counter, setCounter] = useState(1);
  const [showparPage, setShowparPage] = useState(5);
  const [query, setQuery] = useState("");
  // const [filteredData, setFilteredData] = useState(Data);
  const [paginition, setPaginition] = useState({
    start: 0,
    end: showparPage,
  });
  const [searchpopup, setSearchpopup] = useState(false);
  const [radiobutton, setRadiobutton] = useState(true);
  const [timezone, setTimezone] = useState(false);
  const [topping, setTopping] = useState(true);
  const [groupigtopping, setGroupigTopping] = useState(true);
  const [routingtopping, setRoutingTopping] = useState(false);
  const [groupSelection, setGroupSelection] = useState("Queues");
  const [activeIndex, setActiveIndex] = useState(0);
  const [groupingsection, setGroupingsection] = useState(false);
  const [Timerangesection, setTimerangesection] = useState(true);
  const [filtersection, setFilterSection] = useState(true);
  const [metricssection, setMetricsSection] = useState(false);
  const [filterpopup, setFilteringPopup] = useState(false);
  const [selectedoption, SetSelectedOption] = useState("Queues");
  const [actionpopup, setActionpopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [filterroutingqueue, setFileterRotingQueue] = useState(false);
  const [RoutingProfilepopup, setRoutingProfilepopup] = useState(false);
  const [Queuepopup, setQueuepopup] = useState(true);
  const [Channelpopup, setChannelpopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [queueNamechange, setQueueName] = useState("Queues");
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [openSharingPopup, setOpenSharingPopup] = useState(false);
  const [temporarySelectedItems, setTemporarySelectedItems] = useState<
    string[]
  >([]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [settingPopup, setSettingPopup] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [customerdata, setcustomerdata] = useState([]);
  const [timeRange, setTimeRange] = useState(" ");
  const [items, setItems] = useState<string[]>([]);
  const [timezoneselectoption, setTimezoneSelectoption] = useState("");
  const backRealtimeMetrics = () => {
    navigate("../Real-timemetrics");
  };
  // =============================================================

  const fetchData = () => {
    fetch("http://10.16.7.113:4000/api/Realtime-Metrics-Data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setcustomerdata(data); // Update state with fetched data
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        // Handle error
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  // =================================================================

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (play) {
      interval = setInterval(() => {
        setCurrentTime(new Date());
        triggerRefreshAnimation();
        fetchData();
      }, 6000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [play]);
  const handlePlayPauseClick = () => {
    setplay((prevPlay) => !prevPlay);
    if (!play) {
      setCurrentTime(new Date());
    }
  };

  const handleEditClick = () => {
    console.log("click on edite");
    setIsEditing(true);
  };

  const handleInputChange = (e: any) => {
    setQueueName(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };
  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const formatTime = (time: Date) => {
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

  const triggerRefreshAnimation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  const [appliedMetrics, setAppliedMetrics] = useState<string[]>([
    "Online",
    // "On Contact",
    "ACW",
    "Logged out",
    "On Break",
    "Available",
    // "Idle",
    "Waiting",
    "Receiving",
    "In a queuecall",
    // "Queued",
    "Handled",
    "Abandoned",
    "AHT",
    "Answerrate",
  ]);

  const CloseSettingPopup = () => {
    setSettingPopup(false);
  };

  const handleMetricSelectionChange = (selectedItems: string[]) => {
    console.log("logs in the handleMetricSelectionChange", selectedItems);
    setSelectedMetrics(selectedItems);
  };

  const agentMetrics = [
    "Online",
    // "On Contact",
    "ACW",
    "Logged out",
    "On Break",
    "Available",
  ];
  const contactMetrics = [
    // "Idle",
    "Waiting",
    "Receiving",
    "In a queuecall",
  ];
  const performanceMetrics = [
    // "Queued",
    "Handled",
    "Abandoned",
    "AHT",
    "Answerrate",
  ];

  const toggleShareOptions = () => {
    setShareOptionsVisible(true);
    setOpenSharingPopup(true);
  };

  const closeSharingPopup = () => {
    setOpenSharingPopup(false);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customerdata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");
    XLSX.writeFile(workbook, "QueuesData.xlsx");
  };

  // const handleDownloadExcel = () => {
  //   const filteredCustomerData = customerdata.map(({ idle, ...rest }) => rest);

  //   const worksheet = XLSX.utils.json_to_sheet(filteredCustomerData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");
  //   XLSX.writeFile(workbook, "QueuesData.xlsx");
  // };
  // ========================================================================
  const handleDownload = () => {
    const queueName = `${queueNamechange}`;
    const headers = ["Name"];
    if (appliedMetrics.includes("Online")) headers.push("Online");
    // if (appliedMetrics.includes("On Contact")) headers.push("OnContact");
    if (appliedMetrics.includes("ACW")) headers.push("ACW");
    if (appliedMetrics.includes("Logged out")) headers.push("LoggedOut");
    if (appliedMetrics.includes("On Break")) headers.push("OnBreak");
    if (appliedMetrics.includes("Available")) headers.push("Available");
    // if (appliedMetrics.includes("Idle")) headers.push("Idle");
    if (appliedMetrics.includes("Waiting")) headers.push("Waiting");
    if (appliedMetrics.includes("Receiving")) headers.push("Receiving");
    if (appliedMetrics.includes("In a queuecall")) headers.push("InaQueueCall");
    // if (appliedMetrics.includes("Queued")) headers.push("Queued");
    if (appliedMetrics.includes("Handled")) headers.push("Handled");
    if (appliedMetrics.includes("Abandoned")) headers.push("Abandoned");
    if (appliedMetrics.includes("AHT")) headers.push("AHT");
    if (appliedMetrics.includes("Answerrate")) headers.push("SL60");

    const data = [
      { Name: `${queueName}` },
      headers.reduce((acc, header) => ({ ...acc, [header]: header }), {}),
      ...(filteredCustomerData.length > 0
        ? filteredCustomerData
        : customerdata
      ).map((item: any) => {
        const result: { [key: string]: string | number | undefined } = {
          Name: item.Name,
        };
        if (appliedMetrics.includes("Online")) result.Online = item.Online;
        // if (appliedMetrics.includes("On Contact"))
        //   result.OnContact = item.onContact;
        if (appliedMetrics.includes("ACW")) result.ACW = item.ACW;
        if (appliedMetrics.includes("Logged out"))
          result.LoggedOut = item.LoggedOut;
        if (appliedMetrics.includes("On Break")) result.OnBreak = item.OnBreak;
        if (appliedMetrics.includes("Available"))
          result.Available = item.Available;
        // if (appliedMetrics.includes("Idle")) result.Idle = item.Idle;
        if (appliedMetrics.includes("Waiting")) result.Waiting = item.Waiting;
        if (appliedMetrics.includes("Receiving"))
          result.Receiving = item.Receiving;
        if (appliedMetrics.includes("In a queuecall"))
          result.InaQueueCall = item.InaQueueCall;
        // if (appliedMetrics.includes("Queued")) result.Queued = item.queued;
        if (appliedMetrics.includes("Handled")) result.Handled = item.Handled;
        if (appliedMetrics.includes("Abandoned"))
          result.Abandoned = item.Abandoned;
        if (appliedMetrics.includes("AHT")) result.AHT = item.AHT;
        if (appliedMetrics.includes("Answerrate")) result.SL60 = item.SL60;
        return result;
      }),
    ];

    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    const csv = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "RealtimeMetricsQueues.csv");
  };

  // ========================================================================
  const handleApplyMetrics = () => {
    console.log("selectedMetrics", selectedMetrics);
    setAppliedMetrics(selectedMetrics);
    setsettingpopup(false);
  };

  const SelectedTimeZoneoption = (option: any) => {
    setTimezoneSelectoption(option);
  };

  // ========================================

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
    // setSelectedItems((prev) => prev.filter((i) => i !== item));
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
      selectedItems.length === 0 || selectedItems.includes(item.Name)
  );
  // .slice(paginition.start, paginition.end);

  useEffect(() => {
    const updatedItems = customerdata.map((item: any) => item.Name);
    setItems(updatedItems);
  }, [customerdata]);

  // ========================================

  const RoutingQueus = [
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

  // const handleSearch = (event: any) => {
  //   const value = event.target.value;
  //   setQuery(value);
  //   setFilteredData(
  //     Data.filter((item:any) =>
  //       item.name.toLowerCase().includes(value.toLowerCase())
  //     )
  //   );
  // };

  const SearchList = () => {
    setSearchpopup(true);
  };

  const CloseSearchList = (item: any) => {
    console.log("Item in close search list", item.name);
    setQuery(item.name);
    setSearchpopup(false);
  };

  const ResetInput = () => {
    setSearchpopup(false);
    setTimezoneSelectoption(" ");
  };

  const HandileRadioButton = () => {
    setRadiobutton(true);
    setTimezone(false);
    setTopping(true);
  };

  const HandileTimezone = () => {
    setTimezone(true);
    setRadiobutton(false);
    setTopping(false);
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

  const OpenActionPopup = () => {
    setActionpopup(!actionpopup);
  };

  const SelectedFilterOption = (option: any) => {
    SetSelectedOption(option);
    if (option === "Queues") {
      setQueuepopup(true);
      setChannelpopup(false);
      console.log("after queue selection", Queuepopup);
    } else if (option === "Channel") {
      setChannelpopup(true);
      setQueuepopup(false);
      setRoutingProfilepopup(false);
      console.log("after channel selection", Channelpopup);
    }
  };

  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="title-container">
          <h2>Real-time Metrics</h2>
          <div className="title-rightsidecontent">
            <div className="update-timecontent">
              <p>Last Update: {formatTime(currentTime)}</p>
            </div>

            <div className="play-Icon" onClick={handlePlayPauseClick}>
              <i
                className={`fa-solid ${play ? "fa-pause" : "fa-play"} PalyIcon`}
              ></i>
            </div>

            <div className="refresh-icon">
              <i
                className={`fa-solid fa-rotate-right ${
                  isLoading ? "icon-loading" : ""
                }`}
              ></i>
            </div>

            <div className="action-dropdownmain" onClick={OpenActionPopup}>
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
                  onClick={CloseFilteringPopup}
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
              {isEditing ? (
                <input
                  type="text"
                  value={queueNamechange}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  autoFocus
                  className="Queue-editinput"
                />
              ) : (
                <h5>{queueNamechange}</h5>
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
            <p className="time-range">Time range: updating every 6 seconds</p>

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

              {/* TimeRangesection */}
              {/* {Timerangesection && (
                <div className="main-content">
                  <div className="Trailing-content">
                    <input
                      type="radio"
                      className="Radio"
                      name="topping"
                      checked={topping === true}
                      onClick={HandileRadioButton}
                    />
                    <p>Trailing windows for time</p>
                  </div>
                  {radiobutton && (
                    <div className="insideTrailing-content">
                      <p>The previous</p>
                      <select
                        id="option"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                      >
                        <option value="0.5">0.5</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                      </select>
                      <p>hour</p>
                    </div>
                  )}
                  <div className="Timezone-content">
                    <input
                      type="radio"
                      name="topping"
                      checked={topping === false}
                      className="Radio"
                      onClick={HandileTimezone}
                    />
                    <p>Midnight to now</p>
                  </div>
                  {timezone && (
                    <div className="insideTimezone-content">
                      <p>Time Zone</p>
                  
                      <div className="search-container">
                        <input
                          type="text"
                          className="search-input"
                    
                          value={timezoneselectoption}
                  
                          onClick={SearchList}
                        ></input>

                        <i
                          className="fa-solid fa-xmark closeicon"
                          onClick={ResetInput}
                        ></i>
                        {searchpopup && (
                          <ul className="result-list" onClick={CloseSearchList}>
                            <li
                              className="result-item"
                              onClick={() =>
                                SelectedTimeZoneoption("12 AM - 6 PM Data")
                              }
                            >
                              12 AM - 6 PM Data
                            </li>
                            <li
                              className="result-item"
                              onClick={() =>
                                SelectedTimeZoneoption("6 PM - 12 AM Data")
                              }
                            >
                              6 PM - 12 AM Data
                            </li>
                            <li
                              className="result-item"
                              onClick={() =>
                                SelectedTimeZoneoption("24 hours Data")
                              }
                            >
                              24 hours Data
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )} */}
              {/* TimeRangesection */}
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
                        onClick={OpenFilteringPopup}
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
                          <li onClick={() => SelectedFilterOption("Queues")}>
                            Queues
                          </li>

                          <li onClick={() => SelectedFilterOption("Channel")}>
                            Channel
                          </li>
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
                              <input
                                type="checkbox"
                                name="Tast"
                                // className="task-checkbox"
                              />
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
                      initiallySelectedMetrics={appliedMetrics}
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
              {/* {Timerangesection && (
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
              )} */}
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
                    {appliedMetrics.some((metric) =>
                      agentMetrics.includes(metric)
                    ) && (
                      <th
                        colSpan={
                          agentMetrics.filter((metric) =>
                            appliedMetrics.includes(metric)
                          ).length
                        }
                        className="headers"
                      >
                        Agent
                      </th>
                    )}
                    {appliedMetrics.some((metric) =>
                      contactMetrics.includes(metric)
                    ) && (
                      <th
                        colSpan={
                          contactMetrics.filter((metric) =>
                            appliedMetrics.includes(metric)
                          ).length
                        }
                        className="headers"
                      >
                        Contacts
                      </th>
                    )}
                    {appliedMetrics.some((metric) =>
                      performanceMetrics.includes(metric)
                    ) && (
                      <th
                        colSpan={
                          performanceMetrics.filter((metric) =>
                            appliedMetrics.includes(metric)
                          ).length
                        }
                        className="headers"
                      >
                        Performance
                      </th>
                    )}
                  </tr>
                  <tr className="table-header">
                    {appliedMetrics.includes("Online") && <th>Online</th>}
                    {/* {appliedMetrics.includes("On Contact") && (
                      <th>On Contact</th>
                    )} */}
                    {appliedMetrics.includes("ACW") && <th>ACW</th>}
                    {appliedMetrics.includes("Logged out") && (
                      <th>Logged Out</th>
                    )}
                    {appliedMetrics.includes("On Break") && <th>On Break</th>}
                    {appliedMetrics.includes("Available") && <th>Available</th>}
                    {/* {appliedMetrics.includes("Idle") && <th>Idle</th>} */}
                    {appliedMetrics.includes("Waiting") && <th>Waiting</th>}
                    {appliedMetrics.includes("Receiving") && <th>Receiving</th>}
                    {appliedMetrics.includes("In a queuecall") && (
                      <th>In a queuecall</th>
                    )}
                    {/* {appliedMetrics.includes("Queued") && <th>Queued</th>} */}
                    {appliedMetrics.includes("Handled") && <th>Handled</th>}
                    {appliedMetrics.includes("Abandoned") && <th>Abandoned</th>}
                    {appliedMetrics.includes("AHT") && <th>AHT</th>}
                    {appliedMetrics.includes("Answerrate") && (
                      <th>Answerrate(%)</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomerData
                    .slice(paginition.start, paginition.end)
                    .map((item: any) => (
                      <tr key={item.Name} className="table-body-content">
                        <td className="table-data-name">{item.Name}</td>
                        {appliedMetrics.includes("Online") && (
                          <td>{item.Online}</td>
                        )}
                        {/* {appliedMetrics.includes("On Contact") && (
                        <td>{item.onContact}</td>
                      )} */}
                        {appliedMetrics.includes("ACW") && <td>{item.ACW}</td>}
                        {appliedMetrics.includes("Logged out") && (
                          <td>{item.LoggedOut}</td>
                        )}
                        {appliedMetrics.includes("On Break") && (
                          <td>{item.OnBreak}</td>
                        )}
                        {appliedMetrics.includes("Available") && (
                          <td>{item.Available}</td>
                        )}
                        {/* {appliedMetrics.includes("Idle") && (
                          <td>{item.Idle}</td>
                        )} */}
                        {appliedMetrics.includes("Waiting") && (
                          <td>{item.Waiting}</td>
                        )}
                        {appliedMetrics.includes("Receiving") && (
                          <td>{item.Receiving}</td>
                        )}
                        {appliedMetrics.includes("In a queuecall") && (
                          <td>{item.InaQueueCall}</td>
                        )}
                        {/* {appliedMetrics.includes("Queued") && (
                        <td>{item.queued}</td>
                      )} */}
                        {appliedMetrics.includes("Handled") && (
                          <td>{item.Handled}</td>
                        )}
                        {appliedMetrics.includes("Abandoned") && (
                          <td>{item.Abandoned}</td>
                        )}
                        {appliedMetrics.includes("AHT") && <td>{item.AHT}</td>}
                        {appliedMetrics.includes("Answerrate") && (
                          <td>{item.SL60}</td>
                        )}
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

export default RealtimeTable;

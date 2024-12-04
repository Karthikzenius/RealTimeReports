import React from "react";
import "../CDRTable/CDRTablemain.scss";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Pagination from "../Pagination/Pagination";
import axios from "axios";
import Calendar from "./calender";
import TimePicker from "./timePicker";
import Metrics from "./CDRmetrics";
import SharingOption from "./SharingOption";
import { newDate } from "react-datepicker/dist/date_utils";
interface DataItem {
  cc_agent: string;
  start_stamp: string;
  end_stamp: string;
}

const CDRTablemain = () => {
  const [customerdata, setCustomerData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [pagination, setPagination] = useState<{ start: number; end: number }>({
    start: 0,
    end: postsPerPage,
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [actionpopup, setActionpopup] = useState(false);
  const [filterpopup, setFilteringPopup] = useState(false);
  const [Timerangepopup, setTimeRangePopup] = useState(false);
  const [channelpopup, setChannelPopup] = useState(false);
  const [todaytdate, setTodayDate] = useState(new Date());
  const [displayText, setDisplayText] = useState("All channels");
  const [checktopping, setCheckTopping] = useState(true);
  const [trailingpopup, setTrailingPopup] = useState(false);
  const [fixedcheckpopup, setFixedCheckPopup] = useState(true);
  const [activeOption, setActiveOption] = useState("today");
  const [todaycontent, setTodayContent] = useState(true);
  const [yesterdaycontent, setYesterdayContent] = useState(false);
  const [customcontent, setCustomContent] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>("08:00");
  const [applyFilter, setApplyFilter] = useState(false);
  const [currentdate, setCurrentDate] = useState(new Date());
  const [selecthourpopup, setSelectHourPopup] = useState(false);
  const [selectedHour, setSelectedHour] = useState("1");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [contactpopup, setContactPopup] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [changeCDRName, setCDRName] = useState("Contacts");
  const [settingpopup, setsettingpopup] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filtersection, setFilterSection] = useState(true);
  const [metricssection, setMetricsSection] = useState(false);
  const [selectedoption, SetSelectedOption] = useState("CDR-Reports");
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [Queuepopup, setQueuepopup] = useState(true);
  const [Channelpopup, setChannelpopup] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [temporarySelectedItems, setTemporarySelectedItems] = useState<
    string[]
  >([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filteredCustomerData, setFilteredCustomerData] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState("hours");
  const [selectedValue, setSelectedValue] = useState(0);
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [openSharingPopup, setOpenSharingPopup] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  const navigate = useNavigate();
  const backRealtimeMetrics = () => {
    navigate("../Real-timemetrics");
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = customerdata.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://10.16.7.113:6001/cdr");
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [appliedMetrics, setAppliedAgnetMetrics] = useState<string[]>([
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
  ]);
  const CDRFormatTime = (time: Date) => {
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

  useEffect(() => {
    setPagination({
      start: (currentPage - 1) * postsPerPage,
      end: currentPage * postsPerPage,
    });
  }, [currentPage, postsPerPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const showPerPageHandler = (val: number) => {
    setPostsPerPage(val);
    setCurrentPage(1);
  };

  const OpenAgentActionPopup = () => {
    setActionpopup(!actionpopup);
  };

  const CloseAgentFilteringPopup = () => {
    setFilteringPopup(false);
  };
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customerdata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");
    XLSX.writeFile(workbook, "CDRData.xlsx");
  };

  // ==============================================

  const handleDownload = () => {
    const CDRName = `${changeCDRName}`;
    const headers = ["Name"];
    if (appliedMetrics.includes("Queue")) headers.push("cc_queue");
    if (appliedMetrics.includes("DestinationNumber"))
      headers.push("destination_number");
    if (appliedMetrics.includes("CallerId")) headers.push("caller_id_number");
    if (appliedMetrics.includes("UUID")) headers.push("uuid");
    if (appliedMetrics.includes("AnswerTime")) headers.push("answer_stamp");
    if (appliedMetrics.includes("Direction")) headers.push("direction");
    if (appliedMetrics.includes("Duration")) headers.push("duration");
    if (appliedMetrics.includes("SipCall ID")) headers.push("sip_call_id");
    if (appliedMetrics.includes("StartTime")) headers.push("start_stamp");
    if (appliedMetrics.includes("EndTime")) headers.push("end_stamp");
    if (appliedMetrics.includes("billsec")) headers.push("billsec");

    const data = [
      { Name: `${CDRName}` },
      headers.reduce((acc, header) => ({ ...acc, [header]: header }), {}),
      ...(filteredCustomerData.length > 0
        ? filteredCustomerData
        : customerdata
      ).map((item: any) => {
        const result: { [key: string]: string | number | undefined } = {
          Name: item.cc_agent || "null",
        };

        if (appliedMetrics.includes("Queue"))
          result.cc_queue = item.cc_queue || "null";
        if (appliedMetrics.includes("DestinationNumber"))
          result.destination_number = item.destination_number;
        if (appliedMetrics.includes("CallerId"))
          result.caller_id_number = item.caller_id_number;
        if (appliedMetrics.includes("UUID")) result.uuid = item.uuid;

        if (appliedMetrics.includes("AnswerTime")) {
          if (item.answer_stamp) {
            const gmtDate = new Date(item.answer_stamp);
            const istDate = new Date(
              gmtDate.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
              })
            );
            const day = gmtDate.toUTCString().split(",")[0];
            const date = gmtDate.toUTCString().split(", ")[1].split(" ")[0];
            const month = gmtDate.toUTCString().split(" ")[2];
            const year = gmtDate.toUTCString().split(" ")[3];
            const time = istDate.toTimeString().split(" ")[0];
            result.answer_stamp = `${day}, ${date} ${month} ${year} ${time} IST`;
          } else {
            result.answer_stamp = undefined;
          }
        }

        if (appliedMetrics.includes("Direction"))
          result.direction = item.direction;
        if (appliedMetrics.includes("Duration"))
          result.duration = item.duration;
        if (appliedMetrics.includes("SipCall ID"))
          result.sip_call_id = item.sip_call_id;

        if (appliedMetrics.includes("StartTime")) {
          if (item.start_stamp) {
            const gmtDate = new Date(item.start_stamp);
            const istDate = new Date(
              gmtDate.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
              })
            );
            const day = gmtDate.toUTCString().split(",")[0];
            const date = gmtDate.toUTCString().split(", ")[1].split(" ")[0];
            const month = gmtDate.toUTCString().split(" ")[2];
            const year = gmtDate.toUTCString().split(" ")[3];
            const time = istDate.toTimeString().split(" ")[0];
            result.start_stamp = `${day}, ${date} ${month} ${year} ${time} IST`;
          } else {
            result.start_stamp = undefined;
          }
        }

        if (appliedMetrics.includes("EndTime")) {
          if (item.end_stamp) {
            const gmtDate = new Date(item.end_stamp);
            const istDate = new Date(
              gmtDate.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
              })
            );
            const day = gmtDate.toUTCString().split(",")[0];
            const date = gmtDate.toUTCString().split(", ")[1].split(" ")[0];
            const month = gmtDate.toUTCString().split(" ")[2];
            const year = gmtDate.toUTCString().split(" ")[3];
            const time = istDate.toTimeString().split(" ")[0];
            result.end_stamp = `${day}, ${date} ${month} ${year} ${time} IST`;
          } else {
            result.end_stamp = undefined;
          }
        }

        if (appliedMetrics.includes("billsec")) result.billsec = item.billsec;
        return result;
      }),
    ];

    const ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    const csv = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "CDR-Reports.csv");
  };

  // ==============================================

  const openTimeRangepopup = () => {
    setTimeRangePopup(!Timerangepopup);
    setChannelPopup(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openChannelPopup = () => {
    setChannelPopup(!channelpopup);
    setTimeRangePopup(false);
  };

  const CheckFixedTime = () => {
    setCheckTopping(true);
    setTrailingPopup(false);
    setFixedCheckPopup(true);
  };

  const CheckTrailing = () => {
    setCheckTopping(false);
    setTrailingPopup(true);
    setFixedCheckPopup(false);
  };

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [EndDate, setEndDate] = useState<Date | null>(null);
  const endDateValue = new Date();
  endDateValue.setDate(endDateValue.getDate() - 4);
  const startDateValue = new Date();
  startDateValue.setDate(startDateValue.getDate() - 17);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const [yesterdayDate, setYesterdayDate] = useState(yesterday);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 4);
  const StartDate = new Date();
  StartDate.setDate(StartDate.getDate() - 13);

  const closeTimeRangepopup = () => {
    setTimeRangePopup(false);
  };

  const OptionClick = (option: any, callback: any) => {
    setActiveOption(option);
    handleTimeSelect(new Date().toISOString());
    callback();
  };

  const handleTimeSelect = (time: any) => {
    console.log("Time received:", time);
    const [hours, minutes] = time.split(":");
    const currentDate = new Date();
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      parseInt(hours),
      parseInt(minutes)
    );

    if (!isNaN(selectedDate.getTime())) {
      const isoDate = selectedDate.toISOString();
      setSelectedTime(isoDate);
      const formattedTime = selectedDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      console.log("Formatted selected time:", formattedTime);
      setApplyFilter(false);
    } else {
      console.error("Invalid time selected:", time);
    }
  };

  const openTodayContainer = () => {
    setTodayContent(true);
    setYesterdayContent(false);
    setCustomContent(false);
  };
  const openYesterdayContainer = () => {
    setTodayContent(false);
    setYesterdayContent(true);
    setCustomContent(false);
  };

  const openCustomContainer = () => {
    setTodayContent(false);
    setYesterdayContent(false);
    setCustomContent(true);
  };

  const getClassName = (option: any) => {
    return activeOption === option ? "active" : "";
  };

  const openSelectHourspopup = () => {
    setSelectHourPopup(!selecthourpopup);
  };

  const handleHourSelect = (hour: number) => {
    const newHour = hour.toString().padStart(1);
    setSelectedHour(newHour);
  };

  const channelCheckboxChange = (channel: any) => {
    setSelectedChannels((prevState) => {
      if (prevState.includes(channel)) {
        return prevState.filter((item) => item !== channel);
      } else {
        return [...prevState, channel];
      }
    });
  };

  const handleApply = () => {
    if (selectedChannels.length === 0) {
      setDisplayText("All channels");
    } else if (selectedChannels.length === 3) {
      setDisplayText("All channels");
    } else {
      setDisplayText(selectedChannels.join(", "));
    }
    setChannelPopup(false);
  };

  const handleInputChange = (e: any) => {
    setCDRName(e.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleEditClick = () => {
    console.log("click on edite");
    setIsEditing(true);
  };

  const OpenSettingpopup = () => {
    setsettingpopup(true);
  };
  const CloseSettingpopup = () => {
    setsettingpopup(false);
  };

  const HandleFileterSection = () => {
    setFilterSection(true);
    setMetricsSection(false);
  };

  const HandleMetricsSection = () => {
    setMetricsSection(true);
    setFilterSection(false);
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

  const OpenFilteringPopup = () => {
    setFilteringPopup(!filterpopup);
    setSearchDropdown(false);
  };

  const CloseFilteringPopup = () => {
    setFilteringPopup(false);
  };

  const SelectedFilterOption = (option: any) => {
    SetSelectedOption(option);
    if (option === "CDR-Reports") {
      setQueuepopup(true);
      setChannelpopup(false);
      console.log("after queue selection", Queuepopup);
    } else if (option === "Channel") {
      setChannelpopup(true);
      setQueuepopup(false);

      console.log("after channel selection", Channelpopup);
    }
  };

  // const filteredItems = items.filter(
  //   (item) => item && item.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredItems = items.filter((item) => {
    if (item != null) {
      // Check for null or undefined
      const itemStr = String(item).toLowerCase();
      return itemStr.includes(searchTerm.toLowerCase());
    }
    return false; // Exclude null or undefined items
  });
  console.log("filteredItems", filteredItems);

  const toggleDropdown = () => {
    setSearchDropdown((prevSearchDropdown) => !prevSearchDropdown);
  };

  useEffect(() => {
    const updatedItems = customerdata.map(
      (items: any) => items.destination_number
    );
    setItems(updatedItems);
  }, [customerdata]);

  const handleCheckboxChange = (items: any) => {
    setTemporarySelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(items)
        ? prevSelectedItems.filter((i) => i !== items)
        : [...prevSelectedItems, items]
    );
  };

  // const handleSearchChange = (event: any) => {
  //   setSearchTerm(event.target.value);
  // };

  const handleSearchChange = (event: any) => {
    const value = event.target.value;
    setSearchTerm(value);
    console.log("Updated Search Term:", value);
  };

  const RemoveItemALL = () => {
    setTemporarySelectedItems([]);
    setSearchTerm("");
  };

  const removeItem = (item: any) => {
    setTemporarySelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((i) => i !== item)
    );
  };

  const handleMetricSelectionChange = (selectedItems: string[]) => {
    console.log("logs in the handleMetricSelectionChange", selectedItems);
    setSelectedMetrics(selectedItems);
  };

  const FilterApplying = () => {
    setSelectedItems(temporarySelectedItems);
    setsettingpopup(false);
    setSearchDropdown(false);
    setApplyFilter(true);
  };

  const handleApplyMetrics = () => {
    console.log("selectedMetrics", selectedMetrics);
    setAppliedAgnetMetrics(selectedMetrics);
    setsettingpopup(false);
  };

  // const filteredCustomerData = customerdata.filter(
  //   (item: any) =>
  //     selectedItems.length === 0 ||
  //     selectedItems.includes(item.destination_number)
  // );

  useEffect(() => {
    const filteredData = customerdata.filter(
      (item: any) =>
        selectedItems.length === 0 ||
        selectedItems.includes(item.destination_number)
    );
    setFilteredCustomerData(filteredData);
  }, [customerdata, selectedItems]);

  // =====================================================

  // const calendarFilter = () => {
  //   if (startDate && EndDate) {
  //     if (startDate > EndDate) {
  //       setError("Start date cannot be later than end date.");
  //       return;
  //     }
  //     setError("");

  //     const adjustedStartDate = new Date(startDate);
  //     const adjustedEndDate = new Date(EndDate);

  //     const formattedStartDate = adjustedStartDate.toLocaleDateString("en-US", {
  //       month: "short",
  //       day: "numeric",
  //     });
  //     const formattedEndDate = adjustedEndDate.toLocaleDateString("en-US", {
  //       month: "short",
  //       day: "numeric",
  //     });

  //     const dateRange = `From ${formattedStartDate} - ${formattedEndDate}`;
  //     setFormattedDate(dateRange);

  //     const filterStartDate = adjustedStartDate.toLocaleDateString("en-GB");
  //     const filterEndDate = adjustedEndDate.toLocaleDateString("en-GB");

  //     const filteredData = customerdata.filter((item: any) => {
  //       const itemDate = new Date(item.start_stamp);
  //       const itemDateOnly = itemDate.toLocaleDateString("en-GB");

  //       return itemDateOnly >= filterStartDate && itemDateOnly <= filterEndDate;
  //     });

  //     setFilteredCustomerData(filteredData);
  //     setTimeRangePopup(false);
  //   } else {
  //     setError("Please select both start and end dates.");
  //   }
  // };

  const calendarFilter = () => {
    if (startDate && EndDate) {
      if (startDate > EndDate) {
        setError("Start date cannot be later than end date.");
        return;
      }
      setError("");

      const adjustedStartDate = new Date(startDate);
      const adjustedEndDate = new Date(EndDate);

      // Format the start and end dates in "Oct 16" and "Oct 21" format
      const formattedStartDate = adjustedStartDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const formattedEndDate = adjustedEndDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const dateRange = `From ${formattedStartDate} - ${formattedEndDate}`;
      setFormattedDate(dateRange);

      // Ensure time component is ignored for start/end date by setting time to midnight
      const filterStartDate = new Date(adjustedStartDate.setHours(0, 0, 0, 0));
      const filterEndDate = new Date(adjustedEndDate.setHours(23, 59, 59, 999)); // End of the day

      const filteredData = customerdata.filter((item: any) => {
        const itemDate = new Date(item.start_stamp);
        return itemDate >= filterStartDate && itemDate <= filterEndDate;
      });

      setFilteredCustomerData(filteredData);
      setTimeRangePopup(false);
    } else {
      setError("Please select both start and end dates.");
    }
  };

  const filterYesterdayData = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Format the 'yesterday' date to "Oct 22, 2024"
    const formattedYesterday = yesterday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const yesterdayFilteredData = customerdata.filter((item: any) => {
      const itemDate = new Date(
        new Date(item.start_stamp).getTime() + 5.5 * 60 * 60 * 1000
      );
      const itemDateFormatted = itemDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return itemDateFormatted === formattedYesterday;
    });

    setFormattedDate(formattedYesterday);

    setFilteredCustomerData(yesterdayFilteredData);
    setTimeRangePopup(false);
  };

  // =====================================================
  const HourSelect = (value: number) => {
    setSelectedValue(value);
    setSelectHourPopup(false);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnit(e.target.value);
  };

  const filterCustomData = () => {
    const now = new Date();

    if (selectedUnit === "hours") {
      const filteredData = customerdata.filter((item: any) => {
        const itemDate = new Date(item.start_stamp);
        const diffInHours =
          (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60);
        return diffInHours <= selectedValue;
      });
      setFilteredCustomerData(filteredData);
    } else if (selectedUnit === "days") {
      const baseDate = new Date(now);
      baseDate.setDate(now.getDate() - selectedValue);
      const baseDateFormatted = `from ${baseDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
      console.log("Base Date (formatted):", baseDateFormatted);

      setFormattedDate(baseDateFormatted);

      const filteredData = customerdata.filter((item: any) => {
        const itemDate = new Date(item.start_stamp);
        const diffInDays =
          (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= selectedValue;
      });
      setFilteredCustomerData(filteredData);
    }

    setTimeRangePopup(false);
  };

  const Filtertoday = () => {
    if (!selectedTime) return;

    const filteredData = customerdata.filter((item: any) => {
      const itemDate = new Date(item.start_stamp);
      return itemDate.toISOString() >= selectedTime;
    });

    const selectedDate = new Date(selectedTime);
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();

    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedTime = `Today from ${formattedHours}:${formattedMinutes} ${ampm}`;

    setFormattedDate(formattedTime);

    setFilteredCustomerData(filteredData);
    setApplyFilter(true);
    setTimeRangePopup(false);
  };

  //========================================================

  const toggleShareOptions = () => {
    setShareOptionsVisible(true);
    setOpenSharingPopup(true);
  };

  const closeSharingPopup = () => {
    setOpenSharingPopup(false);
  };
  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="title-container">
          <h2>CDR-Reports</h2>
          <div className="title-rightsidecontent">
            <div className="update-timecontent">
              <p>Last Update: {CDRFormatTime(currentTime)}</p>
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

        <div className="Filters-container">
          <div>
            <h5>Filters</h5>
          </div>
          <div className="insidefilter-container">
            <div className="Timerange-container" onClick={openTimeRangepopup}>
              <p className="heading-time">Time range :</p>
              <p>Intiated timestamp</p>
              <div className="Timerange-text">
                <p>{formattedDate ? formattedDate : formatDate(todaytdate)}</p>
              </div>
              <i
                className={`timerangedropdown fa-solid ${
                  Timerangepopup ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
            <div className="channel-container" onClick={openChannelPopup}>
              <p className="channel-header">Channel</p>
              <div className="channel-text">
                <p>{displayText}</p>
              </div>
              <i
                className={`channeldropdown fa-solid ${
                  channelpopup ? "fa-chevron-up" : "fa-chevron-down"
                }`}
              ></i>
            </div>
          </div>
          {Timerangepopup && (
            <div className="timerangePopup">
              <div className="radio-buttoncontainer">
                <div className="Fixed-radiobutton">
                  <input
                    type="radio"
                    name="fixedradio"
                    checked={checktopping === true}
                    className="radiobutton-input"
                    onClick={CheckFixedTime}
                  />
                  <p>Fixed Time</p>
                </div>
                <div className="Trailingwindow-container">
                  <input
                    type="radio"
                    name="trailradio"
                    checked={checktopping === false}
                    className="Trailingwindow-input"
                    onClick={CheckTrailing}
                  />
                  <p>Trailing window of time</p>
                </div>
              </div>
              {fixedcheckpopup && (
                <div className="calender-maincontainer">
                  <div className="calender-container">
                    <Calendar
                      startDate={startDate}
                      EndDate={EndDate}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      // onFilterClick={calendarFilter}
                    />
                  </div>
                  <div className=" timerange-buttons">
                    <button
                      className="timerangeCancel-btn"
                      onClick={closeTimeRangepopup}
                    >
                      Cancel
                    </button>
                    <button
                      className="timerangeApply-btn"
                      onClick={calendarFilter}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
              {trailingpopup && (
                <div className="Trailing-maincontainer">
                  <div className="Trailing-container">
                    <div className="leftside-container">
                      <div className="leftside-container">
                        <p
                          onClick={() =>
                            OptionClick("today", openTodayContainer)
                          }
                          className={getClassName("today")}
                        >
                          Today
                        </p>
                        <p
                          onClick={() =>
                            OptionClick("yesterday", openYesterdayContainer)
                          }
                          className={getClassName("yesterday")}
                        >
                          Yesterday
                        </p>

                        <p
                          onClick={() =>
                            OptionClick("custom", openCustomContainer)
                          }
                          className={getClassName("custom")}
                        >
                          Custom
                        </p>
                      </div>
                    </div>
                    <div className="rightside-container">
                      {todaycontent && (
                        <div className="today-content">
                          <p>{`${formatDate(
                            currentdate
                          )}, ${selectedTime} - current time`}</p>
                          <div className="maincontainer-timepicker">
                            <p>Show starting</p>
                            <TimePicker
                              onTimeSelect={(time) => handleTimeSelect(time)}
                            />
                          </div>
                        </div>
                      )}
                      {yesterdaycontent && (
                        <div className="yesterday-content">
                          <p>{`${formatDate(yesterdayDate)} 00:00 - 24:00`}</p>
                        </div>
                      )}
                      {/* {customcontent && (
                        <div className="maincustom-content">
                          <div className="custom-content">
                            <div className="hourscustom-selectinput">
                              <p>The previous</p>
                              <div
                                className="hoursselectmain-container"
                                onClick={openSelectHourspopup}
                              >
                                <input
                                  type="text"
                                  value={selectedHour}
                                  className="customhoursselection"
                                />
                                <i className="fa-solid fa-chevron-down chevrondropdown"></i>
                              </div>
                              <select className="customdays-selecter">
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                              </select>
                            </div>
                            {selecthourpopup && (
                              <div className="customhour-container">
                                <ul>
                                  {Array.from({ length: 25 }, (_, i) => (
                                    <li
                                      key={i}
                                      onClick={() => handleHourSelect(i)}
                                    >
                                      {i.toString().padStart(1)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )} */}
                      {customcontent && (
                        <div className="maincustom-content">
                          <div className="custom-content">
                            <div className="hourscustom-selectinput">
                              <p>The previous</p>
                              <div
                                className="hoursselectmain-container"
                                onClick={openSelectHourspopup}
                              >
                                <input
                                  type="text"
                                  value={selectedValue}
                                  className="customhoursselection"
                                  readOnly
                                />
                                <i className="fa-solid fa-chevron-down chevrondropdown"></i>
                              </div>

                              <select
                                className="customdays-selecter"
                                onChange={handleUnitChange}
                              >
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                              </select>
                            </div>

                            {selecthourpopup && (
                              <div className="customhour-container">
                                <ul>
                                  {Array.from({ length: 25 }, (_, i) => (
                                    <li key={i} onClick={() => HourSelect(i)}>
                                      {i.toString().padStart(1)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {todaycontent && (
                    <div className=" timerange-buttons">
                      <button
                        className="timerangeCancel-btn"
                        onClick={closeTimeRangepopup}
                      >
                        Cancel
                      </button>
                      <button
                        className="timerangeApply-btn"
                        onClick={Filtertoday}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {yesterdaycontent && (
                    <div className=" timerange-buttons">
                      <button
                        className="timerangeCancel-btn"
                        onClick={closeTimeRangepopup}
                      >
                        Cancel
                      </button>
                      <button
                        className="timerangeApply-btn"
                        onClick={filterYesterdayData}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {customcontent && (
                    <div className=" timerange-buttons">
                      <button
                        className="timerangeCancel-btn"
                        onClick={closeTimeRangepopup}
                      >
                        Cancel
                      </button>
                      <button
                        className="timerangeApply-btn"
                        onClick={filterCustomData}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {channelpopup && (
            <div className="channelpopup-maincontainer">
              <div className="channelcheckbox-maincontainer">
                <div className="voice-content">
                  <input
                    type="checkbox"
                    className="checkboxinput"
                    onChange={() => channelCheckboxChange("Voice")}
                    checked={selectedChannels.includes("Voice")}
                  />
                  <p>Voice</p>
                </div>
                <div className="chat-content">
                  <input
                    type="checkbox"
                    className="checkboxinput"
                    onChange={() => channelCheckboxChange("Chat")}
                    checked={selectedChannels.includes("Chat")}
                  />

                  <p>Chat</p>
                </div>
                <div className="task-content">
                  <input
                    type="checkbox"
                    className="checkboxinput"
                    onChange={() => channelCheckboxChange("Task")}
                    checked={selectedChannels.includes("Task")}
                  />
                  <p>Task</p>
                </div>
              </div>
              <div className="peracontent">
                <p>
                  If no channel is selected, search will return all contacts
                  within the reporting time range.
                </p>
              </div>
              <div className=" timerange-buttons">
                <button
                  className="timerangeCancel-btn"
                  onClick={() => setChannelPopup(false)}
                >
                  Cancel
                </button>
                <button className="timerangeApply-btn" onClick={handleApply}>
                  Apply
                </button>
              </div>
            </div>
          )}
          {contactpopup && (
            <div className="maincontactstaus-container">
              <p>contact Status</p>
            </div>
          )}
        </div>
        <div className="table-headingcontainer">
          <div className="Table_namecontainer">
            <div className="queuesperformance-edit">
              {isEditing ? (
                <input
                  type="text"
                  value={changeCDRName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  autoFocus
                  className="Queue-editinput"
                />
              ) : (
                <h5>{changeCDRName}</h5>
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
                          <li
                            onClick={() => SelectedFilterOption("CDR-Reports")}
                          >
                            CDR-Reports
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

        <div className="mt-1">
          <div className="table-responsive wrapper-maintable-content-agents">
            {filteredCustomerData.length === 0 ? (
              <p className="NoDatafound">No data found</p>
            ) : (
              <table className="main-table">
                <thead>
                  <tr className="table-header">
                    <th colSpan={1} className="headers">
                      Name
                    </th>

                    {appliedMetrics.includes("Queue") && <th>Queue</th>}
                    {appliedMetrics.includes("DestinationNumber") && (
                      <th>DestinationNumber</th>
                    )}
                    {appliedMetrics.includes("CallerId") && <th>CallerID</th>}
                    {appliedMetrics.includes("UUID") && <th>UUID</th>}

                    {appliedMetrics.includes("AnswerTime") && (
                      <th>AnswerTime</th>
                    )}
                    {/* {appliedMetrics.includes("AnswerTime") && (
                      <th onClick={() => handleSort("AnswerTime")}>
                        AnswerTime{" "}
                        {sortColumn === "AnswerTime" &&
                          (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                    )} */}
                    {appliedMetrics.includes("Direction") && <th>Direction</th>}
                    {appliedMetrics.includes("Duration") && <th>Duration</th>}
                    {appliedMetrics.includes("SipCallId") && (
                      <th>SipCall ID</th>
                    )}

                    {appliedMetrics.includes("StartTime") && <th>StartTime</th>}

                    {appliedMetrics.includes("EndTime") && <th>EndTime</th>}

                    {appliedMetrics.includes("billsec") && <th>billsec</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomerData
                    .slice(pagination.start, pagination.end)
                    .map((item, index) => (
                      <tr
                        key={item.uuid || `key-${index}`}
                        className="table-body-content"
                      >
                        <td className="table-data-name">
                          {item.cc_agent || "null"}
                        </td>

                        {appliedMetrics.includes("Queue") && (
                          <td>{item.cc_queue || "null"}</td>
                        )}

                        {appliedMetrics.includes("DestinationNumber") && (
                          <td>{item.destination_number}</td>
                        )}

                        {appliedMetrics.includes("CallerId") && (
                          <td>{item.caller_id_number}</td>
                        )}
                        {appliedMetrics.includes("UUID") && (
                          <td>{item.uuid}</td>
                        )}

                        {appliedMetrics.includes("AnswerTime") && (
                          <td>
                            {(() => {
                              if (item.answer_stamp === null) {
                                return "null";
                              }

                              const gmtDate = new Date(item.answer_stamp);
                              const istDate = new Date(
                                gmtDate.toLocaleString("en-US", {
                                  timeZone: "Asia/Kolkata",
                                })
                              );

                              const day = gmtDate.toUTCString().split(",")[0];
                              const date = gmtDate
                                .toUTCString()
                                .split(", ")[1]
                                .split(" ")[0];
                              const month = gmtDate.toUTCString().split(" ")[2];
                              const year = gmtDate.toUTCString().split(" ")[3];
                              const time = istDate.toTimeString().split(" ")[0];

                              return `${day}, ${date} ${month} ${year} ${time} IST`;
                            })()}
                          </td>
                        )}
                        {appliedMetrics.includes("Direction") && (
                          <td>{item.direction}</td>
                        )}
                        {appliedMetrics.includes("Duration") && (
                          <td>{item.duration}</td>
                        )}
                        {appliedMetrics.includes("SipCallId") && (
                          <td>{item.sip_call_id || "null"}</td>
                        )}

                        {appliedMetrics.includes("StartTime") && (
                          <td>
                            {(() => {
                              const gmtDate = new Date(item.start_stamp);
                              const istDate = new Date(
                                gmtDate.toLocaleString("en-US", {
                                  timeZone: "Asia/Kolkata",
                                })
                              );

                              const day = gmtDate.toUTCString().split(",")[0];
                              const date = gmtDate
                                .toUTCString()
                                .split(", ")[1]
                                .split(" ")[0];
                              const month = gmtDate.toUTCString().split(" ")[2];
                              const year = gmtDate.toUTCString().split(" ")[3];
                              const time = istDate.toTimeString().split(" ")[0];

                              return `${day}, ${date} ${month} ${year} ${time} IST`;
                            })()}
                          </td>
                        )}

                        {appliedMetrics.includes("EndTime") && (
                          <td>
                            {(() => {
                              const gmtDate = new Date(item.end_stamp);
                              const istDate = new Date(
                                gmtDate.toLocaleString("en-US", {
                                  timeZone: "Asia/Kolkata",
                                })
                              );

                              const day = gmtDate.toUTCString().split(",")[0];
                              const date = gmtDate
                                .toUTCString()
                                .split(", ")[1]
                                .split(" ")[0];
                              const month = gmtDate.toUTCString().split(" ")[2];
                              const year = gmtDate.toUTCString().split(" ")[3];
                              const time = istDate.toTimeString().split(" ")[0];

                              return `${day}, ${date} ${month} ${year} ${time} IST`;
                            })()}
                          </td>
                        )}
                        {appliedMetrics.includes("billsec") && (
                          <td>{item.billsec}</td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <Pagination
          showparPage={postsPerPage}
          paginationChange={(start, end) => setPagination({ start, end })}
          total={customerdata.length}
          counter={currentPage}
          setCounter={setCurrentPage}
          showPerPageHandler={showPerPageHandler}
        />
      </div>
    </div>
  );
};

export default CDRTablemain;

import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
interface DownloadCSV {
  handleDownload: () => void;
  fetchData: () => void;
  handleDownloadExcel: () => void;
  toggleShareOptions: () => void;
}
const MainHeader: React.FC<DownloadCSV> = ({
  handleDownload,
  fetchData,
  handleDownloadExcel,
  toggleShareOptions,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [play, setplay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [actionpopup, setActionpopup] = useState(false);
  const [filterpopup, setFilteringPopup] = useState(false);
  const navigate = useNavigate();

  const backRealtimeMetrics = () => {
    navigate("../Real-timemetrics");
  };

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;

    if (play) {
      interval = setInterval(() => {
        // setCurrentTime(new Date());
        // triggerRefreshAnimation();
        fetchData();
      });
    }

    return () => {
      clearInterval(interval);
    };
  }, [play]);

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

  // const triggerRefreshAnimation = () => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  // };

  const handlePlayPauseClick = () => {
    setplay((prevPlay) => !prevPlay);
    if (!play) {
      setCurrentTime(new Date());
    }
  };

  const OpenActionPopup = () => {
    setActionpopup(!actionpopup);
  };

  const CloseFilteringPopup = () => {
    setFilteringPopup(false);
  };
  return (
    <div className="title-container">
      <h2>Queues Performance-Reports </h2>
      <div className="title-rightsidecontent">
        <div className="update-timecontent">
          <p>Last Update: {formatTime(currentTime)}</p>
        </div>

        {/* <div className="play-Icon" onClick={handlePlayPauseClick}>
          <i
            className={`fa-solid ${play ? "fa-pause" : "fa-play"} PalyIcon`}
          ></i>
        </div> */}

        {/* <div className="refresh-icon">
          <i
            className={`fa-solid fa-rotate-right ${
              isLoading ? "icon-loading" : ""
            }`}
          ></i>
        </div> */}

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
            <div className="Actionlist-content" onClick={CloseFilteringPopup}>
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
  );
};

export default MainHeader;

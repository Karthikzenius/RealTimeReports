import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
const LoginLogout = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [actionpopup, setActionpopup] = useState(false);
  const [filterpopup, setFilteringPopup] = useState(false);

  const navigate = useNavigate();
  const backRealtimeMetrics = () => {
    navigate("../Real-timemetrics");
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

  const OpenAgentActionPopup = () => {
    setActionpopup(!actionpopup);
  };
  const CloseAgentFilteringPopup = () => {
    setFilteringPopup(false);
  };

  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="title-container">
          <h2>Login/Logout-Reports</h2>
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

                    <li
                    // onClick={handleDownload}
                    >
                      Download CVS
                    </li>

                    <li
                    // onClick={toggleShareOptions}
                    >
                      Share reports
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              className="button-26"
              role="button"
              //   onClick={handleDownloadExcel}
            >
              Save report
            </button>
          </div>
        </div>
        <div className="Filters-container">
          <div>
            <h5>Reports Filters</h5>
          </div>
          <div className="timerange-contaner">
            <p>Time range</p>
            <input type="text" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLogout;

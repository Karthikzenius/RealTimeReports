import React from "react";
import "./Realtimemetrics.scss";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faArrowsSplitUpAndLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Realtimemetrics = () => {
  let [curserhover, setCurserHover] = useState(false);
  let [curserpoint, setCurserpoint] = useState(false);
  let [curserhoverrouter, setcurserhoverroutert] = useState(false);
  const [pathName, setPathName] = useState<any>();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("../RealtimeTable");
  };
  useEffect(() => {
    setPathName(location.pathname);
  }, [location, pathName]);
  // Queues
  let buttonstyle = {
    backgroundColor: "",
  };

  if (curserhover) {
    buttonstyle.backgroundColor = "#3b6aa3";
  } else {
    buttonstyle.backgroundColor = "";
  }
  // Queues
  // Agents
  let Agentsbuttonstyle = {
    backgroundColor: "",
  };

  if (curserpoint) {
    Agentsbuttonstyle.backgroundColor = "#3b6aa3";
  } else {
    Agentsbuttonstyle.backgroundColor = "";
  }
  // Agents

  //   Router profile
  let Rourtbuttonstyle = {
    backgroundColor: "",
  };

  if (curserhoverrouter) {
    Rourtbuttonstyle.backgroundColor = "#3b6aa3";
  } else {
    Rourtbuttonstyle.backgroundColor = "";
  }
  //   Router profile

  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="row">
          <div className="col-lg-4">
            <h2>Real-time Metrics</h2>
          </div>
          <div className="row-lg-7 paratest">
            <p>
              Select the primary grouping of the table you would like to start
              your report with.
            </p>
          </div>
          <div className="middle-container">
            {/* Queues */}
            <div className="col-lg-3"></div>
            <div
              className="col-lg-12"
              onClick={handleClick}
              style={buttonstyle}
              onMouseOver={() => setCurserHover(true)}
              onMouseOut={() => setCurserHover(false)}
            >
              <FontAwesomeIcon icon={faSquarePlus} className="queue-icon" />
              <p>Queues</p>
            </div>
            <div
              className="col-lg-10"
              onClick={handleClick}
              onMouseOver={() => setCurserHover(true)}
              onMouseOut={() => setCurserHover(false)}
            >
              <p>A grouping of queues showing their contacts and agents.</p>
            </div>
            {/* Queues */}
            {/* Agent */}
            <div className="col-lg-3"></div>

            <div
              className="col-lg-12"
              style={Agentsbuttonstyle}
              onMouseOver={() => setCurserpoint(true)}
              onMouseOut={() => setCurserpoint(false)}
            >
              <FontAwesomeIcon icon={faUsers} className="queue-icon" />
              <p>Agents</p>
            </div>
            <div
              className="col-lg-10"
              onMouseOver={() => setCurserpoint(true)}
              onMouseOut={() => setCurserpoint(false)}
            >
              <p>Status and metrics for logged-in agents.</p>
            </div>
            {/* Agent */}

            {/* Routing Profile */}
            <div className="col-lg-8"></div>

            <div
              className="col-lg-12"
              style={Rourtbuttonstyle}
              onMouseOver={() => setcurserhoverroutert(true)}
              onMouseOut={() => setcurserhoverroutert(false)}
            >
              <FontAwesomeIcon
                icon={faArrowsSplitUpAndLeft}
                className="queue-icon"
              />
              <p>Routing profiles</p>
            </div>
            <div
              className="col-lg-10"
              onMouseOver={() => setcurserhoverroutert(true)}
              onMouseOut={() => setcurserhoverroutert(false)}
            >
              <p>
                A grouping of routing profiles showing their contacts and
                agents.
              </p>
            </div>
            {/*Routing Profile */}
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Realtimemetrics;

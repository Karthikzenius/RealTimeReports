import React from "react";
import "../RealtimeMetrics/RealTimeMetricsMain.scss";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faArrowsSplitUpAndLeft } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
const RealTimeMetricsMain = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("../RealtimeTable");
  };
  const AgenttableNav = () => {
    navigate("../AgentTableHeader");
  };

  const QueuesPerformanceNav = () => {
    navigate("../QueuesPerformance");
  };
  const AgentsPerformanceNav = () => {
    navigate("../AgentsPerformance");
  };
  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="header-component">
          <div className="Title">
            <h2>Real-time Metrics</h2>
          </div>
        </div>

        <div className="table-content">
          <p>
            Select the primary grouping of the table you would like to start
            your report with.
          </p>
        </div>
        <div className="card-insidecontainer">
          {/* Queues */}
          <Card className="card-insidecontent" onClick={handleClick}>
            <div className="icon-content">
              <i className="fa-solid fa-square-plus queue-icon"></i>
            </div>
            <Card.Body className="color-content">
              <Card.Title className="card-title">Queues</Card.Title>
              <Card.Text className="card-middletext">
                A grouping of queues showing their contacts and agents.
              </Card.Text>
            </Card.Body>
          </Card>
          {/* Queues */}
          {/* Agents */}
          <Card className="card-insidecontent" onClick={AgenttableNav}>
            <div className="Agenticon-content">
              <i className="fa-solid fa-users queue-icon"></i>
            </div>
            <Card.Body className="Agentcolor-content">
              <Card.Title className="card-title">Agents</Card.Title>
              <Card.Text className="card-middletext">
                Status and metrics for logged in agents.
              </Card.Text>
            </Card.Body>
          </Card>
          {/* Agents */}
          {/* QueuesPerformanceNav*/}
          <Card className="card-insidecontent" onClick={QueuesPerformanceNav}>
            <div className="Routingicon-content">
              <i className="fa-solid fa-arrows-split-up-and-left queue-icon"></i>
            </div>
            <Card.Body className="Routingcolor-content">
              <Card.Title className="card-title">Queues Performance</Card.Title>
              <Card.Text className="card-middletext">
                A grouping of Queues Performance showing their queues and
                Performance.
              </Card.Text>
            </Card.Body>
          </Card>
          {/*QueuesPerformanceNav */}
          <Card className="card-insidecontent" onClick={AgentsPerformanceNav}>
            <div className="AgentQueuesicon-content">
              <i className="fa-solid fa-user-plus queue-icon"></i>
            </div>
            <Card.Body className="AgentQueuescolor-content">
              <Card.Title className="card-title">Agents Performance</Card.Title>
              <p className="card-middletext">
                A grouping of Agents Performance showing their Agents and
                Performance.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetricsMain;

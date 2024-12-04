import React from "react";
// import logo from "./logo.svg";
import "./App.css";
import SideNavBar from "./components/navbar/sideNavBar";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import Chat from "./components/chat/chat";
import Email from "./components/email/email";
import DashBoard from "./components/DashboardReports/Dashboards";
import NavBar from "./components/navbar/navBar";
import SoftPhone from "./components/phone/softPhone/softPhone";
import { useState } from "react";
import Realtimemetrics from "./components/RealtimeMetrics/Realtimemetrics";
import RealtimeTable from "./components/RealtimeMetricsTable/RealtimeTable";
import RealTimeMetricsMain from "./components/RealtimeMetrics/RealTimeMetricsMain";
import AgentTableHeader from "./components/RealtimeMetricsTable/AgentTable/AgentTable";
import CDRTable from "./components/CDRTable/CDRTablemain";
import QueuesPerformance from "./components/Queuesperformance/Queuesperformance";
import AgentsPerformance from "./components/AgentsPerformance/AgentsPerformance";
import LoginLogout from "./components/LoginLogout/LoginLogout";
function App() {
  const [openList, setOpenList] = useState<any>(false);

  const OpenListPopup = () => {
    setOpenList(true);
  };
  const CloseListPopup = () => {
    setOpenList(false);
  };
  return (
    <div className="App">
      <NavBar />
      <SideNavBar
        OpenListPopup={OpenListPopup}
        CloseListPopup={CloseListPopup}
      />
      <DashBoard
        OpenListPopup={OpenListPopup}
        CloseListPopup={CloseListPopup}
        openList={openList}
      />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route
          path="/dashboard"
          // element={}
        />
        <Route path="/chat" element={<Chat />} />
        <Route path="/email" element={<Email />} />
        <Route path="/softPhone" element={<SoftPhone />} />
        {/* <Route path="/Real-timemetrics" element={<Realtimemetrics />} /> */}
        <Route path="/Real-timemetrics" element={<RealTimeMetricsMain />} />
        <Route path="/RealtimeTable" element={<RealtimeTable />} />
        <Route path="/AgentTableHeader" element={<AgentTableHeader />} />
        <Route path="/CDRTable" element={<CDRTable />} />
        <Route path="/QueuesPerformance" element={<QueuesPerformance />} />
        <Route path="/AgentsPerformance" element={<AgentsPerformance />} />
        <Route path="/LoginLogout" element={<LoginLogout />} />
      </Routes>
    </div>
  );
}

export default App;

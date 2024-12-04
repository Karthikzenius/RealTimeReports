import { log } from "console";
import react, { ChangeEvent, useState } from "react";
import { agentStateDropDown } from "../commonUtils/agentCommon";
import { agentStateChangeDropDown } from "../../interface/mainavbar/agentStateChange";
import SoftPhone from "../phone/softPhone/softPhone";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const [agentState, setAgentState] = useState<string>("Auxiliary");
  const [agentFields, setAgnetFileds] = useState(agentStateDropDown);
  const [isAgentReady, setIsAgentReady] = useState<boolean>(false);
  const [navSearch, setNavSearch] = useState<any>();
  const [isNavDialPad, setNavDialPad] = useState<boolean>(false);
  const [isNavEmail, setNavEmail] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState<string>("");
  const agentStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changeValue = event.target.value;
    setAgentState(changeValue);
    if (changeValue === "Ready") {
      setTimeout(() => {
        //setIsAgentReady(true);
        navigate("/softPhone");
      }, 1000);
    } else {
      setIsAgentReady(false);
      navigate("/");
    }
  };

  // ====================
  // const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedValue(e.target.value);
  //   console.log("Selected value:", e.target.value); // Debugging to ensure correct value is selected
  // };

  // const getDisplayValue = (value: string) => {
  //   if (value === "on_brake_regular" || value === "on_brake_tea") {
  //     return "On Brake";
  //   }
  //   return value;
  // };
  // ====================
  const agentStateclassName = () => {
    if (agentState === "Ready") {
      return "agentstate-circle-ready";
    } else if (
      agentState === "Not Ready" ||
      agentState === "Auxiliary" ||
      agentState === "Break"
    ) {
      return "agentstate-circle-not-ready";
    } else if (agentState === "After Call Work") {
      return "agentstate-circle-after-work";
    } else {
      return "agentstate-circle-not-ready";
    }
  };
  const phoneIconClassname = () => {
    if (agentState === "Ready") {
      return "fa-solid fa-phone icon-ready";
    } else if (
      agentState === "Not Ready" ||
      agentState === "Auxiliary" ||
      agentState === "Break"
    ) {
      return "fa-solid fa-phone icon-not-ready";
    } else if (agentState === "After Call Work") {
      return "fa-solid fa-phone icon-after-work";
    } else {
      return "fa-solid fa-phone navbar-icon";
    }
  };
  const navDialEmailSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changeValue: any = event.target.value;
    console.log("changeValue", changeValue);

    if (!isNaN(changeValue)) {
      setNavDialPad(true);
      console.log("entering if");
    }
    if (changeValue.includes(".com")) {
      setNavEmail(true);
    } else if (changeValue == null || changeValue == "") {
      setNavDialPad(false);
      setNavEmail(false);
    }
    setNavSearch(changeValue);
  };

  // const agentFields1 = [
  //   { id: 1, value: "available", label: "available" },
  //   { id: 2, value: "logged_out", label: "logged out" },
  //   { id: 3, value: "On Brake", label: "On Brake" },
  //   { id: 4, value: "available (on demand)", label: "available (on demand)" },
  //   { id: 5, value: "On Brake", label: "On Brake" },
  // ];
  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-wrapper">
        <div className="container-fluid">
          <span className="navbar-brand navbar-logo">
            <img
              src="./images/Zeniusitservices.png"
              alt=""
              className="logo-images"
            />
          </span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mynavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mynavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <div className="navbar-search-section">
                  <span>
                    <i className="fa-solid fa-magnifying-glass navbar-search-icon"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control navbar-search-input"
                    placeholder="Search"
                    onChange={(e) => navDialEmailSearch(e)}
                  />
                  <span className="nav-dial-section">
                    {isNavDialPad && <i className="fas fa-th icon-cursor"></i>}
                    {isNavEmail && <i className="fa-solid fa-envelope"></i>}
                  </span>
                </div>
              </li>
              {/* <li className="nav-item">
                <div className="multi-media-section">
                  {isAgentReady && (
                    <SoftPhone setIsAgentReady={setIsAgentReady} />
                  )}
                </div>
              </li> */}
            </ul>
            <div className="icons-wrapper-section">
              <ul className="navbar-nav">
                <li className="nav-item" style={{ paddingRight: "20px" }}>
                  <div>
                    <div className={agentStateclassName()}></div>
                    <select
                      className="form-select agent-state-selection"
                      value={agentState}
                      onChange={(event: any) => agentStateChange(event)}
                    >
                      {agentFields.map(
                        (
                          optionItem: agentStateChangeDropDown,
                          index: number
                        ) => (
                          <option key={index} value={optionItem.value}>
                            {optionItem.label}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </li>
                <li className="nav-item">
                  <i className={phoneIconClassname()}></i>
                </li>
                <li className="nav-item">
                  <i className="fa-solid fa-bell navbar-icon"></i>
                  {/* <i className="fa-solid fa-arrows-to-dot navbar-icon"></i> */}
                </li>
                {/* <li className="nav-item">
                  <i className="fa-solid fa-user navbar-icon"></i>
                </li> */}
                <li className="nav-item">
                  <i className="fa-solid fa-gear navbar-icon"></i>
                </li>
                <li className="nav-item">
                  <i className="fa-solid fa-power-off navbar-icon"></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default NavBar;

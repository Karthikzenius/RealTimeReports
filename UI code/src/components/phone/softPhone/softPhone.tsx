import react, { useState } from "react";
import "./softPhone.scss";
import SoftPhoneFeatures from "../softPhoneFeatures/softPhoneFeatures";
interface Iprops {
  setIsAgentReady?: React.Dispatch<React.SetStateAction<boolean>>;
}
const SoftPhone = (props: Iprops) => {
  const [isCallAnswered, setIsCallAnswered] = useState<boolean>(false);
  const tempData = {
    firstName: "Zenius",
    lastName: "Test",
    phoneNumber: "9182302984",
    queue: "Q6-Autum",
    callType: "Incoming Call...",
    afterlift: "On Call",
  };
  const callAnswered = () => {
    setIsCallAnswered(true);
  };
  const callDeclained = () => {
    // props.setIsAgentReady(false);
    setIsCallAnswered(false);
  };
  return (
    <div>
      <div className="soft-phone-main-wrapper">
        <div
          className={
            isCallAnswered
              ? "soft-phone-main-section-after-answered"
              : "soft-phone-main-section"
          }
        >
          <div className="name-section-wrapper">
            <p className="firstletter-name">
              <span>{tempData.firstName.slice(0, 1)}</span>
              <span>{tempData.lastName.slice(0, 1)}</span>
            </p>
          </div>
          <div className="call-details-section">
            <p>
              <span className="name-wrapper">
                {tempData.firstName}&nbsp;
                {tempData.lastName}
              </span>
              &nbsp;&nbsp;&nbsp;
              <span className="nav-phone-number">{tempData.phoneNumber}</span>
              <br></br>
              <span className="call-queue">{tempData.queue}</span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {isCallAnswered ? (
                <span className="navbar-call-after">{tempData.afterlift}</span>
              ) : (
                <span className="navbar-call-type">{tempData.callType}</span>
              )}
            </p>
          </div>
          <div className="call-answered-section">
            {isCallAnswered ? (
              <div className="d-flex">
                <div>
                  <ul className="navbar-nav call-actions-sections">
                    <li className="nav-item">
                      <i className="fa-solid fa-microphone-slash icon-cursor"></i>
                    </li>
                    <li className="nav-item">
                      <i className="fa-solid fa-pause icon-cursor"></i>
                    </li>
                    <li className="nav-item">
                      <i className="fas fa-th icon-cursor"></i>
                    </li>
                    <li className="nav-item">
                      <i className="fa-solid fa-code-merge icon-cursor"></i>
                    </li>
                    <li className="nav-item">
                      <i className="fa-solid fa-user-plus icon-cursor"></i>
                    </li>
                  </ul>
                </div>
                <div className="call-declined" onClick={() => callDeclained()}>
                  <i className="fa-solid fa-phone"></i>
                </div>
              </div>
            ) : (
              <div
                className="call-answered-wrapper"
                onClick={() => callAnswered()}
              >
                <i className="fa-solid fa-phone"></i>
              </div>
            )}
          </div>
        </div>
      </div>

      <SoftPhoneFeatures></SoftPhoneFeatures>
    </div>
  );
};

export default SoftPhone;

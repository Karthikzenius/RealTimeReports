import React from "react";
import "./softPhoneFeatures.scss";
import "../../../scss/_custome.scss";
const SoftPhoneFeatures = () => {
  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="main-features-wrapper">
          <ul className="nav nav-pills" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="pill" href="#home">
                Call details
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="pill" href="#menu1">
                Classfication
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="pill" href="#menu2">
                Transfer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="pill" href="#menu2">
                Dial pad
              </a>
            </li>
          </ul>
        </div>
        <div className="features-content">
          <div className="tab-content">
            <div id="home" className="container tab-pane active">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div id="menu1" className="container tab-pane fade">
              <h3>Menu 1</h3>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div id="menu2" className="container tab-pane fade">
              <h3>Menu 2</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SoftPhoneFeatures;

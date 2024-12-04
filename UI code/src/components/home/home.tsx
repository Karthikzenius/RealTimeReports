import React from "react";
import "./home.scss";
import "../../scss/_custome.scss"
import MyView from "./MyView";

const Home = () => {
  return (
    <div className="main-body-wrapper-section">
      <div className="sub-wrapper-section">
        <div className="main-features-wrapper-home">
          <ul className="nav nav-pills" role="tablist">
            <div>
              <li className="nav-item">
                <a className="nav-link active" data-bs-toggle="pill" href="#myview">
                  My View
                </a>
              </li>

            </div>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="pill" href="#myAssignment">
                My Assignment
              </a>
            </li>
          </ul>
        </div>
        
        <div className="features-content">
          <div className="tab-content">
            <div id="myview" className="container tab-pane active">
              
              {/* <p>welcome to my view</p> */}
              <MyView/>
            </div>
            <div id="myAssignment" className="container tab-pane fade">
              <h3>Menu 1</h3>
              {/* <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </p> */}
            </div>
           
          </div>
        </div>
  
      </div>

      
      {/* next tab */}
      
    </div>
  );
};
export default Home;

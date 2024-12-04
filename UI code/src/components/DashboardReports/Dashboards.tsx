import react from "react";
import "./Dashboard.scss";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
interface DashBoardprops {
  OpenListPopup: () => void;
  CloseListPopup: () => void;
  openList: boolean;
}
const DashBoard: React.FC<DashBoardprops> = ({
  OpenListPopup,
  CloseListPopup,
  openList,
}) => {
  const [pathName, setPathName] = useState<any>();

  const location = useLocation();

  useEffect(() => {
    setPathName(location.pathname);
  }, [location, pathName]);

  return (
    <div className="main-wrapper">
      {openList && (
        <div
          className="sidenav-list"
          onMouseOver={OpenListPopup}
          onMouseOut={CloseListPopup}
        >
          <ul>
            <li>Analytics and optimization</li>
            <Link to="./Real-timemetrics" className="link-direction">
              <li onClick={CloseListPopup}>Real-time metrics</li>
            </Link>
            <li>Historical Metrics</li>
            <Link to="./LoginLogout" className="link-direction">
              <li>Login/Logout report</li>
            </Link>
            {/* <li>Dashboards and reports</li> */}
            <Link to="./CDRTable" className="link-direction">
              <li onClick={CloseListPopup}>CDR Reports</li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DashBoard;

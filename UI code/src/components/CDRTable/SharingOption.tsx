import React from "react";
import "../CDRTable/SharingOption.scss";
import * as XLSX from "xlsx";

interface SharingDataProps {
  openSharingPopup: boolean;
  shareOptionsVisible: boolean;
  closeSharingPopup: () => void;
}

const SharingOption: React.FC<SharingDataProps> = ({
  openSharingPopup,
  shareOptionsVisible,
  closeSharingPopup,
}) => {
  return (
    <>
      {openSharingPopup && (
        <div className="sharing_popup">
          <div className="closeicon">
            <i
              className="fa-solid fa-x closebtn"
              onClick={closeSharingPopup}
            ></i>
          </div>
          <div className="inside-sharingpopup">
            {shareOptionsVisible && (
              <div className="sharing-icons">
                <div
                  className="Outlook"
                  onClick={() =>
                    window.open("https://outlook.live.com", "_blank")
                  }
                >
                  <img
                    src="https://play-lh.googleusercontent.com/Zk9elS0eGXDr0L4W6-Ey7YwHbRNjkyezHC8iCc8rWp64lNIjlByS8TDF9qDSZbiEWY4"
                    alt="Outlook"
                    className="sharing-img"
                  />
                  <span>Outlook</span>
                </div>
                <div
                  className="Teams"
                  onClick={() =>
                    window.open("https://teams.microsoft.com", "_blank")
                  }
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRquP6Mq-6U3t81GEAiObS4vex9N1-s0VpYNg&s"
                    alt="Teams"
                    className="Teams-img"
                  />
                  <span>Teams</span>
                </div>

                <div
                  className="Gmail"
                  onClick={() =>
                    window.open("https://mail.google.com", "_blank")
                  }
                >
                  <img
                    src="https://m.economictimes.com/thumb/msid-63994786,width-1200,height-900,resizemode-4,imgsize-35146/gmail-gets-a-makeover-heres-how-you-can-make-the-most-of-its-features.jpg"
                    alt="Gmail"
                    className="sharing-img"
                  />
                  <span>Gmail</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SharingOption;

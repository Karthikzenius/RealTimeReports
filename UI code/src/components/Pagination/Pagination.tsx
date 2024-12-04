// import React, { useState, useEffect } from "react";
// import "../Pagination/Pagination.scss";

// interface PaginationProps {
//   total: number;
//   showparPage: number;
//   counter: number;
//   setCounter: React.Dispatch<React.SetStateAction<number>>;
//   paginationChange: (start: number, end: number) => void;
//   showPerPageHandler: (perPage: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   total,
//   showparPage,
//   counter,
//   setCounter,
//   paginationChange,
//   showPerPageHandler,
// }) => {
//   const [pageNo, setPageNo] = useState(1);
//   // console.log("showPerPageHandler::", showPerPageHandler);

//   useEffect(() => {
//     const totalPages = Math.ceil(total / showparPage);
//     setPageNo(counter);
//   }, [counter, showparPage, total]);

//   const onButtonClick = (type: "previous" | "next") => {
//     if (type === "previous") {
//       if (counter > 1) {
//         setCounter(counter - 1);
//       }
//     } else if (type === "next") {
//       const totalPages = Math.ceil(total / showparPage);
//       if (counter < totalPages) {
//         setCounter(counter + 1);
//       }
//     }
//   };

//   const totalPages = Math.ceil(total / showparPage);

//   return (
//     <div className="mainpaginationBox">
//       <div className="row">
//         <div className="col-lg-6">
//           <div>
//             <span className="oneoffive">
//               {(counter - 1) * showparPage + 1} -{" "}
//               {Math.min(total, counter * showparPage)} of {total}
//             </span>
//             <span>
//               <img
//                 src="./images/divider.png"
//                 alt="divider"
//                 className="divider-pagination"
//               ></img>
//             </span>
//             <span className="refresh">Refresh</span>
//           </div>
//         </div>
//         <div className="col-lg-6 textright">
//           <div className="mainflex">
//             <div className="form-group mainselect">
//               <select
//                 className=" selectionbox"
//                 onChange={(e) => {
//                   const perPage = parseInt(e.target.value);
//                   showPerPageHandler(perPage);
//                 }}
//                 value={showparPage}
//               >
//                 <option value="5">5</option>
//                 <option value="10">10</option>
//                 <option value="15">15</option>
//               </select>
//               {/* <select
//                 className="form-select selectionbox"
//                 onChange={(e) => {
//                   const perPage = parseInt(e.target.value);
//                   showPerPageHandler(perPage);
//                 }}
//                 value={showparPage}
//               >
//                 <option>5</option>
//                 <option>10</option>
//                 <option>15</option>
//                 <option>20</option>
//               </select> */}
//             </div>
//             <div className="">
//               <span className="perpage">per page</span>
//             </div>
//             <div>
//               <ul className="pagintioarrow">
//                 <li>
//                   <img
//                     src="./images/left.svg"
//                     alt="left arrow"
//                     onClick={() => onButtonClick("previous")}
//                     className={counter === 1 ? "leftdisabled" : "leftabled"}
//                   />
//                 </li>
//                 <li className="oneofone">
//                   {pageNo} of {totalPages}
//                 </li>
//                 <li>
//                   <img
//                     src="./images/rightarrow.svg"
//                     alt="right arrow"
//                     onClick={() => onButtonClick("next")}
//                     className={
//                       counter === totalPages ? "rightdisabled" : "rightabled"
//                     }
//                   />
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pagination;

import React, { useState, useEffect } from "react";
import "./Pagination.scss";

interface PaginationProps {
  total: number;
  showparPage: number;
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  paginationChange: (start: number, end: number) => void;
  showPerPageHandler: (perPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  showparPage,
  counter,
  setCounter,
  paginationChange,
  showPerPageHandler,
}) => {
  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    setPageNo(counter);
  }, [counter]);

  const onButtonClick = (type: "previous" | "next") => {
    let newCounter = counter;
    if (type === "previous") {
      newCounter = Math.max(1, counter - 1);
    } else if (type === "next") {
      const totalPages = Math.ceil(total / showparPage);
      newCounter = Math.min(totalPages, counter + 1);
    }
    setCounter(newCounter);
    paginationChange((newCounter - 1) * showparPage, newCounter * showparPage);
  };

  const totalPages = Math.ceil(total / showparPage);

  return (
    <div className="mainpaginationBox">
      <div className="pagination-subwrapper">
        <div className="pagination-showperpage">
          <div>
            <span className="oneoffive">
              {Math.min(total, (counter - 1) * showparPage + 1)} -{" "}
              {Math.min(total, counter * showparPage)} of {total}
            </span>
          </div>
        </div>
        <div className="selectionbox-wrapper textright">
          <div className="mainflex">
            <div className="form-group mainselect">
              <select
                className="form-select selectionbox"
                onChange={(e) => {
                  const perPage = parseInt(e.target.value);
                  showPerPageHandler(perPage);
                }}
                value={showparPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
            <div className="">
              <span className="perpage">per page</span>
            </div>
            <div className="page-wrapper">
              <ul className="pagintioarrow">
                <li>
                  <i
                    className={
                      counter === 1
                        ? "fa-solid fa-chevron-left leftdisabled"
                        : "fa-solid fa-chevron-left leftabled"
                    }
                    onClick={() => onButtonClick("previous")}
                  ></i>
                </li>{" "}
                &nbsp; &nbsp;
                <li className="oneofone">
                  {pageNo} of {totalPages}
                </li>{" "}
                &nbsp;
                <li>
                  <i
                    className={
                      counter === totalPages
                        ? " fa-solid fa-chevron-right rightdisabled"
                        : "fa-solid fa-chevron-right rightabled"
                    }
                    onClick={() => onButtonClick("next")}
                  ></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

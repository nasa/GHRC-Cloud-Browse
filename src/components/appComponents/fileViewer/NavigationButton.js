import React from "react";
import {FaArrowLeft, FaArrowRight, FaCheckCircle, FaDownload, FaPrint, FaTimes} from "react-icons/fa";
import {BiCartDownload} from "react-icons/bi";

const NavigationButton = ({ onClick, title, direction, isExist }) => {
   return (
    <span>
      {direction === 'prev' && <FaArrowLeft
        className="printIcon cursorPtr leftRightArrow"
        title={title}
        size={32}
        onClick={onClick}
      />}
      {direction === 'next' && <FaArrowRight
        className="printIcon cursorPtr leftRightArrow"
        title={title}
        size={32}
        onClick={onClick}
      />}
      {direction === 'Close' && <FaTimes
        onClick={onClick}
        title={title}
        className={"printIcon downPrint"}
        size={36}
      />}
      {direction === 'Download as zip' && <BiCartDownload
        className="fa-download-print"
        size={32}
        title="Download as zip"
      />}
      {direction === 'print' && <FaPrint
        className="fa-download-print"
        size={32}
        title="Print"
      />}
      {direction === 'download' && <FaDownload
        className="fa-download-print"
        size={36}
        title="Download"
      />}
      { direction === 'check' && <FaCheckCircle
        className={`fa-download-print ${isExist ? "checked" : "unchecked"}`}
        size={32}
        title="Select"
      />}
    </span>
  );
};

export default NavigationButton;

import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaDownload,
  FaPrint,
  FaTimes,
} from "react-icons/fa";
import printJS from "print-js";
import { BiCartDownload } from "react-icons/bi";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../../universal/FileDownloader";

function TextFileViewer({
  fileUrl,
  addFile,
  rowData,
  handleNavigationClick,
  handleClose,
  isExist,
  setProgress,
  urls,
  showArrowLeft,
  showArrowRight,
}) {
  const [text, setText] = useState("");
  useEffect(() => {
    const cacheBuster = new Date().getTime() + Math.random(); // Generate cache-busting timestamp
    fetch(`${fileUrl}?cache=${cacheBuster}`)
      .then((response) => response.text())
      .then((data) => {
        setText(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fileUrl]);

  const downloadFile = () => {
    const cacheBuster = new Date().getTime() + Math.random(); // Generate cache-busting timestamp
    fetch(`${fileUrl}?cache=${cacheBuster}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileUrl.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  const printFile = () => {
    printJS({
      printable: `<pre>${text}</pre>`,
      type: "raw-html",
      style: `
      @page {
        size: 8.5in 11in;
        margin: 0.5in;
      }
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    `,
    });
  };

  return (
    <div style={{ height: "100%", textAlign: "center" }}>
      <h2 className="file-name">
        {fileUrl.split("/").pop()}
        <span className={"topRight"}>
          <span className={!showArrowLeft ? "disabled-icon" : ""}>
            <FaArrowLeft
              className={"printIcon cursorPtr leftRightArrow"}
              title={"prev"}
              size={32}
              onClick={() => handleNavigationClick(rowData, "left")}
            />
          </span>
          <span className={"printIcon"}>
            <button className={"downPrint"} onClick={printFile}>
              <FaPrint className="fa-download-print" title="Print" size={32} />
            </button>
          </span>
          <span className={"printIcon"}>
            <button className={"downPrint"} onClick={downloadFile}>
              <FaDownload
                className="fa-download-print"
                title="Download"
                size={32}
              />
            </button>
          </span>
          <span className={"printIcon"}>
            <button className={"downPrint"} onClick={() => addFile(rowData)}>
              <FaCheckCircle
                className={`${
                  isExist(rowData)
                    ? "fa-download-print checked"
                    : "fa-download-print unchecked"
                }`}
                size={32}
                title="Download"
              />
            </button>
          </span>
          <span className={"printIcon"}>
            <button
              className={
                "downPrint" + (useProgress() !== 0 ? " disabled-icon" : "")
              }
              onClick={() => FileDownloader(urls, false, setProgress, false)}
            >
              <BiCartDownload
                className="fa-download-print"
                size={32}
                title="Download as zip"
              />
            </button>
          </span>
          <FaTimes
            onClick={() => handleClose(rowData)}
            title={"Close"}
            className={"printIcon downPrint"}
            size={36}
          />
          <span className={!showArrowRight ? "disabled-icon" : ""}>
            <FaArrowRight
              className={"printIcon cursorPtr leftRightArrow"}
              title={"next"}
              size={32}
              onClick={() => handleNavigationClick(rowData, "right")}
            />
          </span>
        </span>
      </h2>
      <div
        style={{
          background: "white",
          border: "1px solid black",
          borderRadius: "4px",
          padding: "8px",
          fontFamily: "Courier New, monospace",
          color: "black",
        }}
      >
        <div key={fileUrl} className={"textScroll"}>
          <pre>{text}</pre>
        </div>
      </div>
    </div>
  );
}

export default TextFileViewer;

import React, { useState, useEffect } from "react";
import printJS from "print-js";
import FileDownloader, {
  useProgress,
} from "../../universal/FileDownloader";
import NavigationButton from "./NavigationButton";

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
           <NavigationButton
             onClick={() => handleNavigationClick(rowData, "left")}
             title={"prev"}
             direction="prev"
           />
          </span>
          <span className={"printIcon"}>
            <button className={"downPrint"} onClick={printFile}>
               <NavigationButton
                 direction="print"
                 title="Print"
               />
            </button>
          </span>
          <span className={"printIcon"}>
            <button className={"downPrint"} onClick={downloadFile}>
              <NavigationButton
                onClick={''}
                direction="download"
                title="Download"
              />
            </button>
          </span>
          <span className={"printIcon"}>
            <button className={"downPrint"} onClick={() => addFile(rowData)}>
              <NavigationButton
                isExist={isExist(rowData)}
                direction="check"
                title="Select"
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
              <NavigationButton
                onClick={''}
                direction="Download as zip"
                title="Download as zip"
              />
            </button>
          </span>
          <NavigationButton
            onClick={() => handleClose(rowData)}
            title={"Close"}
            direction="Close"
          />
          <span className={!showArrowRight ? "disabled-icon" : ""}>
             <NavigationButton
               onClick={() => handleNavigationClick(rowData, "right")}
               title={"next"}
               direction="next"
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

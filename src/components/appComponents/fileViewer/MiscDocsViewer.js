import config from "../../../config";
import { isImage } from "../../../lib/isImage";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../../universal/FileDownloader";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaDownload,
  FaTimes,
} from "react-icons/fa";
import { BiCartDownload } from "react-icons/bi";
import React from "react";

const MiscDocsViewer = ({
  addFile,
  rowData,
  handleNavigationClick,
  handleClose,
  isExist,
  setProgress,
  urls,
  img,
  showArrowLeft,
  showArrowRight,
}) => {
  const folderUrl = img.split("/").filter(Boolean);
  const folderName = folderUrl[folderUrl.length - 1];

  return (
    <div style={{ textAlign: "center", top: "50%", left: "50%" }}>
      <h2 className="file-name">
        {" "}
        {`${config.cloudWatchUrlBase}${img}`.split("/").pop()}
        <span /*style={{ float: 'right' }}*/>
          <span className={"printIcon"}>
            {isImage(img) ? (
              <button
                className={"downPrint"}
                onClick={() =>
                  downloadFile(`${config.cloudWatchUrlBase}${img}`)
                }
              >
                <FaDownload
                  className="fa-download-print"
                  size={40}
                  title="Download"
                />
              </button>
            ) : folderName ? (
              "Folder: " + folderName
            ) : (
              ""
            )}
          </span>
        </span>
      </h2>
      <span /*style={{ float: 'right' }}*/ className={"topRight"}>
        <span className={!showArrowLeft ? "disabled-icon" : ""}>
          <FaArrowLeft
            className={"printIcon cursorPtr leftRightArrow"}
            title={"prev"}
            size={32}
            onClick={() => handleNavigationClick(rowData, "left")}
          />
        </span>
        <span className={"printIcon"}>
          <button className={"downPrint"} onClick={() => addFile(rowData)}>
            <FaCheckCircle
              className={`fa-download-print ${
                isExist(rowData) ? "checked" : "unchecked"
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
    </div>
  );
};

export default MiscDocsViewer;

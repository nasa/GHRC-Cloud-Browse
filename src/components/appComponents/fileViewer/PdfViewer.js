import { Viewer, Worker } from "@react-pdf-viewer/core";
import config from "../../../config";
import React from "react";
import * as pdfjs from "pdfjs-dist";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaDownload,
  FaPrint,
  FaTimes,
} from "react-icons/fa";
import printJS from "print-js";
import { isImage } from "../../../lib/isImage";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../../universal/FileDownloader";
import { BiCartDownload } from "react-icons/bi";

const PdfViewer = ({
  handleNavigationClick,
  img,
  addFile,
  isExist,
  setProgress,
  handleClose,
  filePath,
  urls,
  rowData,
  showArrowRight,
  showArrowLeft,
}) => {
  const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <span className={"topCenter"}>
          <h2 className="file-name">
            {" "}
            {`${config.cloudWatchUrlBase}${img}`.split("/").pop()}
          </h2>
        </span>
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
            <button
              className={"downPrint"}
              onClick={() =>
                printJS({
                  printable: `${config.cloudWatchUrlBase}${img}`,
                  type: isImage(img) !== "pdf" ? "image" : "pdf",
                })
              }
            >
              <FaPrint className="fa-download-print" size={32} title="Print" />
            </button>
          </span>
          <span className={"printIcon"}>
            <button
              className={"downPrint"}
              onClick={() => downloadFile(`${config.cloudWatchUrlBase}${img}`)}
            >
              <FaDownload
                className="fa-download-print"
                size={32}
                title="Download"
              />
            </button>
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
      <Worker workerUrl={workerSrc}>
        {" "}
        <div
          className="rpv-core__viewer"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            height: "80%",
            width: "70%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#eeeeee",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              padding: "4px",
            }}
          >
            <Toolbar>
              {(props) => {
                const {
                  CurrentPageInput,
                  EnterFullScreen,
                  GoToNextPage,
                  GoToPreviousPage,
                  NumberOfPages,
                  ShowSearchPopover,
                  Zoom,
                  ZoomIn,
                  ZoomOut,
                } = props;
                return (
                  <>
                    <div style={{ padding: "0px 2px" }}>
                      <ShowSearchPopover />
                    </div>
                    <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                      <EnterFullScreen />
                    </div>
                    <div style={{ padding: "0px 2px" }}>
                      <ZoomOut />
                    </div>

                    <div style={{ padding: "0px 2px" }}>
                      <Zoom />
                    </div>
                    <div style={{ padding: "0px 2px" }}>
                      <ZoomIn />
                    </div>
                    <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
                      <GoToPreviousPage />
                    </div>
                    <div style={{ padding: "0px 2px", width: "4rem" }}>
                      <CurrentPageInput />
                    </div>
                    <div style={{ padding: "0px 2px", color: "black" }}>
                      / <NumberOfPages />
                    </div>
                    <div style={{ padding: "0px 2px" }}>
                      <GoToNextPage />
                    </div>
                  </>
                );
              }}
            </Toolbar>
          </div>
          <div
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Viewer
              fileUrl={`${config.cloudWatchUrlBase}${img}`}
              plugins={[toolbarPluginInstance]}
              defaultScale={1.25}
            />
          </div>
        </div>
      </Worker>
    </>
  );
};

export default PdfViewer;

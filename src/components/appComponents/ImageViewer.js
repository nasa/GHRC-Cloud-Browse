import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaDownload,
  FaPrint,
  FaTimes,
} from "react-icons/fa";
import printJS from "print-js";
import config from "../../config";
import { isImage } from "../../lib/isImage";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../universal/FileDownloader";
import { BiCartDownload, BiZoomIn, BiZoomOut } from "react-icons/bi";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { TbZoomReset } from "react-icons/tb";
import React, { useRef, useState } from "react";

const ImageViewer = ({
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
  //**********State Variables**********

  const transformComponentRef = useRef(null);
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    const { current: transformComponent } = transformComponentRef;
    if (transformComponent) {
      setScale((prevScale) => prevScale + 0.1);
    }
  };

  const handleZoomOut = () => {
    const { current: transformComponent } = transformComponentRef;
    if (transformComponent) {
      setScale((prevScale) => prevScale / 1.1);
    }
  };

  const handleZoomReset = () => {
    const { current: transformComponent } = transformComponentRef;
    if (transformComponent) {
      const { resetTransform } = transformComponent;
      resetTransform();
      setScale(1);
    }
    //setScale(1);
  };

  console.log("useProgress->", useProgress());
  return (
    <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
      <span /*style={{ float: 'right' }}*/ className={"topRight"}>
        <span className={!showArrowLeft ? "disabled-icon" : ""}>
          {" "}
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
      <h2 className="file-name">
        {" "}
        {`${config.cloudWatchUrlBase}${img}`.split("/").pop()}
      </h2>

      <div className="image-zoom">
        <div className="image-container">
          <TransformWrapper
            key={filePath}
            ref={transformComponentRef}
            options={{ limitToBounds: false, wheel: false, pinch: false }}
          >
            <TransformComponent>
              <img
                key={filePath}
                src={filePath}
                alt={"Zoomable Image" + filePath}
                style={{ transform: `scale(${scale})` }}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
        <div className={"container"}>
          <div className="zoom-buttons">
            <button
              className={"cursorPtr img-zoom-in-out"}
              onClick={handleZoomIn}
            >
              <BiZoomIn size={40} />
            </button>
            <button
              className={"cursorPtr img-zoom-in-out"}
              onClick={handleZoomOut}
            >
              <BiZoomOut size={40} />
            </button>
            <button
              className={"cursorPtr img-zoom-in-out"}
              onClick={handleZoomReset}
            >
              <TbZoomReset size={40} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;

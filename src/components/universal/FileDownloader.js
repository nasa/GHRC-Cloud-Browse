import config from "../../config";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useState, useEffect } from "react";

let cancelFlag = false;

export const cancelDownload = () => {
  cancelFlag = true;
};

// progress.js
let progress = 0;
let subscribers = [];

export const updateProgress = (value) => {
  progress = value;
  subscribers.forEach((subscriber) => subscriber(progress));
};

export const subscribeProgress = (callback) => {
  subscribers.push(callback);
};

export const unsubscribeProgress = (callback) => {
  subscribers = subscribers.filter((subscriber) => subscriber !== callback);
};

export const getProgress = () => {
  return progress;
};

export const useProgress = () => {
  const [progressValue, setProgressValue] = useState(getProgress());

  const handleProgressUpdate = (value) => {
    setProgressValue(value);
  };

  useEffect(() => {
    subscribeProgress(handleProgressUpdate);
    return () => {
      unsubscribeProgress(handleProgressUpdate);
    };
  }, []);

  return progressValue;
};

const downloader = async (linkList, setShow, setProgress, zipFlag) => {
  try {
    const zip = new JSZip();
    const maxFileSizeToZip = 200
    const filesGreaterThanX_MB = linkList.filter((file) => file.Size > (maxFileSizeToZip * 1024 * 1024));
    const folderCountSearch = linkList.filter((file) => !file.Size);
    let counter = 1;

    for (const link of linkList) {
      if (cancelFlag) {
        updateProgress(100);
        setProgress(100);
        break;
      }

      if (link && link.Size) {
        const cacheBuster = new Date().getTime() + Math.random();
        const url = `${config.cloudWatchUrlBase}${link["Key"]}?cache=${cacheBuster}`;
        const res = await fetch(url);
        const blob = await res.blob();
        const fileSizeMB = blob.size / (1024 * 1024);
        const fileName = link["Key"].split("/").pop();

        const counterValue = (counter / (linkList.length - filesGreaterThanX_MB.length - folderCountSearch.length)) * 100
        if (typeof setProgress === "function") {
          updateProgress(counterValue);
          setProgress(counterValue);
        }
        counter += 1;
        if (fileSizeMB <= (maxFileSizeToZip/1024 * 1024) && !zipFlag) {
          zip.file(fileName, blob);
        } else {
          saveAs(blob, fileName);
        }
      } else {
        if (typeof setShow === "function") setShow(true);
      }
    }

    if (Object.keys(zip.files).length > 0) {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipFileName = linkList[0] && linkList[0].Key? (linkList[0].Key.split('/')[1])+'_'+linkList[0].Key.split('/')[2]+'.zip':'download.zip';
      saveAs(zipBlob, zipFileName);
      updateProgress(100);
    } else {
      console.log("No files to download.");
    }
  } catch (error) {
    console.error("Error during download:", error);
  } finally {
    cancelFlag = false;
  }
};

export const downloadFile = async (fileUrl) => {
  try {
    const cacheBuster = new Date().getTime() + Math.random();
    const response = await fetch(`${fileUrl}?cache=${cacheBuster}`);
    const blob = await response.blob();
    const fileName = fileUrl.split("/").pop();
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

export default downloader;

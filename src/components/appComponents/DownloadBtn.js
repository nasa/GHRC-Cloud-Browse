import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FileDownloader from "../universal/FileDownloader";
import { updateProgress, useProgress } from "../universal/FileDownloader";
import { MoonLoader  } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DownloadBtn = ({ setShow, setfilesCount }) => {
  const selectedList = useSelector((state) => state.selectedList.value);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    //helps prevent download every time a row is selected
    setProgress(1)
    let sumSize = 0
    let count = 0
    for (const link of selectedList) {
      if (link && !link.Size) {
        count += 1
      }else{
        sumSize += 1
      }
    }
    setfilesCount(sumSize)

    if (count === selectedList.length){
      setIsLoading(false);
      setProgress(1);
    }

    if(count > 1){
      handleFolder()
    }

    FileDownloader(selectedList, setShow, setProgress);
    updateProgress(progress);
  };

  const handleShowToast = () => {
    toast.info('Files are being zipped!', {
      position: "bottom-center",
      autoClose: 5000, // Time in milliseconds to close the toast automatically
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleFolder = () => {
    toast.info('Folder download not supported at this time', {
      position: "bottom-center",
      autoClose: 6000, // Time in milliseconds to close the toast automatically
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  if (progress == 100) {
    updateProgress(0);
    setProgress(0);
    setIsLoading(false);
  }


  useEffect(() => {
    if (progress > 1) {
      setIsLoading(false);
    }
  }, [progress]);


  return (
    <div>
      {isLoading && (
        <div className="loading-container">
          <MoonLoader  color="#1976d2" size={50} />
        </div>
      ) }
      <Button
        onClick={() => {
          handleClick();
          handleShowToast();
        }}
        variant="outlined"
        sx={{ ml: 13, borderRadius: 2 }}
        disabled={ (useProgress() !== 0 && progress !== 0)}
      >
        Download
      </Button>
      <ToastContainer />
    </div>
  );
};

export default DownloadBtn;

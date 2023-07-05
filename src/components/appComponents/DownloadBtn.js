import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FileDownloader from "../universal/FileDownloader";
import { updateProgress, useProgress } from "../universal/FileDownloader";
import { MoonLoader  } from 'react-spinners';

const DownloadBtn = ({ setShow }) => {
  const selectedList = useSelector((state) => state.selectedList.value);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    //helps prevent download every time a row is selected
    setProgress(1)
    FileDownloader(selectedList, setShow, setProgress);
    updateProgress(progress);
  };

  if (progress == 100) {
    updateProgress(0);
    setProgress(0);
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
        }}
        variant="outlined"
        sx={{ ml: 13, borderRadius: 2 }}
        disabled={useProgress() !== 0 || progress !== 0}
      >
        Download
      </Button>
    </div>
  );
};

export default DownloadBtn;

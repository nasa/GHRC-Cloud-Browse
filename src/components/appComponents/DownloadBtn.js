import { Button } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import FileDownloader from "../universal/FileDownloader";
import { updateProgress, useProgress } from "../universal/FileDownloader";

const DownloadBtn = ({ setShow }) => {
  const selectedList = useSelector((state) => state.selectedList.value);
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    //helps prevent download every time a row is selected
    FileDownloader(selectedList, setShow, setProgress);
    updateProgress(progress);
  };

  if (progress === 100) {
    updateProgress(0);
    setProgress(0);
  }

  return (
    <div>
      <Button
        onClick={() => {
          handleClick();
        }}
        variant="outlined"
        sx={{ ml: 13, borderRadius: 2 }}
        disabled={useProgress() !== 0}
      >
        Download
      </Button>
    </div>
  );
};

export default DownloadBtn;

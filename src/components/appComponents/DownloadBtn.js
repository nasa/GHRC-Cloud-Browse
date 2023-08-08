import { Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FileDownloader from "../universal/FileDownloader";
import { updateProgress, useProgress } from "../universal/FileDownloader";
import { MoonLoader  } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const DownloadBtn = ({ setShow, setfilesCount }) => {
  const selectedList = useSelector((state) => state.selectedList.value);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (flag) => {
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

    if (count === selectedList.length){
      setIsLoading(false);
      setProgress(1);
    }

    if(count > 0){
      handleFolder()
    }

    handleShowToast(flag);
    FileDownloader(selectedList, setShow, setProgress, flag);
    updateProgress(progress);
    handleClose();
  };

  const handleShowToast = (flag) => {
    let text = flag? "Files not zipped!":"Files are zipped!"
    toast.info(text, {
      position: "bottom-center",
      autoClose: 5000, // Time in milliseconds to close the toast automatically
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        fontWeight: 'bold'
      },
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
      style: {
        fontWeight: 'bold'
      },
    });
  };

  if (progress === 100) {
    updateProgress(0);
    setProgress(0);
    setIsLoading(false);
  }


  useEffect(() => {
    if (progress > 1) {
      setIsLoading(false);
    }
  }, [progress]);

  const handleClick2= (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to count occurrences of undefined Size in selectedList
  function countUndefinedSize(selectedList) {
    let count = 0;
    for (const item of selectedList) {
      if (item.Size === undefined) {
        count++;
      }
    }
    return count;
  }

  // Get the count of undefined Size in selectedList
  const undefinedSizeCount = countUndefinedSize(selectedList);

  return (
    <div>
      {isLoading && (
        <div className="loading-container">
          <MoonLoader  color="#1976d2" size={50} />
        </div>
      ) }
      <div>
        <Button
          variant="outlined"
          sx={{ ml: 13, borderRadius: 2 }}
          onClick={handleClick2}
          disabled={ (useProgress() !== 0 && progress !== 0) || selectedList.length === 0 || (selectedList.length === undefinedSizeCount) }
        >
          DOWNLOAD
        </Button>
        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={()=> handleClick(false)} disabled={ (useProgress() !== 0 && progress !== 0)}>Download as Zip</MenuItem>
          <MenuItem onClick={()=> handleClick(true)} disabled={ (useProgress() !== 0 && progress !== 0)}>Download Files</MenuItem>
        </Menu>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DownloadBtn;

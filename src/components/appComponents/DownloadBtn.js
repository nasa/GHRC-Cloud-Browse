import { Button } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { saveAs } from 'file-saver';
import config from '../../config';
import FileDownloader from "../universal/FileDownloader";

const DownloadBtn = ({setShow}) => {
    const selectedList = useSelector(state => state.selectedList.value)
    const handleClick = () => {
        //helps prevent download every time a row is selected
        FileDownloader(selectedList, setShow)
    }

  return (
    <div>
    <Button
    onClick={() => {handleClick()}}
    variant='outlined'
    sx={{ml: 13, borderRadius: 2}}>
        Download
    </Button>
    </div>
  )
}

export default DownloadBtn

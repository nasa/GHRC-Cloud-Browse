import { Button } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { saveAs } from 'file-saver';
import config from '../../config';

const DownloadBtn = ({setShow}) => {
    const selectedList = useSelector(state => state.selectedList.value)

    const handleClick = () => {
        //helps prevent download every time a row is selected
        downloader(selectedList)
    }

    const downloader = (linkList) => {
        linkList.forEach((link) =>{
            if(link && link.Size){
                fetch(`${config.cloudWatchUrlBase}${link['Key']}`)
                    .then(res => res.blob())
                    .then(blob => {
                        saveAs(blob, link['Key'].split('/').pop())
                    })
            }else{
                setShow(true)
            }
        })
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

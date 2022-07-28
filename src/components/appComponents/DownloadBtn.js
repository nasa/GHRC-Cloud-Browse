import { Button } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { saveAs } from 'file-saver';

const DownloadBtn = () => {
    const selectedList = useSelector(state => state.selectedList.value)


    const handleClick = () => {
        //helps prevent download every time a row is selected
        downloader(selectedList)
    }

    const downloader = (linkList) => {
        linkList.forEach((link) =>{
            fetch(`https://d29dkgeibpazuv.cloudfront.net/${link['Key']}`)
                .then(res => res.blob())
                .then(blob => {
                    saveAs(blob, link['Key'].split('/').pop())
                })
        })
    }


  return (
    <div>
    <Button
    onClick={() => {handleClick()}}
    variant='outlined'
    sx={{ml: 2}}>
        Download
    </Button>
    </div>
  )
}

export default DownloadBtn
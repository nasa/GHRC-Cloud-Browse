import { Button } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { saveAs } from 'file-saver';
import config from '../../config';

const GetURLBtn = () => {
    const selectedList = useSelector(state => state.selectedList.value)


    const handleClick = () => {
        //helps prevent download every time a row is selected
        downloader(selectedList)
    }

    const downloader = (linkList) => {
        console.log(linkList)
        var url = window.location.href;
        var urlPlain = url.split('#')[0].slice(0,-1)
        
        console.log(urlPlain)
        // console.log(urlPlain)
        linkList.forEach((path) =>{
            console.log(urlPlain +'#'+path['Key'])
        })
        // linkList.forEach((link) =>{
        //     fetch(`${config.cloudWatchUrlBase}${link['Key']}`)
        //         .then(res => res.blob())
        //         .then(blob => {
        //             saveAs(blob, link['Key'].split('/').pop())
        //         })
        // })
    }


  return (
    <div>
    <Button
    onClick={() => {handleClick()}}
    variant='outlined'
    sx={{ml: 13, borderRadius: 2}}>
        Get URL
    </Button>
    </div>
  )
}

export default GetURLBtn
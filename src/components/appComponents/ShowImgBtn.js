import { Box, Button } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import React from 'react'
import config from '../../config'
import { useSelector } from 'react-redux'

const ShowImgBtn = () => {
       //not finnished until bucket structure is complete
    const selectedList = useSelector(state => state.selectedList.value)
    const delim = useSelector(state => state.delim.value)
    const [open, setOpen] = React.useState(false);
    const supportedImg = ['jpg', 'png', 'gif']

    const isImg = () => {
        //checks if a file is a valid img
        return supportedImg.some(element => {
            if (selectedList[0]["Key"].split('.').pop() === element){
                return true
            }
            return false
        })
    }

    const checkDisabled = () => {
        //check to see if selected granule is a valid img
        if(selectedList.length !== 1){
            return true
        }else if (delim === '/'){
            return true
        }else if (typeof selectedList[0]["Key"] === 'undefined'){
            return true
        }else if (isImg){
            return false
        } else {
            console.log('true')
            return true
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleToggle = () => {
        setOpen(!open);
    }

    return (
        <>
            <Button variant='outlined' sx={{ml: 15}}
            onClick={handleToggle}
            disabled= {checkDisabled()}>
                Show Image
            </Button>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <Box component='img'
                    src={checkDisabled() ? '' :`${config.cloudWatchUrlBase}${selectedList[0]['Key']}`} 
                    />
            </Backdrop>
        </>
    )
}

export default ShowImgBtn
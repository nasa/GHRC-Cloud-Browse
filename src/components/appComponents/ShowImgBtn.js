import { Box, Button } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import React from 'react'

const ShowImgBtn = () => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };
    return (
        <>
            <Button variant='outlined' sx={{ml: 15}}
            onClick={handleToggle}>
                Show Image
            </Button>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <Box component='img'
                    src='https://picsum.photos/800/600' 
                    />
            </Backdrop>
        </>
    )
}

export default ShowImgBtn
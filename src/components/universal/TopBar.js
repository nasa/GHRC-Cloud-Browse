import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React from 'react'

const TopBar = () => {

  return (
    <AppBar position="relative"sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#2276AC' }}>
        <Toolbar>
            <Box
            sx={{width: 85}}
            component='img' 
            src='ghrc_logo.png'/>
            <Typography variant="h5" noWrap component="div" sx={{ml: 2}}>
                Browse UI
            </Typography>
        </Toolbar>
    </AppBar>
  )
}

export default TopBar
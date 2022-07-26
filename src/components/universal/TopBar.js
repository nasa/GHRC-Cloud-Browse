import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'

const TopBar = () => {

  return (
    <AppBar position="relative" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            <Typography variant="h6" noWrap component="div">
                GHRC Browse UI
            </Typography>
        </Toolbar>
    </AppBar>
  )
}

export default TopBar
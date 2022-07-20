import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

const TopBar = () => {
  const gSearch = useSelector((state)=>state.search.value)

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            <Typography variant="h6" noWrap component="div">
                GHRC Browse UI
            </Typography>
            <Typography variant='body1' noWrap marginLeft={2}>
              {gSearch}
            </Typography>
        </Toolbar>
    </AppBar>
  )
}

export default TopBar
import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'

export const Footer = () => {
  return (
    <AppBar position="relative" color='grey' sx={{top:'auto', bottom:0}}>
        <Toolbar>
            <Typography variant='caption'>
                footer info here
            </Typography>
        </Toolbar>
    </AppBar>
  )
}

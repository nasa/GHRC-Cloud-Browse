import { Box, Typography } from '@mui/material'
import React from 'react'

const PageNotFound = () => {
  return (
    <Box  display='flex' justifyContent='center' margin= {44}>
        <Typography variant='h3' component='div'>
            404 Page Not Found
        </Typography>
    </Box>
  )
}

export default PageNotFound
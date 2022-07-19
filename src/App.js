import { AppBar, Box, CssBaseline, Typography } from '@mui/material'
import React from 'react'
import TopBar from './components/universal/TopBar'
import { useGetGranulesQuery } from './feature/api/apiSlice'

const App = () => {
    const {
        data: granList,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetGranulesQuery()

    let content
    if(isLoading){
        content = <></>
    } else if (isSuccess){
        content = <>Success</>
        console.log(granList)
    } else if (isError){
        content= <>{error.toString()}</>
    }

  return (
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar />
        <Typography margin={10}>test {content}</Typography>
    </Box>
  )
}

export default App
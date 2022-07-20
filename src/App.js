import { Box, CssBaseline, Typography } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import TopBar from './components/universal/TopBar'
import { useGetGranulesQuery } from './feature/api/apiSlice'

const App = () => {

  return (
    <div>
        <CssBaseline />
        <TopBar />
        <Outlet/>
    </div>
  )
}

export default App
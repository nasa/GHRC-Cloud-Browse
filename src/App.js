import { Box } from '@mui/material'
import React from 'react'
import ResultsTable from './components/appComponents/ResultsTable'
import SearchBar from './components/appComponents/SearchBar'



const App = () => {

  return (
    <>
      <Box display='flex' justifyContent='center' margin={2}>
        <SearchBar />
      </Box>
      <Box display='flex' justifyContent='center' margin={2}>
        <ResultsTable/>
      </Box>
    </>
  )
}

export default App
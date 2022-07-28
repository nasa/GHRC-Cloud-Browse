import { Box } from '@mui/material'
import React, { useState } from 'react'
import ResultsTable from './components/appComponents/ResultsTable'
import SearchBar from './components/appComponents/SearchBar'
import ShowImgBtn from './components/appComponents/ShowImgBtn'



const App = () => {
  const [skip, setSkip] = useState(false)

  const setSkipTrue = () =>{setSkip(true)}
  const setSkipFalse = () =>{setSkip(false)}

  return (
    <>
      <Box display='flex' justifyContent='center' margin={2}>
        <SearchBar setSkipFalse={setSkipFalse} />
      </Box>
      <Box display='flex'>
        <ShowImgBtn />
      </Box>
      <Box display='flex' justifyContent='center' margin={2}>
        <ResultsTable skip={skip} setSkipTrue={setSkipTrue}/>
      </Box>
    </>
  )
}

export default App
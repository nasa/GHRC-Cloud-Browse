import { Box } from '@mui/material'
import React, { useState } from 'react'
import DownloadBtn from './components/appComponents/DownloadBtn'
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
        <DownloadBtn />
      </Box>
      <Box display='flex' justifyContent='center' margin={2}>
        <ResultsTable skip={skip} setSkipTrue={setSkipTrue} setSkipFalse={setSkipFalse}/>
      </Box>
    </>
  )
}

export default App
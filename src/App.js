import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import BreadCrumbs from './components/appComponents/BreadCrumbs'
import DownloadBtn from './components/appComponents/DownloadBtn'
import GetURLBtn from './components/appComponents/GetURLBtn'
import ResultsTable from './components/appComponents/ResultsTable'
import SearchBar from './components/appComponents/SearchBar'
import { useDispatch, useSelector } from 'react-redux'
import { setDelim } from './feature/delimSlice'
import { setSearch } from './feature/searchSlice'
import { setCrumb } from './feature/crumbSlice'
import { isImage } from './lib/isImage'

const App = () => {
  const [skip, setSkip] = useState(false)

  const setSkipTrue = () =>{setSkip(true)}
  const setSkipFalse = () =>{setSkip(false)}
  const dispatch = useDispatch()
  // console.log(window.location.href);
  var url = window.location.href;
  var params = url.split('#')[1]
  // console.log(url.split('#')[1]);  
  useEffect(() => {
    if(params !== undefined){
      setSkipFalse()
      dispatch(setDelim('/'))
      console.log(params);
      dispatch(setSearch(params))
      dispatch(setCrumb(params))
      // dispatch(setCrumb(params))
      
    }

  }, [params])

  
  return (
    <>
      <Box display='flex' justifyContent='center' margin={2}>
        <SearchBar setSkipFalse={setSkipFalse} />
      </Box>
      <Box display='flex'>
        <DownloadBtn />
        <GetURLBtn />
      </Box>
      <BreadCrumbs setSkipFalse={setSkipFalse}/>
      <Box display='flex' justifyContent='center' margin={2} sx={{pb:2}}>
        <ResultsTable skip={skip} setSkipTrue={setSkipTrue} setSkipFalse={setSkipFalse}/>
      </Box>
    </>
  )
}

export default App
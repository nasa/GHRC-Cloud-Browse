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
import config from './config'
import { alpha, Backdrop } from '@mui/material'
const App = () => {
  const [skip, setSkip] = useState(false)

  const setSkipTrue = () =>{setSkip(true)}
  const setSkipFalse = () =>{setSkip(false)}

  const dispatch = useDispatch()
  // console.log(window.location.href);
  var url = window.location.href;
  var params = url.split('#')[1]
  const [open, setOpen] = useState(false)
    const [img, setImg] = useState('')

  // console.log(url.split('#')[1]);
  useEffect(() => {
    if(params !== undefined && params !==''){
      setSkipFalse()
      dispatch(setDelim('/'))
      console.log(params);
      dispatch(setSearch(params))
      dispatch(setCrumb(params))

      if (isImage(params)){
        console.log('in')
        setImg(params)
        handleToggle()
    }
      // dispatch(setCrumb(params))

    }

  }, [params])
  const handleClose = () => {
    setOpen(false)
    setImg('')
}
const handleToggle = () => {setOpen(!open);}

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
      <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
        >
            <Box component='img'
                src={!isImage(img) ? '' :`${config.cloudWatchUrlBase}${img}`}
                />
        </Backdrop>
    </>
  )
}

export default App

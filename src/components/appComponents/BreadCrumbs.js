import { Box, Breadcrumbs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setDelim } from '../../feature/delimSlice'
import { setSearch } from '../../feature/searchSlice'
import { setCrumb } from '../../feature/crumbSlice'
import {FaArrowLeft, FaHome} from "react-icons/fa";
//import { useLocation } from "react-router-dom";
const BreadCrumbs = ({ setSkipFalse }) => {
    const [crumbArray, setCrumbArray] = useState([])
    const crumb = useSelector(state => state.crumb.value)
    const dispatch = useDispatch()

    useEffect(()=>{
        let rawPath = ''
        let tempCrumbs = []
        const crumbs = crumb.split('/')
        crumbs.forEach((crmb)=>{
            if(crmb !== ''){
                rawPath = `${rawPath}${crmb}/`
                tempCrumbs.push({"crmb":crmb, "path":rawPath})
            }
        })
        setCrumbArray(tempCrumbs)
    }, [crumb])

    const updateBrowserURL  = (id) => {
        var currentUrl = window.location.href;
        // Modify the URL
        var newUrl =  '#' + id;
        // Change the URL without reloading the page
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    const handleCrumbClick = (crmb) =>{
        console.log('crmb',crmb)
        var displayString = crmb['path']
        console.log(displayString)
        setSkipFalse()
        dispatch(setDelim('/'))
        dispatch(setSearch(crmb['path']))
        dispatch(setCrumb(displayString))
        updateBrowserURL(displayString)

    }


    const handleRootClick = () =>{
        console.log('Execute')
        setSkipFalse()
        dispatch(setDelim('/'))
        dispatch(setSearch('pub/'))
        dispatch(setCrumb(''))
        updateBrowserURL('')
    }

    useEffect(() => {
        const handleBackButton = () => {
            if(crumbArray && crumbArray.length > 1)handleCrumbClick(crumbArray[crumbArray.length -2])
        };
        window.addEventListener('popstate', handleBackButton);
        return () => window.removeEventListener('popstate', handleBackButton);
    }, [crumbArray]);


  return (
      <Box sx={{ml: 15, mt:1}}>
          <Breadcrumbs>
              <Typography onClick={() => handleRootClick()} sx={{cursor:"pointer"}}>
                  <FaHome/> Root
              </Typography>
              {crumbArray.map((crmb)=>(
                  crmb['crmb'] !== 'pub'?
                      <Typography onClick={() => handleCrumbClick(crmb)} sx={{cursor:"pointer"}}>
                          {crmb['crmb']}
                      </Typography>:""
              ))}
              {/*{<span> {crumbArray && crumbArray.length > 1 ? <button className={"backButton"} onClick={() => handleCrumbClick(crumbArray[crumbArray.length -2])}> <FaArrowLeft/> <span>Back</span></button>:
                  crumbArray.length == 2? <button className={"backButton"} onClick={() => handleRootClick()}> <FaArrowLeft/> <span>Back</span></button>:<button className={"backButton disabledButton"} disabled={true}> <FaArrowLeft/> <span>Back</span></button>}
        </span>}*/}}
          </Breadcrumbs>

      </Box>
  )
}

export default BreadCrumbs

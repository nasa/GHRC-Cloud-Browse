import { Box, Breadcrumbs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setDelim } from '../../feature/delimSlice'
import { setSearch } from '../../feature/searchSlice'
import { setCrumb } from '../../feature/crumbSlice'

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
        setSkipFalse()
        dispatch(setDelim('/'))
        dispatch(setSearch(crmb['path']))
        dispatch(setCrumb(crmb['path']))
        updateBrowserURL(crmb['path'])

    }

    
    const handleRootClick = () =>{
        setSkipFalse()
        dispatch(setDelim('/'))
        dispatch(setSearch(''))
        dispatch(setCrumb(''))
        updateBrowserURL('')
    }

  return (
    <Box sx={{ml: 15, mt:1}}>
        <Breadcrumbs>
            <Typography onClick={() => handleRootClick()} sx={{cursor:"pointer"}}>
                Root
            </Typography>
            {crumbArray.map((crmb)=>(
                <Typography onClick={() => handleCrumbClick(crmb)} sx={{cursor:"pointer"}}>
                    {crmb['crmb']}
                </Typography>
            ))}
        </Breadcrumbs>
    </Box>
  )
}

export default BreadCrumbs
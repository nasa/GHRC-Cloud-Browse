import { Box, Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setDelim } from '../../feature/delimSlice'
import { setSearch } from '../../feature/searchSlice'
import { setCrumb } from '../../feature/crumbSlice'

const BreadCrumbs = ({ setSkipFalse }) => {
    const crumb = useSelector(state => state.crumb.value)
    const dispatch = useDispatch()
    
    const handleClick = () =>{
        setSkipFalse()
        dispatch(setDelim('/'))
        dispatch(setSearch(''))
        dispatch(setCrumb(''))
    }

  return (
    <Box sx={{ml: 15, mt:1}}>
        <Breadcrumbs>
            <Typography onClick={() => handleClick()} sx={{cursor:"pointer"}}>
                Root
            </Typography>
            <Typography>
                {crumb}
            </Typography>
        </Breadcrumbs>
    </Box>
  )
}

export default BreadCrumbs
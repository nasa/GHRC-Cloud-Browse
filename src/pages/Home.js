import { Box, TextField, Typography } from '@mui/material'
import React from 'react'
import { useState } from "react"
import { useDispatch } from 'react-redux'
import { setSearch } from '../feature/searchSlice'

const Home = () => {
  const [search, setLocSearch] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = () =>{
    dispatch(setSearch(search))
  }

  return (
    <Box sx={{width: '70%', p:1}}
    display='flex'
    justifyContent='left'
    margin= 'auto'
    marginTop={10}>
      <Typography variant='h6'>
          test
      </Typography>
      <TextField
        variant='outlined'
        id='searchfield'
        label='Search'
        value={search}
        onChange={(event) => setLocSearch(event.target.value)}
        onKeyDown={event => event.key === 'Enter' ? handleSubmit(): ''}
        sx={{ml: 70}} />
    </Box>
  )
}

export default Home
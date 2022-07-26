import { TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDelim } from '../../feature/delimSlice'
import { setSearch } from '../../feature/searchSlice'

const SearchBar = () => {
    const [localSearch, setLocalSearch] = useState('')
    const dispatch = useDispatch()
    const delim = useSelector(state => state.delim.value)


    const handleSubmit = () =>{
        //TODO: Add logic for advance search optimization
        dispatch(setSearch(localSearch))
        if(delim === '/'){dispatch(setDelim(''))}
    }


    return (
        <>
            <TextField
                variant='outlined'
                lable='Search'
                id='searchFeild'
                value={localSearch}
                onChange={event => setLocalSearch(event.target.value)}
                onKeyDown={event => event.key === 'Enter' ? handleSubmit(): ''}
                sx={{width: '40%'}}
            />
        </>
    )
}

export default SearchBar

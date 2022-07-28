import { TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setDelim } from '../../feature/delimSlice'
import { setSearch } from '../../feature/searchSlice'


const SearchBar = ({ setSkipFalse }) => {
    
    const delim = useSelector(state => state.delim.value)
    const [localSearch, setLocalSearch] = useState('')
    const dispatch = useDispatch()


    const handleSubmit = () =>{
        //TODO: Add logic for advance search optimization
        setSkipFalse()

        if(localSearch === '' || localSearch === '/'){
            //condition to reset to top of file structure
            dispatch(setDelim('/'))
            dispatch(setSearch(''))
            return
        } else if(delim === '/'){
            //handles search from base of file structure
            dispatch(setDelim(''))
        }
        dispatch(setSearch(localSearch))
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

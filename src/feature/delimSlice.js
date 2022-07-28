import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value: '/'
}

export const delimSlice = createSlice({
    name: 'delim',
    initialState,
    reducers: {
        setDelim: (state, action) => {
            //sets state to given value
            state.value = action.payload
        },
    },
})

export const { setDelim } = delimSlice.actions

export default delimSlice.reducer
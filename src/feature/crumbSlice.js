import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value: ''
}

export const crumbSlice = createSlice({
    name: 'crumb',
    initialState,
    reducers: {
        setCrumb: (state, action) => {
            //sets state to given value
            state.value = action.payload
        },
    },
})

export const { setCrumb } = crumbSlice.actions

export default crumbSlice.reducer
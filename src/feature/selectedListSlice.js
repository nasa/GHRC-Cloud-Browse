import { createSlice } from "@reduxjs/toolkit";

const initialState={
    value: []
}

export const selectedListSlice = createSlice({
    name: 'selectedList',
    initialState,
    reducers: {
        setSelectedList: (state, action) => {
            //sets state to given value
            state.value = action.payload
        },
    },
})

export const { setSelectedList } = selectedListSlice.actions

export default selectedListSlice.reducer